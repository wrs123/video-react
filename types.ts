import {AnalyzeType, DownloadFileType, DownloadStatus, ResultStatus} from "./src/shared/enums.ts";

interface DownloadTaskType {
    id: string, //下载任务id
    originUrl: string, //原视频地址
    status: DownloadStatus, //下载状态
    TotalBytes: number, //视频总字节数
    receivedBytes: number, //已下载的字节数
    savePath: string, //下载的本地地址
    createTime: string,
    finishTime: string,
    speed: number,
    name: string, //文件名
    analysisUrl: string, //解析后的下载地址
    suffix: string //文件后缀
    fileType: DownloadFileType,
    cover?: string, //文件预览图
    analyzeType?: AnalyzeType
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

interface CookieType {
    id: number;
    domain: string;
    cookies: string;
    updateTime?: string;
}

export type {
    DownloadTaskType,
    BaseResult,
    DownloadAnalysisType,
    CookieType
}
