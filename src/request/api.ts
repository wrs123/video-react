const API = {
    request: window.ipcRenderer.invoke,

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

}

export default API
