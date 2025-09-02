import {DownloadFileType, DownloadStatus, ResultStatus} from "./enums.ts";

interface DownloadTaskType {
    id: string, //下载任务id
    originUrl: string, //原视频地址
    status: DownloadStatus, //下载状态
    TotalBytes: number, //视频总字节数
    receivedBytes: number, //已下载的字节数
    savePath: string, //下载的本地地址
    fileObj: DownloadAnalysisType,
    speed: number,
    name: string, //文件名
    analysisUrl: string, //解析后的下载地址
    suffix: string //文件后缀
    fileType: DownloadFileType,
    cover?: string //文件预览图
}

interface BaseResult {
    code: number,
    status: ResultStatus,
    message: string,
    data: any
}

interface DownloadAnalysisType {
    fileName: string, //文件名
    analysisUrl: string, //解析后的下载地址
    suffix: string //文件后缀
    fileType: DownloadFileType,
    cover?: string //文件预览图
}

export type {
    DownloadTaskType,
    BaseResult,
    DownloadAnalysisType
}
