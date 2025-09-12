import { app, BrowserWindow } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { InitHandler } from "./handlers";
import {initDB} from "./db/init.ts";


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

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1200,
    height: 650,
    minWidth: 1200,
    minHeight: 650,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  if (process.platform === 'darwin') {
    win.setWindowButtonVisibility(true) // 显示原生按钮
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

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
  global.publicDir = publicDir()
  //初始化db实例并注册到全局
  global.db = initDB()


  //创建窗口
  createWindow()
  //注册全局事件监听
  InitHandler()

  //全局注册窗口
  global.win = win
  global.downloadStack = []
  global.taskStack = {}



})
