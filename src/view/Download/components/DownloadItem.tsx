import styles from './DownloadItem.module.scss'
import { DownloadTaskType} from "../../../../types.ts";
import { DownloadStatus, ResultStatus} from "../../../../enums.ts";
import { message, Modal, Tooltip, Dropdown, Space, Checkbox } from "antd";
import { CaretRightOutlined, CloseOutlined, FileTextFilled, HddFilled, ReloadOutlined, LinkOutlined, DeleteOutlined, FolderOpenOutlined, PauseOutlined} from '@ant-design/icons';
import { Else, If, Then} from 'react-if';
import { fileSizeFormat, percentParse} from '../../../utils/tools.ts'
import API from "../../../request/api.ts";
import { useEffect, useState} from 'react';
import type { MenuProps } from 'antd';


interface DownloadItemProps {
    item?: DownloadTaskType,
    status: number,
    index?: number,
    commandCommon?: (type: string, item: DownloadTaskType) => Promise<void>
}

function DownloadItem(props: DownloadItemProps) {

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
    const [taskItem , setTaskItem] = useState<DownloadTaskType>()
    const copyLinkItems: MenuProps['items'] = [
        {
            label: '复制原地址',
            key: 'originUrl',
            icon: <HddFilled />,
        },
        {
            label: '复制解析地址',
            key: 'analysisUrl',
            icon: <FileTextFilled />

        }
    ]

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

    const copyLink: MenuProps['onClick'] = async (key: string, item: DownloadTaskType) => {
        console.warn(key, item)
        copyToClipBoard(item[key])
    }

    const copyToClipBoard = (url: string) => {
        navigator.clipboard.writeText(url)
            .then(function() {
                messageApi.open({
                    type: 'success',
                    content: '复制成功',
                });
            })
            .catch(function(err) {
                messageApi.open({
                    type: 'warning',
                    content: '复制失败，请重试',
                });
            });
    }

    const deleteTask = async (item: DownloadTaskType, showConfrim: boolean = false) => {
        try{
            let confirmed = true
            let isDelFile = false
            if(showConfrim){
                confirmed = await modal.confirm({
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
                            <Checkbox style={{marginTop: '6px'}} onChange={(e) => {
                                isDelFile = e.target.checked
                            }}>同时删除文件</Checkbox>
                        </>
                    ),
                });
            }
            if(showConfrim && !confirmed){
                return
            }

            props.commandCommon && props.commandCommon('DELETE', item)
        }catch(e){
            console.error(e)
        }

    }


    useEffect(() => {
        setTaskItem(props.item)

        if(props.status === 0){

            window['onDownloadUpdate'].get((event: unknown, str: DownloadTaskType) => {
                if(props.item.id === str.id){
                    if(str.status === DownloadStatus.FINISH){
                        props.commandCommon && props.commandCommon('DELETE', str)
                    }else{
                        setTaskItem({...taskItem, ...str})
                    }
                }
            })
        }
    }, [])


    // @ts-ignore
    return (
        // style={{backgroundImage: `url("${item?.fileObj.cover ?? ''}")`}}
        <div  className={`${styles.downloadItem} ${taskItem?.status == DownloadStatus.ANAL ? styles.loader : ''}
            ${styles.downloadItem} ${taskItem?.status == DownloadStatus.ANALERROR ? styles.loaderErr : ''}
        `} >
            {confrimContextHolder}
            {messageContextHolder}
            <If condition={taskItem?.cover}>
                <Then>
                    <div className={styles.downloadCover}>
                        <div className={styles.mask} style={{width: `${100 - percentParse(taskItem?.receivedBytes, taskItem?.TotalBytes)}%`}}></div>
                        <img  src={taskItem?.cover} alt=""/>
                    </div>
                </Then>
            </If>
            <div className={`${styles.leftContainer} ${taskItem?.status == DownloadStatus.FINISH ? styles.full : ''}` }>
                <div className={styles.title}>{taskItem?.name}</div>
                <div className={styles.content}>
                    <div className={styles.contentRight}>
                        <If condition={() => taskItem?.status === DownloadStatus.ANAL}>
                            <div className={styles.actionGroup}>
                                <Tooltip title="复制原地址">
                                    <div className={styles.actionButton} onClick={() => copyToClipBoard(taskItem?.originUrl)}>
                                        <LinkOutlined />
                                    </div>
                                </Tooltip>
                            </div>
                        </If>
                        <If condition={() => taskItem?.status !== DownloadStatus.ANAL && taskItem?.status !== DownloadStatus.ANALERROR}>
                            <div className={styles.actionGroup}>
                                <Tooltip title="打开目录">
                                    <div className={styles.actionButton} onClick={() => openFolder(taskItem?.savePath)}>
                                        <FolderOpenOutlined />
                                    </div>
                                </Tooltip>
                                <Tooltip title="复制链接">
                                    <Dropdown menu={{ items: copyLinkItems, onClick: (e) => copyLink(e.key, taskItem) }} trigger={['click']}>
                                        <Space>
                                            <div className={styles.actionButton} >
                                                <LinkOutlined />
                                            </div>
                                        </Space>
                                    </Dropdown>
                                    {/*<div className={styles.actionButton} onClick={() => copyLink(taskItem)}>*/}
                                    {/*    <LinkOutlined />*/}
                                    {/*</div>*/}
                                </Tooltip>
                                <Tooltip title="删除">
                                    <div className={`${styles.actionButton} ${styles.danger}`} onClick={() => deleteTask(taskItem, true)}>
                                        <DeleteOutlined />
                                    </div>
                                </Tooltip>
                            </div>
                        </If>
                    </div>
                    <div className={styles.contentLeft}>

                        <If condition={() => taskItem?.status != DownloadStatus.FINISH && taskItem?.status != DownloadStatus.PENDING}>
                            <Then>
                                 <span style={{
                                     marginRight: '10px'
                                 }}>{statusParse(taskItem?.status)}</span>
                            </Then>
                        </If>
                        <If condition={taskItem?.status == DownloadStatus.FINISH}>
                            {fileSizeFormat(taskItem?.TotalBytes)}
                        </If>
                        <If condition={taskItem?.status == DownloadStatus.PENDING || taskItem?.status == DownloadStatus.PAUSE}>
                            <Then>
                                {fileSizeFormat(taskItem?.receivedBytes)}/{fileSizeFormat(taskItem?.TotalBytes)}
                                &nbsp;({percentParse(taskItem?.receivedBytes, taskItem?.TotalBytes)}%)
                            </Then>
                        </If>
                        <If condition={taskItem?.status == DownloadStatus.PENDING}>
                            <Then>
                                <div className={styles.speed}>{fileSizeFormat(taskItem?.speed)}/s</div>
                            </Then>
                        </If>
                    </div>

                </div>
            </div>
            <If condition={taskItem?.status == DownloadStatus.PENDING
                || taskItem?.status == DownloadStatus.PAUSE
                || taskItem?.status == DownloadStatus.ANAL
                || taskItem?.status == DownloadStatus.ANALERROR}>
               <Then>
                   <div className={styles.rightContainer}>
                       <If condition={taskItem?.status == DownloadStatus.PENDING}>
                           <Then>
                               <div className={styles.actionButton} onClick={() => props.commandCommon && props.commandCommon('PAUSE', taskItem)}>
                                   <PauseOutlined/>
                               </div>
                           </Then>
                       </If>
                       <If condition={taskItem?.status == DownloadStatus.PAUSE}>
                           <Then>
                               <div className={styles.actionButton} onClick={() => props.commandCommon && props.commandCommon('PAUSE', taskItem)}>
                                   <CaretRightOutlined/>
                               </div>
                           </Then>
                       </If>
                       <If condition={taskItem?.status == DownloadStatus.ANAL}>
                           <Then>
                               <div className={styles.actionButton} onClick={() => deleteTask(taskItem)}>
                                   <CloseOutlined />
                               </div>
                           </Then>
                       </If>
                       <If condition={taskItem?.status === DownloadStatus.ANALERROR}>
                           <Then>
                               <div className={styles.actionButton} onClick={() => deleteTask(taskItem)}>
                                   <ReloadOutlined />
                               </div>
                           </Then>
                       </If>
                   </div>
               </Then>
            </If>

        </div>
    )
}

export default DownloadItem
