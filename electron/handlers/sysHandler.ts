import { ipcMain  } from 'electron'
import {getSysConfig, setSysConfig} from "../models/sysModel.ts";

export const SysHandler = () => {
    const DOMAIN = "sys"

    /**
     * 获取系统设置
     */
    ipcMain.handle(`${DOMAIN}:getSysConfig`, async () => {
        return getSysConfig()
    })

    /**
     * 更新系统设置
     */
    ipcMain.handle(`${DOMAIN}:setSysConfig`, async (_, param) => {
        return setSysConfig(param)
    })

    /** 接收渲染进程 操作窗口 的通知
     * @param {Object} event
     * @param {String} windowName 需要操作的窗口名称
     * @param {String} operationType 操作类型
     */
    ipcMain.handle(`${DOMAIN}:operationWindow`, function (_, param) {

        const { type } =param
        const currOperationWindow: any = global?.win //当前操作的窗口实例
        // if (!currOperationWindow) return
        switch (type) {
            case 'max': //窗口 最大化
                currOperationWindow?.maximize()
                break
            case 'restore': //窗口 向下还原
                currOperationWindow?.unmaximize()
                break
            case 'min': //窗口 最小化
                currOperationWindow.minimize()
                break
            case 'close': //窗口 关闭
                currOperationWindow.close()
                break
        }
    })

}
