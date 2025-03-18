import {DownloadStatus, ResultStatus} from "./enums.ts";

interface DownloadType {
    name: string,
    status: DownloadStatus,
    percent: number,
    path: string,
    size: number,
    finishSize: number
}

interface BaseResult {
    code: number,
    status: ResultStatus,
    message: string,
    data: any
}

export type {
    DownloadType,
    BaseResult
}
