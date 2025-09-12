// import puppeteer from "puppeteer";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { parentPort, workerData } = require("node:worker_threads");
const { connect } = require("puppeteer-real-browser");
import { resolve } from 'path';
const { spawn } = require("child_process");


const _pathMap = {
    "www.91porn.com": _91Pron,
}

async function PathAnalysisWorker(path, publicDir, cookies){
    console.warn(path)
    if(!path){
        return ''
    }

    const url = new URL(path)
    let isUniversal = false
    let res = null
    if(Object.hasOwn(_pathMap, url.hostname)){
        res = await _pathMap[url.hostname](path, publicDir)
    }else{
        isUniversal = true
        res = await _universalVideoParser(path, publicDir, cookies)
    }


    if(res.status === 'OK'){
        parentPort.postMessage({ type: "done", data: {...res.res, isUniversal } });
    }else{
        parentPort.postMessage({ type: "error", message: res.message });
    }
    return res
}


/**
 * 通用视频解析
 * @private
 */
async function _universalVideoParser(path, publicDir, cookies){
    const res = {
        status: 'OK',
        message: '解析成功',
        res: {
            analysisUrl: '', //下载地址
            fileName: '', //文件名称
            suffix: '.mp4', //文件后缀
            fileType: 'MP4',
            cover: ''
        }
    }
    return new Promise((rev, rej) => {
        try{
            const ytDlp = spawn(resolve(publicDir, 'yt-dlp/yt-dlp_macos'), ["--add-header", `Cookie: ${cookies}`, "-j", path]);

            let outPut = '',
                errorOutput = ""

            ytDlp.stdout.on("data", (data) => {
                outPut += data.toString();
            });

            ytDlp.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            ytDlp.on("close", (code) => {
                if (code === 0) {
                    try {
                        const info = JSON.parse(outPut);
                        res.res.fileName = info.title
                        res.res.cover = info.thumbnail
                        rev(res);
                    } catch (err) {
                        res.status = 'error'
                        res.message = err.message;
                        rej(res);
                    }
                } else {
                    res.status = 'error'
                    res.message = errorOutput;
                    rej(res);
                }
            });

        }catch(e){
            res.status = 'error'
            res.message = e.message;
            rej(res);
        }
    })
}


async function _91Pron(path){
    const res = {
        status: 'OK',
        message: '解析成功',
        res: {
            analysisUrl: '', //下载地址
            fileName: '', //文件名称
            suffix: '.mp4', //文件后缀
            fileType: "MP4",
            cover: ''
        }
    }

    try{
        const { browser, page } = await connect({
            headless: false,
            turnstile: true,
            disableXvfb: true,
            ignoreAllFlags: false,
            plugins: [require("puppeteer-extra-plugin-click-and-wait")()],
        });

        await page.goto(path, { waitUntil: ["domcontentloaded"] });
        const selector = "#player_one_html5_api"
        await page.waitForSelector(selector);
        const _videoElment = await page.$(selector+" source")
        const _coverElment = await page.$("#player_one_html5_api")
        const _title = await page.title();
        console.warn(_title)
        if(_title) res.res.fileName =  _title.replace(" Chinese homemade video", "")
        if(_videoElment){
            const _link = await _videoElment.getProperty('src');
            const _cover = await _coverElment.getProperty('poster')
            res.res.cover = await _cover.jsonValue()
            res.res.analysisUrl = await _link.jsonValue();

            console.warn('下载地址解析完成', res.res.analysisUrl)
        }
        await browser.close();

        return res
    }catch(e){
        res.status = 'ERROR'
        res.message = e.message

        return res
    }
}

try{
    const { path, publicDir, cookies } = workerData;
    await PathAnalysisWorker(path, publicDir, cookies)
}catch(err){
    parentPort.postMessage({ type: "error", message: err.message });
}

