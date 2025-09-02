import { resolve } from 'path'
import { createRequire } from 'node:module'
import fs from 'fs'
import { publicDir } from '../utils'
import createTables from './createTable'

const require = createRequire(import.meta.url)
// 连接数据库
const conDb = () => {
  const DB_NAME = 'sql.db'
  const DB_PATH = resolve(publicDir(), DB_NAME)

  try {

    if (!fs.existsSync(DB_PATH)) {
      // 数据库文件不存在，复制它
      fs.writeFileSync(DB_PATH, '')
    }

    const db = require('better-sqlite3')(DB_PATH, {})
    db.pragma('journal_mode = WAL')
    return db
  } catch (e) {
    console.warn('==error==', e.message)
    return e
  }
}

//初始化表
const initDB = () => {
  try {
    const db = conDb()
    createTables(db)
    return db
  } catch (e) {
    return ''
  }
}

export { initDB }
