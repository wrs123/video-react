import {BaseResult, DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadFileType, DownloadStatus, ResultStatus} from "../../enums.ts";
import {PathAnalysis} from "../libs/pathAnalysis.ts";
import DownloadFile from "../libs/downloadManage.ts";
import crypto from "crypto"

export function updateDownloadStatus(downloadTask:DownloadTaskType){
    updateTask(downloadTask)
    global.win.webContents.send('download:updateDownload', downloadTask)
}

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

//创建任务
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
            id: crypto.randomUUID({ disableEntropyCache: true }), //下载任务id
            originUrl: param.urls, //原视频地址
            status: DownloadStatus.ANAL, //下载状态
            TotalBytes: 0, //视频总字节数
            receivedBytes: 0, //已下载的字节数
            speed: 0,
            savePath: param.path, //下载的本地地址
            name: (new URL(param.urls)).origin, //文件名
            analysisUrl: "", //解析后的下载地址
            suffix: "", //文件后缀
            fileType: DownloadFileType.NONE,
            cover: ""
        }

        let query = []

        Object.keys(_data).forEach((key, val) => {
            console.warn(val, key)
            if(key !== 'speed'){
                query.push(key)
            }

        })
        await db
            .prepare(
                `INSERT INTO tasks (${query.join(',')}) VALUES (@${query.join(',@')})`
            )
            .run(_data)

        PathAnalysis(param.urls).then((analysisObj: DownloadAnalysisType) => {
            console.warn(analysisObj.analysisUrl)
            if(analysisObj.analysisUrl){
                _data.name = analysisObj.fileName
                _data.analysisUrl = analysisObj.analysisUrl
                _data.suffix = analysisObj.suffix
                _data.fileType = analysisObj.fileType
                _data.cover = analysisObj.cover

                DownloadFile(analysisObj, param.path, _data)
            }else{
                _data.status =  DownloadStatus.ANALERROR
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

    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '查询成功',
        data: ''
    }

    try{
        let query = ''
        if(param.status === 1){
            query = 'SELECT * FROM tasks WHERE status == ?'
        }else{
            query = 'SELECT * FROM tasks WHERE status != ?'
        }

        const _res = await db
            .prepare(query)
            .all(
                'FINISH'
            )

        console.warn(_res)

        res.data = _res
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
