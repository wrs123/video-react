const createTables = async (db : any) => {
  console.log('=======start create table')

  /**
   * 下载任务表
   */
  db.exec(`create table if not exists tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    type varchar(64) NOT NULL,
    name varchar(100) NOT NULL UNIQUE,
    ctime DATETIME NOT NULL,
    etime DATETIME NOT NULL,
    path varchar(500) NOT NULL,
    importTextStepId INTEGER,
    picGenStepId INTEGER,
    videoGenStepId INTEGER,
    taskConfigStepId INTEGER,
    activeStep varchar(100)
  )`)

  /**
   * 系统设置表
   */


}

export default createTables
