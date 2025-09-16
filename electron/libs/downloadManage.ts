import { DownloadItem, BrowserWindow} from 'electron'
import path from 'path'
import {DownloadAnalysisType, DownloadTaskType} from "../../types.ts";
import {DownloadStatus} from "../../enums.ts";
import {updateDownloadStatus} from "../models/downloadModel.ts";
import moment from 'moment'
import {publicDir} from "../utils";
import YTDlpWrap from 'yt-dlp-wrap';
import { resolve } from 'path';
import { spawn } from "child_process";

/**
 * 将类似 "12.3MiB"、"2.5MB"、"3.21MiB/s" 的字符串转换为字节数
 * @param {string} sizeStr
 * @returns {number} 字节数
 */
function _parseSizeToBytes(sizeStr) {
    if (!sizeStr) return 0;

    const units = {
        B: 1,
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
        TB: 1024 ** 4
    };

    sizeStr = sizeStr.trim().toUpperCase();

    // 匹配数字 + 单位，支持带空格
    const match = sizeStr.match(/([\d.]+)\s*([KMGT]?I?B)/);
    if (!match) return 0;

    let [_, num, unit] = match;
    num = parseFloat(num);

    // IEC 单位转换，例如 MiB → MB
    if (unit.endsWith("IB")) unit = unit[0] + "B";

    return Math.round(num * (units[unit] || 1));
}


/**
 * 拓展下载
 * @param downloadObj
 * @param savePath
 * @param downloadTask
 * @constructor
 */
export function DownloadFileByDirectURL(downloadObj : DownloadAnalysisType, savePath: string, downloadTask:DownloadTaskType){
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
                downloadTask.status = DownloadStatus.FINISH
                downloadTask.TotalBytes = item.getTotalBytes()
                downloadTask.receivedBytes = item.getReceivedBytes()
                downloadTask.finishTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                updateDownloadStatus(downloadTask)
            } else {
                console.log('download fail:', state)
                downloadTask.status = DownloadStatus.ERROR
                updateDownloadStatus(downloadTask)
            }
        })
    })

    win.webContents.downloadURL(downloadObj.analysisUrl)
}


/**
 * 通用下载
 * @constructor
 */
export function DownloadFileByOriginalURL(downloadTask:DownloadTaskType, ytDlpArgument: string[]){
    //通用解析
    const ffmpegPath = resolve(publicDir(), 'ffmpeg/ffmpeg');
    const savePath = resolve(global['sysConfig'].savePath, '%(title)s.%(ext)s')

    ytDlpArgument.splice(2, 0, ffmpegPath )
    ytDlpArgument.splice(2, 0, "--ffmpeg-location" )
    ytDlpArgument.splice(2, 0, "bv*+ba/b" )
    ytDlpArgument.splice(2, 0, "-f" )
    ytDlpArgument.splice(2, 0, savePath )
    ytDlpArgument.splice(2, 0, "-o" )
    ytDlpArgument.splice(2, 0, '{"type": "#DOWNLOAD#","percent": "%(progress._percent)s", "downloaded": "%(progress.downloaded_bytes)s", "total": "%(progress.total_bytes)s", "totalEstimate": "%(progress.total_bytes_estimate)s", "speed": "%(progress.speed)s"}' )
    ytDlpArgument.splice(2, 0, '--progress-template' )
    // ytDlpArgument.splice(2, 0, '--no-cache-dir' )
    // ytDlpArgument.splice(2, 0, '--print-json' )
    ytDlpArgument.splice(2, 0, '--newline' )

    const ytdlp = spawn(resolve(publicDir(), 'yt-dlp/yt-dlp'), ytDlpArgument, {stdio: ['ignore', 'pipe', 'pipe']})

    ytdlp.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(Boolean);
        lines.forEach((line) => {
            if(line.includes('#DOWNLOAD#')){
                const json = JSON.parse(line);

                downloadTask.status = DownloadStatus.PENDING
                downloadTask.TotalBytes = json.total === 'NA' ? json.totalEstimate : json.total
                downloadTask.receivedBytes = json.downloaded
                downloadTask.speed = json.speed
                updateDownloadStatus(downloadTask)
            }

        });
    });

    ytdlp.stderr.on('data', (data) => {
        console.error('err:', data.toString());
        // downloadTask.status = DownloadStatus.PAUSE
        // updateDownloadStatus(downloadTask)
    });

    ytdlp.on('close', (code) => {
        console.log('finish:', code);
        downloadTask.status = DownloadStatus.FINISH
        downloadTask.finishTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        updateDownloadStatus(downloadTask)
    });

}




