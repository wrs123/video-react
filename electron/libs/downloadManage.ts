import { DownloadItem, BrowserWindow} from 'electron'
import path from 'path'
import {DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadStatus} from "../../enums.ts";
import {updateDownloadStatus} from "../models/downloadModel.ts";


function DownloadFile(downloadObj : DownloadAnalysisType, savePath: string, downloadTask:DownloadTaskType){
    const win = new BrowserWindow({
        show: false,                // 初始不显示窗口
        skipTaskbar: true,          // 不在任务栏显示
        width: 1,                   // 最小化尺寸
        height: 1,
        x: 0,                       // 放在屏幕外（可选）
        y: 0,
        frame: false,               // 无边框
        transparent: true,          // 透明背景（可选）
        webPreferences: {
            nodeIntegration: true,    // 按需启用
            contextIsolation: false,  // 根据需求调整
            devTools: false           // 生产环境禁用开发者工具
        }
    })

    console.warn(JSON.stringify(downloadObj), savePath)

    win.webContents.session.once('will-download', (_, item: DownloadItem) => {
        console.warn('#####create download')

        let startTime: number = Date.now(); // 下载开始时间
        let previousBytes: number = 0;      // 上次已下载字节数

        //设置下载目录
        const filePath = path.join(savePath, downloadObj.fileName+downloadObj.suffix)
        item.setSavePath(filePath)

        console.warn(JSON.stringify(item))
        item.on('updated', (_, state) => {
            const currentBytes = item.getReceivedBytes(); // 当前已下载字节数
            const currentTime = Date.now();              // 当前时间

            // 计算下载速度
            const timeDiff = (currentTime - startTime) / 1000; // 时间差（秒）
            const bytesDiff = currentBytes - previousBytes;    // 字节差
            const speed = bytesDiff / timeDiff;               // 速度（字节/秒）

            // 更新上次记录
            previousBytes = currentBytes;
            startTime = currentTime;

            if (state === 'interrupted') {
                console.log('下载中断')
                downloadTask.status = DownloadStatus.PAUSE
                updateDownloadStatus(downloadTask)
            } else if (state === 'progressing') {
                const _progress = (Number(item.getReceivedBytes())/Number(item.getTotalBytes())).toFixed(2)
                console.log(`download progress: ${_progress}%`)
                downloadTask.status = DownloadStatus.PENDING
                downloadTask.TotalBytes = item.getTotalBytes()
                downloadTask.receivedBytes = item.getReceivedBytes()
                downloadTask.speed = speed
                updateDownloadStatus(downloadTask)
            }
        })

        item.on('done', (_, state) => {
            win.destroy()

            if (state === 'completed') {
                console.log('下载完成:', filePath, downloadTask)

                downloadTask.status = DownloadStatus.FINISH
                downloadTask.TotalBytes = item.getTotalBytes()
                downloadTask.receivedBytes = item.getReceivedBytes()
                updateDownloadStatus(downloadTask)
            } else {
                console.log('下载失败:', state)

                downloadTask.status = DownloadStatus.ERROR
                updateDownloadStatus(downloadTask)
            }
        })
    })

    win.webContents.downloadURL(downloadObj.analysisUrl)
}

export default DownloadFile



