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

interface TabType {
    id: string;
    url: string;
    title?: string;
    favicon?: string;

    // 👇 关键：缓存 WebView 状态
    cachedState?: {
        scrollY: number;
        formInputs?: Record<string, string>; // 如搜索框内容
        extractedResources?: Resource[];     // 已解析的视频/音频链接
        lastHTML?: string;                  // 可选：完整 HTML 快照（慎用）
    };

    // 页面是否已“预热”（加载过）
    hasLoaded?: boolean;
}

export type {
    DownloadTaskType,
    BaseResult,
    DownloadAnalysisType,
    CookieType,
    TabType
}
