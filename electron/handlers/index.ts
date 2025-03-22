import {DownloadHandler} from "./downloadHandler.ts";
import {FileHandler} from "./fileHandler.ts";
import {SysHandler} from "./sysHandler.ts";


export const InitHandler = () => {
    DownloadHandler()
    FileHandler()
    SysHandler()
}
