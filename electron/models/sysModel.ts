import { BaseResult } from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import { app } from 'electron'

export const getSysConfig = () => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.ERROR,
        message: '',
        data: ''
    }

    const _config = {
        downloadPath: app.getPath('downloads'),
        platform: process.platform
    }

    res.data = _config

    return res
}
