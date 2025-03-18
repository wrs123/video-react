"use strict";
const electron = require("electron");
if (process.contextIsolated) {
  try {
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
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}
