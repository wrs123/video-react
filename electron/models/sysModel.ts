import { BaseResult } from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import Store from 'electron-store'
import { app } from 'electron'

const store = new Store()

/**
 * 获取系统设置
 */
export const getSysConfig = () => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        console.warn(store.has('sysConfig'))
        if(!store.has('sysConfig')){
            store.set('sysConfig', {
                maxDownloadCount: 3,
                downloadUrl: app.getPath('downloads'),
                isLimitSpeed: false,
                limitSpeed: 500,
                useProxy: false,
                proxyPortal: 'http',
                proxyHost: '',
                proxyPort: '',
                themeMode: 'auto',
                language: 'simpleChinese',
            })
        }

        console.warn('getSys', store.get('sysConfig'))
        res.data = {
            ...store.get('sysConfig'),

            platform: process.platform
        }
        global.sysConfig = res.data
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "获取系统失败"+error.message
        console.warn('err', error.message)
    }

    return res
}

/**
 * 更新系统设置
 * @param param
 */
export const setSysConfig = (param: any) => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        console.warn('获取', param)
        store.set('sysConfig', param)
        global.sysConfig = param
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "更新失败"+error.message
        console.warn('err', error.message)
    }

    return res
}
