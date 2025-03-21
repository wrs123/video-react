import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ipcRenderer', {
      on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
      },
      off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
      },
      send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
      },
      invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
      },
    })
    contextBridge.exposeInMainWorld('onDownloadUpdate', {
      get:(callback:any ) => {
        return ipcRenderer.on("download:updateDownload", callback)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
}
