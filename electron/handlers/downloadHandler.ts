import { ipcMain  } from 'electron'
import {createTask, queryTask, deleteTask, reloadTask} from "../models/downloadModel.ts";
import {DownloadTaskType} from "../../types.ts";

export const DownloadHandler = () => {
    const DOMAIN = "download"


    ipcMain.handle(`${DOMAIN}:createTask`, async (_, param: any) => {
        return await createTask(param)
    })

    ipcMain.handle(`${DOMAIN}:reloadTask`, async (_, param: any) => {
        console.warn(111)
        return "ok"
    })

    ipcMain.handle(`${DOMAIN}:getTaskList`, async (_, param: any) => {
        return await queryTask(param)
    })

    ipcMain.handle(`${DOMAIN}:deleteTask`, async (_, param: any) => {
        return await deleteTask(param)
    })



}
