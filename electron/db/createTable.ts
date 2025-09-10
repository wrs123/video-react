const createTables = async (db : any) => {
  console.log('=======start create table')


  /**
   * 下载任务表
   * type 任务类型  1完成 0进行中
   */
  db.exec(`create table if not exists tasks (
    id varchar(500) PRIMARY KEY NOT NULL,
    status varchar(10) NOT NULL,
    originUrl varchar(500) NOT NULL,
    TotalBytes INTEGER,
    receivedBytes INTEGER,
    savePath varchar(500) NOT NULL,
    name varchar(500), 
    analysisUrl varchar(500), 
    cover varchar(500),
    suffix varchar(10), 
    fileType varchar(10),
    createTime datetime NOT NULL,
    finishTime datetime
  )`)


  /**
   * 网站cookie表
   */
  db.exec(`create table if not exists cookies (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    domain varchar(64) NOT NULL,
    cookies TEXT NOT NULL,
    updateTime datetime
  )`)

}

export default createTables
