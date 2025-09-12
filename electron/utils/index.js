import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app } = require("electron");
import { join } from 'path'

export const publicDir = () => {
  /* 执行node命令时候的文件夹地址 */
  const node_serve_path = process.resourcesPath
  const PUBLIC_PATH = '/public'
  console.warn(111111)
  /* 判断是否是生产环境 */
  const isPackaged = app.isPackaged
  /* 需要读写的文件地址 */
  let file_path = ''
  if (!isPackaged) {
    //开发环境
    file_path = join(process.cwd(), PUBLIC_PATH)
  } else {
    //正式环境
    switch (process.platform) {
      case 'win32':
        file_path = join(node_serve_path, PUBLIC_PATH)
        break
      case 'darwin':
        file_path = join(node_serve_path, PUBLIC_PATH)
        break
      case 'linux':
        file_path = join(node_serve_path, PUBLIC_PATH)
        break
    }
  }

  return file_path
}

