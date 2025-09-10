import {BaseResult, DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadFileType, DownloadStatus, ResultStatus} from "../../enums.ts";
import DownloadFile from "../libs/downloadManage.ts";
import crypto from "crypto"
import moment from 'moment'
import { Worker } from "node:worker_threads";
import { resolve, dirname } from 'path';
import {publicDir} from "../utils";
import { spawn } from "child_process"


export function updateDownloadStatus(downloadTask:DownloadTaskType){
    updateTask(downloadTask)
    global.win.webContents.send('download:updateDownload', downloadTask)
}

/**
 * 地址解析worker
 * @param path
 */
const _analysisWorker = (path: string, id: string) => {
    return new Promise((rev, reject) => {
        //解析下载地址

        const analysisWorker = new Worker(resolve(publicDir(), 'pathAnalysisWorker.js'), {
            workerData: { path },

        });
        //线程入栈
        global.taskStack[id] = analysisWorker;

        analysisWorker.on("message", (msg) => {
            console.warn('接收消息', msg)
            if(msg.type === 'done'){
                rev(msg.data)
            }
            else if(msg.type === 'error'){
                reject(msg.message);
            }
            else{
                rev("")
            }
            //线程出栈
            delete global.taskStack[id]
            //销毁线程
            analysisWorker.terminate();
        });

        analysisWorker.on("error", (err) => {
            console.warn(`Worker error: ${err}`)
            reject(err);
        });

        analysisWorker.on("exit", (code) => {
            if (code !== 0) {
                console.warn(`Worker 停止，退出码: ${code}`)
                reject(new Error(`Worker 停止，退出码: ${code}`));
            }
        });
    })
}

/**
 * 更新任务
 * @param param
 */
export const updateTask = async (param) => {
    const db = global.db

    try{

        let query: any = []

        Object.keys(param).forEach((key, val) => {
            console.warn(val, key)
            if(key !== 'speed' && key != 'id'){
                query.push(`${key}=@${key}`)
            }

        })

        const update = db.prepare(`UPDATE tasks SET ${query.join(',')} WHERE id=@id`);
        const updateFunc = db.transaction((signs: any) => {
            for (const sign of signs) update.run(sign);
        });

        updateFunc([param])
    }catch(error: any){
        console.warn(error?.message)
    }
}

/**
 * 创建任务
 * @param param
 */
export const createTask = async (param: any) => {

    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '创建成功',
        data: ''
    }

    try{
        const _data: DownloadTaskType = {
            id: crypto.randomUUID(), //下载任务id
            originUrl: param.urls, //原视频地址
            status: DownloadStatus.ANAL, //下载状态
            TotalBytes: 0, //视频总字节数
            receivedBytes: 0, //已下载的字节数
            speed: 0,
            createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            finishTime: null,
            savePath: param.path, //下载的本地地址
            name: (new URL(param.urls)).origin, //文件名
            analysisUrl: "", //解析后的下载地址
            suffix: "", //文件后缀
            fileType: DownloadFileType.NONE,
            cover: ""
        }

        //查询重复任务
        const filterTask = await db.prepare(`SELECT * FROM tasks WHERE originUrl == ? `).all(param.urls);

        if((filterTask.length || []) > 0){
            res.status= ResultStatus.ERROR
            res.code = 202
            res.message = "存在相同下载"
            res.data = filterTask
            return res
        }


        //插入任务记录
        let query = []
        Object.keys(_data).forEach((key, val) => {
            if(key !== 'speed'){
                query.push(key)
            }
        })
        await db.prepare(`INSERT INTO tasks (${query.join(',')}) VALUES (@${query.join(',@')})`).run(_data)

        //通用解析
        const ytdlp = spawn(resolve(publicDir(), 'yt-dlp/yt-dlp_macos'), ["--cookies", `${resolve(publicDir(), 'yt-dlp/cookies.txt')}`, "chrome", "-o", `${resolve(global['sysConfig'].savePath, '%(title)s.%(ext)s') }`, param.urls]);

        ytdlp.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        ytdlp.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        ytdlp.on("close", (code) => {
            console.log(`下载进程退出: ${code}`);
        });


        return res

        // 通用解析外下载方法
        _analysisWorker(param.urls, param.id).then((analysisObj: any) => {
            if(analysisObj.analysisUrl){
                _data.name = analysisObj.fileName
                _data.analysisUrl = analysisObj.analysisUrl
                _data.suffix = analysisObj.suffix
                _data.fileType = analysisObj.fileType
                _data.cover = analysisObj.cover

                DownloadFile(analysisObj, param.path, _data)
            }else{
                _data.status = DownloadStatus.ANALERROR
                updateDownloadStatus(_data)
            }
        })

        // DownloadFile(analysisObj, param.path, _data)

        // setTimeout(() => {
        //     global.downloadStack[_taskid].pause()
        // }, 500)
        //
        // setTimeout(() => {
        //     global.downloadStack[_taskid].resume()
        // }, 3000)

        res.data = _data
    }catch(error){
        console.warn(error.message)
        res.status= ResultStatus.ERROR
        res.message = "创建失败"+error.message
    }

    return res
}

export const queryTask = async (param: any) => {
    const db = global.db
    const { page, pageSize } = param

    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '查询成功',
        data: ''
    }

    try{
        console.warn(param)
        let query = '',
            totalQuery = ''
        const querys = (val) => {
            return `SELECT * FROM tasks WHERE status ${val} ? ORDER BY createTime DESC `
        }
        const totalQuerys = (val) => {
            return `SELECT COUNT(*) as total FROM tasks WHERE status ${val} ?`
        }

        if(param.status === 1){
            query = querys('==')
            totalQuery = totalQuerys('==')
        }else{
            query = querys('!=')
            totalQuery = totalQuerys('!=')
        }

        const _res = await db
            .prepare(query)
            .all(
                'FINISH',
            )

        const stmt = db.prepare(totalQuery).all(
            'FINISH'
        );
        res.data = {
            list: _res,
            page: {
                page,
                pageSize,
                total: stmt[0].total
            }
        }
    }catch(error){
        console.warn(error.message)
        res.status= ResultStatus.ERROR
        res.message = "查询失败"+error.message
    }


    return res
}

//删除任务
export const deleteTask = async (param: any) => {
    const db = global.db

    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '删除成功',
        data: ''
    }

    try{
        if(global.taskStack[param.id]){
            //销毁线程
            global.taskStack[param.id].terminate();
            //线程出栈
            delete global.taskStack[param.id]
        }

        await db
            .prepare('DELETE FROM tasks WHERE id == ?')
            .run(
                param.id
            )
    }catch(error){
        console.warn(error.message)
        res.status= ResultStatus.ERROR
        res.message = "删除失败"+error.message
    }


    return res
}
