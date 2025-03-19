import { DownloadItem} from 'electron'
import path from 'path'
import {DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadStatus} from "../../enums.ts";


function _updateDownloadStatus(downloadTask:DownloadTaskType){
    global.win.webContents.send('download:updateDownload', downloadTask)
}


function DownloadFile(downloadObj : DownloadAnalysisType, savePath: string, downloadTask:DownloadTaskType){
    const win = global.win
    console.warn(JSON.stringify(downloadObj), savePath)

    return new Promise((resolve, reject) => {
        // 监听下载事件
        win.webContents.session.on('will-download', (event: any, item: DownloadItem) => {

            //设置下载目录
            const filePath = path.join(savePath, downloadObj.fileName+downloadObj.suffix)
            item.setSavePath(filePath)

            console.warn(JSON.stringify(item))
            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('下载中断')
                    downloadTask.status = DownloadStatus.PAUSE
                    _updateDownloadStatus(downloadTask)
                } else if (state === 'progressing') {
                    const _progress = (Number(item.getReceivedBytes())/Number(item.getTotalBytes())).toFixed(2)
                    console.log(`下载进度: ${_progress}%`)
                    downloadTask.status = DownloadStatus.PENDING
                    downloadTask.TotalBytes = item.getTotalBytes()
                    downloadTask.receivedBytes = item.getReceivedBytes()
                    _updateDownloadStatus(downloadTask)
                }
            })

            item.on('done', (event, state) => {
                if (state === 'completed') {
                    console.log('下载完成:', filePath)
                    delete global.downloadStack[downloadTask.id]
                    downloadTask.status = DownloadStatus.FINISH
                    downloadTask.TotalBytes = item.getTotalBytes()
                    downloadTask.receivedBytes = item.getReceivedBytes()
                    _updateDownloadStatus(downloadTask)
                } else {
                    console.log('下载失败:', state)
                    delete global.downloadStack[downloadTask.id]
                    downloadTask.status = DownloadStatus.ERROR
                    _updateDownloadStatus(downloadTask)
                }
            })

            const _taskId: number = new Date().getTime()

            global.downloadStack[_taskId] = item
            resolve(_taskId)
        })

        win.webContents.downloadURL(downloadObj.analysisUrl)
    })


}

export default DownloadFile



