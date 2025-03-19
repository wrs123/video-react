import {BaseResult, DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadStatus, ResultStatus} from "../../enums.ts";
import { PathAnalysis } from "../libs/pathAnalysis.ts";
import DownloadFile from "../libs/downloadManage.ts";

export const getVideoUrl = async () => {

}

export const createTask = async (param: any) => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '创建成功',
        data: ''
    }
    console.warn(JSON.stringify(param))
    try{
        const analysisObj: DownloadAnalysisType = await PathAnalysis(param.urls)
        console.log('####地址解析为完成：'+ JSON.stringify(analysisObj))
        let _taskid:any = -1


        const _data: DownloadTaskType = {
            id: new Date().getTime(), //下载任务id
            originUrl: param.urls, //原视频地址
            status: DownloadStatus.ANAL, //下载状态
            TotalBytes: 0, //视频总字节数
            receivedBytes: 0, //已下载的字节数
            savePath: param.path, //下载的本地地址
            fileObj: analysisObj
        }

        if(analysisObj.analysisUrl){
            await DownloadFile(analysisObj, param.path, _data)
        }

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
