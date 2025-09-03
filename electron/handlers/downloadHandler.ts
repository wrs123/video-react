import { ipcMain  } from 'electron'
import { createTask, queryTask, deleteTask } from "../models/downloadModel.ts";

export const DownloadHandler = () => {
    const DOMAIN = "download"

    ipcMain.handle(`${DOMAIN}:editTask`, async (_) => {
        return "ok"
    })

    ipcMain.handle(`${DOMAIN}:createTask`, async (_, param: any) => {
        return await createTask(param)
    })

    ipcMain.handle(`${DOMAIN}:getTaskList`, async (_, param: any) => {
        return await queryTask(param)
    })

    ipcMain.handle(`${DOMAIN}:deleteTask`, async (_, param: any) => {
        return await deleteTask(param)
    })

    ipcMain.handle(`${DOMAIN}:getVideoUrl`, async (_) => {

        return "ok"
    })


}
