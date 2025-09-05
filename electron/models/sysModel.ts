import { BaseResult } from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import Store from 'electron-store'
import { app } from 'electron'

export const getSysConfig = () => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        const store = new Store({
            defaults: {
                sysConfig: {
                    maxDownloadCount: 3,
                    downloadUrl: app.getPath('downloads'),
                    isLimitSpeed: false,
                    limitSpeed: 500,
                    useProxy: false,
                    proxyPortal: 'http',
                    proxyHost: '',
                    proxyPort: '',
                }
            }
        })

        res.data = {
            ...store.get('sysConfig'),
            platform: process.platform
        }
        global.sysConfig = res.data
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "获取系统失败"+error.message
        console.warn(error.message)
    }

    return res
}
