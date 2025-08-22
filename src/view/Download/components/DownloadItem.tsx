import styles from './DownloadItem.module.scss'
import {DownloadTaskType} from "../../../../types.ts";
import {DownloadStatus} from "../../../../enums.ts";
import {Button} from "antd";
import {
    CaretRightOutlined,
    LoadingOutlined,
    PauseOutlined,
    FolderOpenOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {If, Else, Then} from 'react-if';
import {fileSizeFormat, percentParse} from '../../../utils/tools.ts'
import API from "../../../request/api.ts";
import { useEffect } from 'react';


interface DownloadItemProps {
    item?: DownloadTaskType,
    commandCommon?: (type: string, item: DownloadTaskType) => Promise<void>
}

function DownloadItem({item, commandCommon}: DownloadItemProps) {

    const statusParse = (status: DownloadStatus | undefined) => {
        let res: string = ""

        switch (status) {
            case DownloadStatus.PENDING:
                res = "下载中"
                break;
            case DownloadStatus.PAUSE:
                res = "已暂停"
                break;
            case DownloadStatus.FINISH:
                res = "下载完成"
                break;
            case DownloadStatus.ANAL:
                res = "解析中"
                break;
            case DownloadStatus.ANALERROR:
                res = "解析失败"
                break;
            case DownloadStatus.ERROR:
                res = "下载失败"
                break;

        }
        return res
    }

    // const progressColor = (status: DownloadStatus | undefined) => {
    //     let res: string = ""
    //
    //     switch (status) {
    //         case DownloadStatus.PAUSE:
    //             res = "#d7d7d7"
    //             break;
    //         case DownloadStatus.PENDING:
    //             res = "var(--color-primary)"
    //             break;
    //         case DownloadStatus.ERROR:
    //             res = "#f2f2f2"
    //             break;
    //         case DownloadStatus.FINISH:
    //             res = "#f2f2f2"
    //             break;
    //     }
    //     return res
    // }

    const openFolder = async (path: string) => {
        const res = await API.openFolderPath({path: path})
        console.warn(res)
    }

    useEffect(() => {
        console.warn(`组件${item?.fileObj.fileName}渲染`)
    }, [])


    // @ts-ignore
    return (
        // style={{backgroundImage: `url("${item?.fileObj.cover ?? ''}")`}}
        <div  className={`${styles.downloadItem} ${item?.status == DownloadStatus.ANAL ? styles.loader : ''}`} >
            <If condition={item?.fileObj.cover}>
                <Then>
                    <div className={styles.downloadCover}>
                        <div className={styles.mask} style={{left: `${percentParse(item?.receivedBytes, item?.TotalBytes)}%`}}></div>
                        <img  src={item?.fileObj.cover} alt=""/>
                    </div>
                </Then>
            </If>
            <div className={styles.leftContainer}>
                <div className={styles.title}>{item?.fileObj.fileName}</div>
                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <If condition={item?.status == DownloadStatus.FINISH}>
                            <Then>
                                {fileSizeFormat(item?.TotalBytes)}
                            </Then>
                        </If>
                        <If condition={item?.status == DownloadStatus.PENDING || item?.status == DownloadStatus.PAUSE}>
                            <Then>
                                {fileSizeFormat(item?.receivedBytes)}/{fileSizeFormat(item?.TotalBytes)}
                                ({percentParse(item?.receivedBytes, item?.TotalBytes)}%)
                            </Then>
                        </If>
                        <If condition={item?.status != DownloadStatus.ANAL}>
                            <Then>
                                <div style={{paddingLeft: '10px'}}>
                                    <Button color="primary" icon={<FolderOpenOutlined />} variant="text" onClick={() => openFolder(item?.savePath)}></Button>
                                    <Button color="primary" icon={<DeleteOutlined/>} variant="text" ></Button>
                                </div>
                            </Then>
                        </If>
                    </div>
                    <div className={styles.contentRight}>
                        <If condition={item?.status == DownloadStatus.PENDING}>
                            <Then>
                                <span>{fileSizeFormat(item?.speed)}/s</span>
                            </Then>
                            <Else>
                                <span style={{
                                    fontSize: "12px",
                                    color: "var(--color-text-second)"
                                }}>{statusParse(item?.status)}
                                </span>
                            </Else>
                        </If>
                    </div>
                </div>
            </div>
            <If condition={item?.status == DownloadStatus.PENDING || item?.status == DownloadStatus.PAUSE || item?.status == DownloadStatus.ANAL}>
               <Then>
                   <div className={styles.rightContainer}>
                       <If condition={item?.status == DownloadStatus.PENDING}>
                           <Then>
                               <Button shape="circle" size="large" onClick={() => commandCommon && commandCommon('PAUSE', item)}
                                       color="primary"
                                       icon={<PauseOutlined/>} ghost variant="text"></Button>
                           </Then>
                       </If>
                       <If condition={item?.status == DownloadStatus.PAUSE}>
                           <Then>
                               <Button shape="circle" size="large" onClick={() => commandCommon && commandCommon('PAUSE', item)}
                                       color="primary"
                                       icon={<CaretRightOutlined/>} ghost variant="text"></Button>
                           </Then>
                       </If>
                       <If condition={item?.status == DownloadStatus.ANAL}>
                           <Then>
                               <LoadingOutlined style={{ fontSize: '20px'}} />
                           </Then>
                       </If>
                   </div>
               </Then>
            </If>
        </div>
    )
}

export default DownloadItem
