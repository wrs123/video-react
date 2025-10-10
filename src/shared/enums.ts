export enum DownloadStatus {
    PENDING = 'PENDING',
    ERROR = 'ERROR',
    FINISH = 'FINISH',
    PAUSE = 'PAUSE',
    ANAL = 'ANAL', //解析中
    ANALERROR = 'ANALERROR', //解析失败
    COOKIEERROR = 'COOKIEERROR',
    DOWNLOADERROR = 'DOWNLOADERROR',
    MERGER = 'MERGER' //合并
}

export enum ResultStatus {
    ERROR = "ERROR",
    OK = "OK",
    COOKIE_ERROR = "COOKIE_ERROR",
    FORMAT_AVAILABLE = "FORMAT_AVAILABLE",
}

export enum ResultCode {
    ERROR = 500,
    OK = 200,
    COOKIE_ERROR = 1501,
    FORMAT_AVAILABLE = 150,
}

export enum DownloadFileType{
    NONE= "NONE",
    MP4 = "MP4",
    M3U8 = "M3U8",
}

export enum SysTheme {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

export enum AnalyzeType{
    UNIVERSAL = "UNIVERSAL",
    YTDLP = "YTDLP",
}
