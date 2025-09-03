import {BaseResult} from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import { dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'

export const chooseFolderPath = async () => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.ERROR,
        message: '',
        data: ''
    }

    try{
        const directory = await dialog.showOpenDialog({properties: ['openDirectory']})

        if (!directory.canceled) {
            const directoryPath = directory.filePaths[0];
            console.log('Selected directory:', directoryPath);
            // 在这里处理选中的目录路径
            res.data = directoryPath
            res.status = ResultStatus.OK
            return res
        }
        return res
    }catch(e){
        return res
    }


}

export const openFolderPath = async (paths: string) => {
    const res: BaseResult = {
        code: 200,
        status: ResultStatus.OK,
        message: '',
        data: ''
    }

    try{
        if(!fs.existsSync(path.join(paths))){
            res.status = ResultStatus.ERROR
            res.message = '打开失败，目录不存在'
        }else{
            await shell.openPath(path.join(paths))
        }
    }catch(e){
        res.status = ResultStatus.ERROR
        res.message = '打开失败'+e.message
    }
    return res
}
