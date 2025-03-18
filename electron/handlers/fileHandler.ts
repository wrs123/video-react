import { ipcMain  } from 'electron'
import {chooseFolderPath} from "../models/fileModel.ts";

export const FileHandler = () => {
    const DOMAIN = "file"

    ipcMain.handle(`${DOMAIN}:chooseFolderPath`, async () => {
        return chooseFolderPath()
    })
}
