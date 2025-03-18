import {net} from 'electron'

export default class Network{

    get(url:string, options:any) {

        let data = ''
        options = options == null ? {} : options


        return new Promise(function(resolve, reject){
            const requs = net.request(url)

            requs.on('response',(response)=>{  //监听响应
                response.on('data',(chunk)=>{  //获取返回数据
                    // console.log(chunk.toString());
                    data += chunk
                })
                //监听结束
                response.on('end',()=>{
                    resolve(data);
                })

                response.on('error', (error: any) => {
                    reject(error)
                })
            })
            requs.end();
        })
    }

}


