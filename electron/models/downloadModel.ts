import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import {BaseResult, DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadFileType, DownloadStatus, ResultStatus} from "../../enums.ts";
import {DownloadFileByDirectURL, DownloadFileByOriginalURL} from "../libs/downloadManage.ts";
import crypto from "crypto"
import moment from 'moment'
const { Worker } = require("node:worker_threads");
import { resolve, dirname } from 'path';
import {publicDir} from "../utils/index.js";
import {getCookie} from "./sysModel.ts";
import fs from "fs";


async function _getCookie(domain){
    let res = ""

    const val = await getCookie({ domain })
    console.warn('cookie', domain)
    const { status, data } = val
    if(status == ResultStatus.OK){
        if(data){
            const _host = (new URL(domain)).hostname
            const _cookiePath = resolve(publicDir(), `.cookies/.cookies_${_host}.cks`)
            console.warn(_cookiePath)
            fs.writeFileSync(_cookiePath, data.cookies);
            res = _cookiePath
        }else{
            console.warn('no cookie found');
        }
    }
    return res
}


export function updateDownloadStatus(downloadTask:any){
    updateTask(downloadTask)
    global.win.webContents.send('download:updateDownload', downloadTask)
}

/**
 * 地址解析worker
 * @param path
 */
const _analysisWorker = (path: string, id: string, ytDlpArgument: string[]) => {
    return new Promise((rev, reject) => {
        //解析下载地址

        const analysisWorker = new Worker(resolve(global.__dirname, '../electron/worker/pathAnalysisWorker.js'), {
            workerData: { path, publicDir: publicDir(), ytDlpArgument},
            type: "module"
        });
        //线程入栈
        global.taskStack[id] = analysisWorker;

        analysisWorker.on("message", (msg) => {
            console.warn('接收消息', msg)
            rev(msg)
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
        console.warn('update task', param)
        Object.keys(param).forEach((key, val) => {
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

        //获取数据库内的网站cookie
        const _cookie = await _getCookie(_data.name)
        console.warn('get cookie success')

        const ytDlpArgument: string[] = [
            "--cookies", `${resolve(publicDir(), _cookie)}`,
            // "--add-header", `Cookie: ${cookies}`,
            param.urls
        ]

        if(global.sysConfig.useProxy){
            const { proxyPortal, proxyHost, proxyPort} = global.sysConfig
            ytDlpArgument.unshift(`${proxyPortal}://${proxyHost}:${proxyPort}`)
            ytDlpArgument.unshift('--proxy')
        }


        _analysisWorker(param.urls, param.id, ytDlpArgument).then((analysisObj: any) => {

            if(analysisObj.type === 'done'){
                const { data } = analysisObj;
                console.warn('isUniversal', data.isUniversal)

                _data.name = data.fileName
                _data.analysisUrl = data.analysisUrl
                _data.suffix = data.suffix
                _data.fileType = data.fileType
                _data.cover = data.cover

                if(data.isUniversal){
                    DownloadFileByOriginalURL(_data, ytDlpArgument)
                }else{
                    DownloadFileByDirectURL(analysisObj.data, param.path, _data)
                }
            }
            else {
                _data.status = DownloadStatus.ANALERROR
                updateDownloadStatus(_data)
            }
        })

        res.data = _data

        // DownloadFile(analysisObj, param.path, _data)

        // setTimeout(() => {
        //     global.downloadStack[_taskid].pause()
        // }, 500)
        //
        // setTimeout(() => {
        //     global.downloadStack[_taskid].resume()
        // }, 3000)
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
        console.warn('del start', param )
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
