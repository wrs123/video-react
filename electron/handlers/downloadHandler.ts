import { ipcMain, IpcMainInvokeEvent  } from 'electron'
import {chooseFolderPath} from "../models/fileModel.ts";
import {createTask, getVideoUrl} from "../models/downloadModel.ts";

export const DownloadHandler = () => {
    const DOMAIN = "download"

    ipcMain.handle(`${DOMAIN}:downloadFile`, async (event: IpcMainInvokeEvent, param: any) => {
        return "ok"
    })

    ipcMain.handle(`${DOMAIN}:createTask`, async (event: IpcMainInvokeEvent, param: any) => {
        return await createTask(param)
    })

    ipcMain.handle(`${DOMAIN}:getVideoUrl`, async (event: IpcMainInvokeEvent, param: any) => {

        return "ok"
    })
}
