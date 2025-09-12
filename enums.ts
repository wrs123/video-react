export enum DownloadStatus {
    PENDING = 'PENDING',
    ERROR = 'ERROR',
    FINISH = 'FINISH',
    PAUSE = 'PAUSE',
    ANAL = 'ANAL', //解析中
    ANALERROR = 'ANALERROR', //解析失败
    MERGER = 'MERGER' //合并
}

export enum ResultStatus {
    ERROR = "ERROR",
    OK = "OK"
}

export enum DownloadFileType{
    NONE= "NONE",
    MP4 = "MP4",
    M3U8 = "M3U8",
}
