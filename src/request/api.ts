import {getSysConfig} from "../../electron/models/sysModel.ts";

const API = {
    request: window.ipcRenderer.invoke,

    /**
     * 下载文件
     * @param param
     */
    getTaskList : (param: any) => {
        return API.request('download:getTaskList', param)
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
     * 修改下载任务
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
     * 窗口操作
     * @param param
     */
    operationWindow : (param: any = {}) => {
        return API.request('sys:operationWindow', param)
    }
}

export default API
