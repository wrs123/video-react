import { app, BrowserWindow, session, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { InitHandler } from "./handlers";
import {initDB} from "./db/init.ts";
import {getSysConfig} from "./models/sysModel.ts";
import {ResultStatus} from "../src/shared/enums.ts";


// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')
console.log('Node.js environment:', typeof __filename );

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let parseWin: BrowserWindow | null

/**
 * 创建主窗口
 */
function createWindow() {
  const isMac = process.platform === 'darwin'
  const isWin = process.platform === 'win32'

  const opts: any = {
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 750,
    minWidth: 1200,
    minHeight: 650,
    frame: false,
    // transparent: true,       // 需要透明以让 backdrop-filter / vibrancy 生效
    titleBarStyle: 'hiddenInset',
           // 通常无边框更好看（可选）

    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: true,
      webviewTag: true
    },
  }

  // 平台差异化设置
  if (isMac) {
    // macOS 原生 vibrancy（可选样式：sidebar, titlebar, full-screen-ui, selection, menu, popover, hud, sheet, window）
    opts.vibrancy = 'hud' // 或 'sidebar', 'hud' 等
    opts.visualEffectState = 'active'
  } else if (isWin) {
    // Windows 10/11 的 Material（Electron 新版本支持）
    // 可选: 'mica' 'acrylic' 'tabbed' 'auto'
    // 注意：Windows 上即便设置了，仍需要用户系统支持（Win10/11 才生效）
    opts.backgroundMaterial = 'acrylic'
  } else {
    // Linux：没有系统毛玻璃，保留透明并用 CSS 回退
  }


  win = new BrowserWindow(opts)

  if (process.platform === 'darwin') {
    win.setWindowButtonVisibility(true) // 显示原生按钮
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  console.warn(VITE_DEV_SERVER_URL)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.webContents.openDevTools()
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()

  }
})

const publicDir = () => {
  /* 执行node命令时候的文件夹地址 */
  const node_serve_path = process.resourcesPath
  const PUBLIC_PATH = '/public'
  // console.warn(node_serve_path)
  /* 判断是否是生产环境 */
  const isPackaged = app.isPackaged
  /* 需要读写的文件地址 */
  let file_path = ''
  if (!isPackaged) {
    //开发环境
    file_path = path.join(process.cwd(), PUBLIC_PATH)
  } else {
    //正式环境
    switch (process.platform) {
      case 'win32':
        file_path = path.join(node_serve_path, PUBLIC_PATH)
        break
      case 'darwin':
        file_path = path.join(node_serve_path, PUBLIC_PATH)
        break
      case 'linux':
        file_path = path.join(node_serve_path, PUBLIC_PATH)
        break
    }
  }

  return file_path
}

app.whenReady().then(async () => {
  global.__dirname = __dirname
  global.cachesPath = '.caches'
  global.cookiesPath = '.cookies'
  global.publicDir = publicDir()
  //初始化db实例并注册到全局
  global.db = initDB()
  global.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL
  global.MAIN_DIST = MAIN_DIST
  global.RENDERER_DIST = RENDERER_DIST

  //挂载系统代理
  const cookiesRes = getSysConfig()

  if(cookiesRes.status === ResultStatus.OK){
    const { data } = cookiesRes
    global.sysConfig = data
    if(data.useProxy){
      // 设置代理（例如 HTTP 代理）
      const ses = session.defaultSession;
      await ses.setProxy({
        proxyRules: `${data.proxyPortal}=${data.proxyHost}:${data.proxyPort}`
      });
    }
  }

  //创建窗口
  createWindow()
  //注册全局事件监听
  InitHandler()


  //全局注册窗口
  global.win = win
  global.downloadStack = []
  global.taskStack = {}

})
