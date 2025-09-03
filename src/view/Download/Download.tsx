import styles from './Download.module.scss'
import {Button, Modal, Space, Empty, List} from "antd";
import VirtualList from 'rc-virtual-list';
import {
    PlusOutlined,
    PauseOutlined
} from '@ant-design/icons';
import React, {useState, useEffect, useRef} from 'react'
import {DownloadTaskType } from "../../../types.ts";
import { DownloadStatus } from "../../../enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"

import DownloadItem from "./components/DownloadItem.tsx";
import API from "../../request/api.ts";

const MemoDownloadItem = React.memo(DownloadItem, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
})

function Download(props: any) {
    const [listHeight, setListHeight] = useState(200);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const listRef = useRef(null);
    const [downloadList, setDownloadList] = useState<DownloadTaskType[]>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const createSuccess = (_param: DownloadTaskType) => {
        console.log(_param);
        setIsModalOpen(false);
        setDownloadList(prevList => [_param, ...prevList]);
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
                setDownloadList && setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "DELETE":
                setDownloadList(prevList => prevList.filter(preItem => preItem.id !== item.id ));
                break;
        }
    }

    if(props.status === 0){
        onDownloadUpdate.get((event: unknown, str: any) => {
            console.warn(str)
            commandCommon('UPDATE', str)
        })
    }

    const getTaskList = async () => {
        const res= await API.getTaskList({status: props.status})
        setDownloadList(res.data || [])
    }
    const handleResize = () => {
        if (listRef.current) {
            setListHeight(listRef.current.offsetHeight)
        }
    };

    useEffect(() => {
        console.warn(`页面渲染`, props.status)
        handleResize()
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        getTaskList()
    }, [])





    return (
        <>
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <div className={styles.leftTitle}>
                        <h1 >{props.status == 1 ? '已完成' : '下载中'}</h1>
                        <div className={styles.downloadCount}>{downloadList.length}</div>
                    </div>
                    <div>
                        <Space>
                            <Button icon={<PauseOutlined />}></Button>
                            <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                                新建
                            </Button>
                        </Space>
                    </div>
                </div>
                <div className={styles.downloadList} ref={listRef}>
                    <If condition={downloadList.length != 0}>
                        <Then>
                            <List>
                                <VirtualList
                                    data={ downloadList }
                                    height={ listHeight }
                                    itemKey="email"
                                >

                                    {
                                        (item, index) => (<MemoDownloadItem key={item.id} item={item} index={index} commandCommon={commandCommon}/>)
                                    }
                                </VirtualList>
                            </List>
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
