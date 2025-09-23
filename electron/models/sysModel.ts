import { BaseResult } from "../../types.ts";
import {ResultStatus} from "../../src/shared/enums.ts";
import Store from 'electron-store'
import { app } from 'electron'
import moment from 'moment'
import { BrowserWindow} from 'electron'
import path from "node:path";
import {objToURLParam} from "../../src/utils/tools.ts";
import {fileURLToPath} from "node:url";
const store = new Store()

/**
 * 创建解析窗口
 * @param param
 */
function _createParseWindow(param: string) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    const parseWin = new BrowserWindow({
        width: 1000,
        height: 700,
        parent: global.win,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true, // ✅ 允许 webview
        },
    });

    let _path: string = ''
    if (global.VITE_DEV_SERVER_URL) {
        _path = path.join(global.VITE_DEV_SERVER_URL, '#/parse')
    } else {
        _path = path.join(global.RENDERER_DIST, 'index.html')
    }
    _path += `?${param}`
    parseWin.loadURL(_path)
    parseWin.webContents.once("did-finish-load", () => {
        console.warn(111)
        parseWin.webContents.send("init-data", param);
    });

    parseWin.webContents.openDevTools()

    return parseWin;
}

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
                savePath: app.getPath('downloads'),
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
        const _sysConfig: any = store.get('sysConfig')
        res.data = {
            ..._sysConfig,
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
 * 添加cookie
 */
export const addCookie = async (param) => {
    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        param.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        console.warn(param)

        //插入任务记录
        let query = []

        Object.keys(param).forEach((key, val) => {
            if(key !== 'id'){
                query.push(key)
            }
        })

        await db.prepare(`INSERT INTO cookies (${query.join(',')}) VALUES (@${query.join(',@')})`).run(param)

    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "添加失败"+error.message
        console.warn('err', error.message)
    }

    return res
}


/**
 * 更新cookie
 */
export const updateCookie = async (param) => {
    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        param.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        console.warn(param)

        //插入任务记录
        let query = []

        Object.keys(param).forEach((key, val) => {
            if(key !== 'id'){
                query.push(`${key}=@${key}`)
            }
        })

        const update = db.prepare(`UPDATE cookies SET ${query.join(',')} WHERE id=@id`);
        const updateFunc = db.transaction((signs: any) => {
            for (const sign of signs) update.run(sign);
        });
        updateFunc([param])

    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "修改失败"+error.message
        console.warn('err', error.message)
    }

    return res
}

/**
 * 删除cookie
 */
export const delCookie = async (param) => {
    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        param.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        //插入任务记录
        await db
            .prepare('DELETE FROM cookies WHERE id == ?')
            .run(
                param.id
            )

    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "删除失败"+error.message
        console.warn('err', error.message)
    }

    return res
}

/**
 * 获取cookie列表
 */
export const getCookieList = async (param) => {
    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        console.warn(param)
        res.data = await db
            .prepare("SELECT * FROM cookies")
            .all()
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "获取cookie失败："+error.message
        console.warn('err', error.message)
    }

    return res
}

/**
 * 获取cookie详情
 */
export const getCookie = async (param) => {
    const db = global.db
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        const _data = await db
            .prepare("SELECT * FROM cookies WHERE domain == ?")
            .all(param.domain || '')

        res.data = _data[0]
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "获取cookie失败："+error.message
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


/**
 * 开启解析窗口
 * @param param
 */
export const openParseWindow = (param: any) => {
    return new Promise((rev, rej) => {
        const res: BaseResult = {
            code: 200,
            status: ResultStatus.OK,
            message: '',
            data: ''
        }



        const parseWin = _createParseWindow(objToURLParam(param));
        global.parseWindow = parseWin;
        parseWin.on("closed", () => {
            res.data = 'CLOSE'
            rev(res)
        });
    })
}

/**
 * 关闭解析窗口
 * @param param
 */
export const closeParseWindow = (param: any) => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        if(global.parseWindow){
            global.parseWindow.close()
        }
    }catch(error: any){
        res.status= ResultStatus.ERROR
        res.message = "关闭失败"+error.message
        console.warn('err', error.message)
    }

    return res
}
