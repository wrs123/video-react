import styles from './DownloadItem.module.scss'
import {DownloadTaskType} from "../../../../types.ts";
import {DownloadStatus, ResultStatus} from "../../../../enums.ts";
import {Button, Tooltip, Modal, message } from "antd";
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
    index?: number,
    onDeleteTask: Function,
    commandCommon?: (type: string, item: DownloadTaskType) => Promise<void>
}

function DownloadItem({item, index, commandCommon}: DownloadItemProps) {

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
    const [modal, confrimContextHolder] = Modal.useModal();
    const [messageApi, messageContextHolder] = message.useMessage();


    const openFolder = async (path: string) => {
        const res = await API.openFolderPath({path: path})
        console.warn(res)
        if(res.status === ResultStatus.ERROR){
            messageApi.open({
                type: 'warning',
                content: res.message,
            });
        }
    }

    const deleteTask = async (item: DownloadTaskType, index: number) => {
        try{
            const confirmed = await modal.confirm({
                title: `提示`,
                okText: '确认',
                cancelText: '取消',
                centered: true,
                content: (
                    <>
                        确认删除
                        <span style={{color: "var(--color-primary)", fontWeight: 'bold'}}>
                            【{item.name.slice(0,15)}{item.name.length > 15 ? '...' : ''}】
                        </span>
                        吗?
                    </>
                ),
            });

            if(confirmed){
                const res = await API.deleteTask({id: item?.id})
                console.warn(res)
                if(res.status === ResultStatus.OK){
                    commandCommon && commandCommon('DELETE', item)
                }
            }
        }catch(e){
            console.error(e)
        }

    }



    useEffect(() => {
    }, [])


    // @ts-ignore
    return (
        // style={{backgroundImage: `url("${item?.fileObj.cover ?? ''}")`}}
        <div  className={`${styles.downloadItem} ${item?.status == DownloadStatus.ANAL ? styles.loader : ''}`} >
            {confrimContextHolder}
            {messageContextHolder}
            <If condition={item?.cover}>
                <Then>
                    <div className={styles.downloadCover}>
                        <div className={styles.mask} style={{width: `${100 - percentParse(item?.receivedBytes, item?.TotalBytes)}%`}}></div>
                        <img  src={item?.cover} alt=""/>
                    </div>
                </Then>
            </If>
            <div className={`${styles.leftContainer} ${item?.status == DownloadStatus.FINISH ? styles.full : ''}` }>
                <div className={styles.title}>{item?.name}</div>
                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <span style={{
                            marginRight: '10px'
                        }}>{statusParse(item?.status)}</span>
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

                            </Then>
                        </If>
                    </div>
                    <div className={styles.contentRight}>

                        <If condition={item?.status == DownloadStatus.PENDING}>
                            <Then>
                                <span>{fileSizeFormat(item?.speed)}/s</span>
                            </Then>
                            <Else>
                                <If condition={() => item?.status != DownloadStatus.ANAL}>
                                    <div className={styles.actionGroup}>
                                        <Tooltip title="打开目录">
                                            <div className={styles.actionButton} onClick={() => openFolder(item?.savePath)}>
                                                <FolderOpenOutlined />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="删除">
                                            <div className={`${styles.actionButton} ${styles.danger}`} onClick={() => deleteTask(item, index)}>
                                                <DeleteOutlined />
                                            </div>
                                        </Tooltip>
                                    </div>
                                </If>
                                <Else>

                                </Else>
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
                               <div className={styles.actionButton} onClick={() => commandCommon && commandCommon('PAUSE', item)}>
                                   <PauseOutlined/>
                               </div>
                           </Then>
                       </If>
                       <If condition={item?.status == DownloadStatus.PAUSE}>
                           <Then>
                               <div className={styles.actionButton} onClick={() => commandCommon && commandCommon('PAUSE', item)}>
                                   <CaretRightOutlined/>
                               </div>
                           </Then>
                       </If>
                       {/*<If condition={item?.status == DownloadStatus.ANAL}>*/}
                       {/*    <Then>*/}
                       {/*        <div className={styles.actionLoading}>*/}
                       {/*            <LoadingOutlined />*/}
                       {/*        </div>*/}

                       {/*    </Then>*/}
                       {/*</If>*/}
                   </div>
               </Then>
            </If>

        </div>
    )
}

export default DownloadItem
