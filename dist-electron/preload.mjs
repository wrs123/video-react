"use strict";
const electron = require("electron");
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electronAPI", {
      onInitData: (callback) => electron.ipcRenderer.on("init-data", (event, data) => callback(data))
    });
    electron.contextBridge.exposeInMainWorld("ipcRenderer", {
      on(...args) {
        const [channel, listener] = args;
        return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
      },
      off(...args) {
        const [channel, ...omit] = args;
        return electron.ipcRenderer.off(channel, ...omit);
      },
      send(...args) {
        const [channel, ...omit] = args;
        return electron.ipcRenderer.send(channel, ...omit);
      },
      invoke(...args) {
        const [channel, ...omit] = args;
        return electron.ipcRenderer.invoke(channel, ...omit);
      }
    });
    electron.contextBridge.exposeInMainWorld("onDownloadUpdate", {
      get: (callback) => {
        return electron.ipcRenderer.on("download:updateDownload", callback);
      }
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
