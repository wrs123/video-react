import styles from './Download.module.scss'
import {Button, Modal, Space, Empty, List} from "antd";

import VirtualList from 'rc-virtual-list';
import {
    PlusOutlined,
    PauseOutlined
} from '@ant-design/icons';
import React, {useState, useEffect, useRef} from 'react'
import {DownloadTaskType } from "../../../types.ts";
import {DownloadStatus, ResultStatus} from "../../../enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"
import QueueAnim from 'rc-queue-anim';


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
    const [modal, confrimContextHolder] = Modal.useModal();
    const [total, setTotal] = useState(0);
    let page = {
        page: 1,
        pageSize: 15,
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const createSuccess = (_param: DownloadTaskType) => {
        console.log(_param);
        setIsModalOpen(false);
        setDownloadList(prevList => [_param, ...prevList]);
    };

    const createError = async (param) => {
        setIsModalOpen(false)

        const confirmed = await modal.confirm({
            title: `提示`,
            okText: '重新下载',
            cancelText: '查看任务',
            centered: true,
            content: "存在重复任务，是否继续？",
        });

        if(confirmed){
            alert(1)
        }else{

        }
    }

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
                const res = await API.deleteTask({id: item?.id})
                console.warn(res)
                if(res.status === ResultStatus.OK){
                    setDownloadList(prevList => prevList.filter(preItem => preItem.id !== item.id ));
                }
                break;
        }
    }

    // const onScroll  = async (e: React.UIEvent<HTMLElement>) => {
    //     if (
    //         e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
    //         listHeight
    //     ) {
    //         if( page.page * page.pageSize < total ){
    //            page.page += 1
    //             alert(JSON.stringify(page))
    //             console.warn(page)
    //             getTaskList()
    //         }
    //
    //     }
    // }

    const getTaskList = async () => {
        const _param = {
            status: props.status
        }

        const res = await API.getTaskList(_param)

        setDownloadList([
            ...downloadList,
            ...res.data.list || []
        ])
        // setDownloadList(res.data.list || [])
        setTotal(res.data.page.total)
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
            {confrimContextHolder}
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <div className={styles.leftTitle}>
                        <h1 >{props.status == 1 ? '已完成' : '下载中'}</h1>
                        <div className={styles.downloadCount}>{total}</div>
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
                            <VirtualList
                                data={ downloadList }
                                height={ listHeight }
                                itemKey="id"
                            >

                                {
                                    (item) => <MemoDownloadItem key={item.id} item={item} status={props.status} commandCommon={commandCommon}/>
                                }
                            </VirtualList>

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
                <CreateDialog onSubmit={createSuccess} onError={(param) => {createError(param)}}/>
            </Modal>
        </>
    )
}

export default Download
