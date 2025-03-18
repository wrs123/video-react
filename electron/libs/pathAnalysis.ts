import Network from '../utils/network'
import * as cheerio from 'cheerio'

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
    console.warn(path)

    let vid,title,src,
        durl = 'https://la.killcovid2021.com/m3u8/'

    try{
        const net = new Network()
        let html:any = await net.get(path)
        html = html.toString()

        let $ = cheerio.load(html)
        vid = $("div#VID").html()
        title = $("title").html().replace(/\s+/g,"").replace("Chinesehomemadevideo","")
        src = durl+vid+'/'+vid+'.m3u8'

        console.log('src:'+src)
    }catch(e){
        console.log(e)
    }

}
