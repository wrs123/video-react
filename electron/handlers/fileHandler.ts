import { ipcMain  } from 'electron'
import {chooseFolderPath, openFolderPath} from "../models/fileModel.ts";

export const FileHandler = () => {
    const DOMAIN = "file"

    ipcMain.handle(`${DOMAIN}:chooseFolderPath`, async () => {
        return chooseFolderPath()
    })

    ipcMain.handle(`${DOMAIN}:openFolderPath`, async (_, param: any) => {
        return await openFolderPath(param.path)
    })
}
