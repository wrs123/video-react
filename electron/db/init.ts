import { resolve } from 'path'
import Database from 'better-sqlite3'
import fs from 'fs'
import { publicDir } from '../utils'
import createTables from './createTable'

// 连接数据库
const conDb = () => {
  const DB_NAME = 'sql.db'
  const DB_PATH = resolve(publicDir(), DB_NAME)

  try {
    if (!fs.existsSync(DB_PATH)) {
      // 数据库文件不存在，复制它
      fs.writeFileSync(DB_PATH, '')
    }

    const db = new Database(DB_PATH, {})
    db.pragma('journal_mode = WAL')
    console.warn(JSON.stringify(db))
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
