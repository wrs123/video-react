import {delCookie, getCookieList, getSysConfig, setSysTheme} from "../../electron/models/sysModel.ts";

const API = {
    request: window.ipcRenderer.invoke,
    /**
     * 开启解析窗口
     * @param param
     */
    openParseWindow : (param: any) => {
        return API.request('sys:openParseWindow', param)
    },
    /**
     * 关闭解析窗口
     * @param param
     */
    closeParseWindow : (param: any) => {
        return API.request('sys:closeParseWindow', param)
    },

    /**
     * 获取任务列表
     * @param param
     */
    getTaskList : (param: any) => {
        return API.request('download:getTaskList', param)
    },
    /**
     * 删除任务
     */
    deleteTask : (param: any) => {
        return API.request('download:deleteTask', param)
    },
    /**
     * 下载文件
     * @param param
     */
    downloadFile : (param: any) => {
        return API.request('download:downloadFile', param)
    },
    /**
     * 创建下载任务
     * @param param
     */
    createTask : (param: any) => {
        return API.request('download:createTask', param)
    },
    /**
     * 下载任务通用操作
     * @param param
     */
    editTask : (param: any) => {
        return API.request('download:editTask', param)
    },
    /**
     * 获取本地目录
     * @param param
     */
    getFolderPath : (param: any = {}) => {
        return API.request('file:chooseFolderPath', param)
    },
    /**
     * 打开本地目录
     * @param param
     */
    openFolderPath : (param: any = {}) => {
        return API.request('file:openFolderPath', param)
    },
    /**
     * 获取软件配置
     * @param param
     */
    getSysConfig : (param: any = {}) => {
        return API.request('sys:getSysConfig', param)
    },
    /**
     * 获取cookieList
     * @param param
     */
    getCookieList : (param: any = {}) => {
        return API.request('sys:getCookieList', param)
    },
    /**
     * 添加cookie
     * @param param
     */
    addCookie : (param: any = {}) => {
        return API.request('sys:addCookie', param)
    },
    /**
     * 修改cookie
     * @param param
     */
    updateCookie : (param: any = {}) => {
        return API.request('sys:updateCookie', param)
    },
    /**
     * 删除cookie
     * @param param
     */
    delCookie : (param: any = {}) => {
        return API.request('sys:delCookie', param)
    },
    /**
     * 更新软件配置
     * @param param
     */
    setSysConfig : (param: any = {}) => {
        return API.request('sys:setSysConfig', param)
    },
    /**
     * 设置主题
     * @param param
     */
    setSysTheme : (param: any = {}) => {
        return API.request('sys:setSysTheme', param)
    },
    /**
     * 窗口操作
     * @param param
     */
    operationWindow : (param: any = {}) => {
        return API.request('sys:operationWindow', param)
    }

}

export default API
