import {BaseResult} from "../../types.ts";
import {ResultStatus} from "../../enums.ts";
import { dialog } from 'electron'

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
