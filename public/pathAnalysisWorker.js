// import puppeteer from "puppeteer";


import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { parentPort, workerData } = require("node:worker_threads");
const { connect } = require("puppeteer-real-browser");
import ytdl from "@distube/ytdl-core"

const _pathMap = {
    "www.91porn.com": _91Pron,
    "www.youtube.com": _youtube
}

async function PathAnalysisWorker(path){
    console.warn(path)
    if(!path){
        return ''
    }

    const url = new URL(path)
    const res = await _pathMap[url.hostname](path)

    if(res.analysisUrl){
        parentPort.postMessage({ type: "done", data: res });
    }else{
        parentPort.postMessage({ type: "error", message: '解析失败' });
    }
    return res
}



async function _youtube(path){
    const res = {
        analysisUrl: '', //下载地址
        fileName: '', //文件名称
        suffix: '.mp4', //文件后缀
        fileType: 'MP4'
    }

    try{
        // 获取视频信息
        const info = await ytdl.getInfo(path);

        res.fileName = info.videoDetails.title

        // 提取不同格式的下载地址
        const formats = info.formats.map((format) => ({
            quality: format.qualityLabel || 'audio', // 视频质量或音频
            mimeType: format.mimeType, // 文件类型（如 video/mp4）
            url: format.url, // 下载地址
        }));

        console.warn( res.fileName, JSON.stringify(formats));

        return res
    }catch(e){
        console.log(e)
        return res
    }

}


async function _91Pron(path){
    const res = {
        analysisUrl: '', //下载地址
        fileName: '', //文件名称
        suffix: '.mp4', //文件后缀
        fileType: "MP4",
        cover: ''
    }

    try{
        const { browser, page } = await connect({
            headless: false,
            turnstile: true,
            disableXvfb: true,
            ignoreAllFlags: false,
            plugins: [require("puppeteer-extra-plugin-click-and-wait")()],
            args: [
                // "--disable-blink-features=AutomationControlled", // 禁用自动化标记
                // '--no-sandbox', // 在某些环境中可能需要此参数，但请注意安全风险
                // '--disable-setuid-sandbox', // 同上
                // '--disable-dev-shm-usage', // 禁用 dev shm usage
                // '--disable-accelerated-2d-canvas', // 禁用硬件加速的 canvas
                // '--disable-gpu', // 禁用 GPU 加速，有时可以绕过某些验证
                // "--window-size=1920,1080", // 设置合理视口
            ],
        });

        await page.goto(path, { waitUntil: ["domcontentloaded"] });
        const selector = "#player_one_html5_api"
        await page.waitForSelector(selector);
        const _videoElment = await page.$(selector+" source")
        const _coverElment = await page.$("#player_one_html5_api")
        const _title = await page.title();
        if(_title) res.fileName =  _title.replace(" Chinese homemade video", "")
        if(_videoElment){

            const _link = await _videoElment.getProperty('src');
            const _cover = await _coverElment.getProperty('poster')
            res.cover = await _cover.jsonValue()
            res.analysisUrl = await _link.jsonValue();

            console.warn('下载地址解析完成', res.analysisUrl)
        }

        await browser.close();

        return res
    }catch(e){
        return {}

    }
}

try{
    const { path } = workerData;
    await PathAnalysisWorker(path)
}catch(err){
    parentPort.postMessage({ type: "error", message: err.message });
}

