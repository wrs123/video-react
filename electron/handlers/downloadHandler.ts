import { ipcMain, IpcMainInvokeEvent  } from 'electron'
import {chooseFolderPath} from "../models/fileModel.ts";
import { createTask } from "../models/downloadModel.ts";

export const DownloadHandler = () => {
    const DOMAIN = "download"

    ipcMain.handle(`${DOMAIN}:editTask`, async (_, param: any) => {
        return "ok"
    })

    ipcMain.handle(`${DOMAIN}:createTask`, async (_, param: any) => {
        return await createTask(param)
    })

    ipcMain.handle(`${DOMAIN}:getVideoUrl`, async (_, param: any) => {

        return "ok"
    })
}
