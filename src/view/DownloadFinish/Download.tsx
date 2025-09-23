import styles from './Download.module.scss'
import {Button, Modal, Space, Empty} from "antd";
import {
    PlusOutlined,
    PauseOutlined
} from '@ant-design/icons';
import React, {useState, useEffect} from 'react'
import {DownloadTaskType} from "../../../types.ts";
import {DownloadFileType, DownloadStatus} from "../../shared/enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"

import DownloadItem from "./components/DownloadItem.tsx";
import API from "../../request/api.ts";

const MemoDownloadItem = React.memo(DownloadItem, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
})

function Download(props: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadList, setDownloadList] = useState<DownloadTaskType[]>([
        // {
        //     id: "string", //下载任务id
        //     originUrl: "string", //原视频地址
        //     status: DownloadStatus.ANAL, //下载状态
        //     TotalBytes: 11111, //视频总字节数
        //     receivedBytes: 2222222, //已下载的字节数
        //     savePath: "string", //下载的本地地址
        //     fileObj: {
        //         fileName: "string", //文件名
        //         analysisUrl: 'string', //解析后的下载地址
        //         suffix: ".mp4", //文件后缀
        //         fileType: DownloadFileType.M3U8
        //     },
        //     speed: 11
        // }
    ]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const createSuccess = (_param: DownloadTaskType) => {
        console.log(_param);
        setIsModalOpen(false);
        setDownloadList(prevList => [...prevList, _param]);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const commandCommon = async (type: string, item: DownloadTaskType) => {

        switch (type) {
            case "PAUSE":

                item.status = DownloadStatus.PAUSE;
                setDownloadList && setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "PUSH":
                item.status = DownloadStatus.PENDING;
                setDownloadList && setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "UPDATE":
                setDownloadList&& setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
        }
    }

    // if(props.status === 0){
    //     onDownloadUpdate.get((event: unknown, str: any) => {
    //         console.warn(str)
    //         commandCommon('UPDATE', str)
    //     })
    // }

    const getTaskList = async () => {
        const res= await API.getTaskList({status: props.status})

        setDownloadList(res.data || [])
        console.warn('下载列表', props.status , res.data)
    }

    useEffect(() => {
        console.warn(`页面渲染`, props.status)
        getTaskList()
    }, [])



    return (
        <>
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <div></div>
                    <div>
                        <Space>
                            <Button icon={<PauseOutlined />}></Button>
                            <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                                新建
                            </Button>
                        </Space>

                    </div>
                </div>
                <div className={styles.downloadList}>
                    <If condition={downloadList.length != 0}>
                        <Then>
                            {
                                downloadList.map((item: DownloadTaskType) => {
                                    return (
                                        <MemoDownloadItem key={item.id} item={item} commandCommon={commandCommon}/>
                                    )
                                })
                            }
                        </Then>
                        <Else>
                            <Empty style={{marginTop: '50px'}}/>
                        </Else>
                    </If>
                </div>
            </div>
            <Modal title="新建下载"
                   open={isModalOpen}
                   onCancel={handleCancel}
                   width="450px"
                   footer={null}
                   destroyOnClose
                   maskClosable={false}
            >
                <CreateDialog onSubmit={createSuccess}/>
            </Modal>
        </>
    )
}

export default Download
