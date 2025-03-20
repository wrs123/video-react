import { ipcMain  } from 'electron'
import {getSysConfig} from "../models/sysModel.ts";

export const SysHandler = () => {
    const DOMAIN = "sys"

    ipcMain.handle(`${DOMAIN}:getSysConfig`, async () => {
        return getSysConfig()
    })

}
