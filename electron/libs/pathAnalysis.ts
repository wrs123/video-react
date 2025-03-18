import puppeteer from "puppeteer";

const pathMap: any = {
    'www.91porn.com': _91Pron
}

export function PathAnalysis(path: string){
    console.warn(path)
    if(!path){
        return ''
    }

    const url = new URL(path)
    return pathMap[url.hostname](path)
}



async function _91Pron(path: string){
    let _downloadLink: any = ''

    try{
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--disable-blink-features=AutomationControlled", // 禁用自动化标记
                "--window-size=1920,1080", // 设置合理视口
            ],
        });
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        await page.setViewport({width: 1920, height: 1080});
        // 覆盖 WebDriver 属性（绕过反爬检测）
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => false,
            });
        });
        await page.goto(path, { waitUntil: ["domcontentloaded", "networkidle2"] });

        const _videoElment:any = await page.$("#videodetails .video-container video source")

        if(_videoElment){
            _downloadLink = await _videoElment.getProperty('src');
            _downloadLink = await _downloadLink.jsonValue();
        }
        await browser.close();
        return _downloadLink
    }catch(e){
        console.log(e)
    }

}
