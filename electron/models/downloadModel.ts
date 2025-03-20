import {BaseResult, DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadFileType, DownloadStatus, ResultStatus} from "../../enums.ts";
import { PathAnalysis } from "../libs/pathAnalysis.ts";
import DownloadFile from "../libs/downloadManage.ts";
import crypto from 'crypto'

export function updateDownloadStatus(downloadTask:DownloadTaskType){
    global.win.webContents.send('download:updateDownload', downloadTask)
}


export const createTask = async (param: any) => {
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
            fileObj: {
                fileName: (new URL(param.urls)).origin, //文件名
                analysisUrl: "", //解析后的下载地址
                suffix: "", //文件后缀
                fileType: DownloadFileType.NONE
            }
        }

        PathAnalysis(param.urls).then((analysisObj: DownloadAnalysisType) => {
            console.warn(analysisObj.analysisUrl)
            if(analysisObj.analysisUrl){
                _data.fileObj = analysisObj
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
        res.status= ResultStatus.ERROR
        res.message = "创建失败"+error
    }

    return res
}
