import styles from './Download.module.scss'
import {Button, Modal, Space, Empty, Input} from "antd";

import VirtualList from 'rc-virtual-list';
import {
    PlusOutlined,
    PauseOutlined,
    SearchOutlined
} from '@ant-design/icons';
import React, {useState, useEffect, useRef} from 'react'
import {DownloadTaskType } from "../../../types.ts";
import {DownloadStatus, ResultStatus} from "../../shared/enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"
import QueueAnim from 'rc-queue-anim';
const { Search } = Input;

import DownloadItem from "./components/DownloadItem.tsx";
import API from "../../request/api.ts";
import { useCusStore } from "../../store";

const MemoDownloadItem = React.memo(DownloadItem, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) == JSON.stringify(nextProps)
})

function DownloadFinish(props: any) {
    const [listHeight, setListHeight] = useState(200);
    const downloadFinishList = useCusStore(state => state.downloadFinishList);
    const setDownloadFinishList = useCusStore(state => state.setDownloadFinishList);
    const listRef = useRef(null);
    const [modal, confrimContextHolder] = Modal.useModal();


    const commandCommon = async (type: string, item: DownloadTaskType, delSql: boolean = true) => {

        switch (type) {

            case "PUSH":
                item.status = DownloadStatus.PENDING;
            {
                const _downloadList = downloadFinishList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                )
                setDownloadFinishList(_downloadList)
            }
                break;
            case "UPDATE":
            {
                const _downloadList = downloadFinishList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                )
                setDownloadFinishList(_downloadList)
            }
                break;
            case "DELETE":
                if(delSql){
                    const res = await API.deleteTask({id: item?.id})
                    if(res.status === ResultStatus.OK){
                        const _downloadList = downloadFinishList.filter(preItem => preItem.id !== item.id )
                        setDownloadFinishList(_downloadList)
                    }
                }else{
                    const _downloadList = downloadFinishList.filter(preItem => preItem.id !== item.id )
                    setDownloadFinishList(_downloadList)
                }
                break;
        }
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
    }, [])





    return (
        <>
            {confrimContextHolder}
            <div className={styles.downloadContainer}>
                <div key={1} className={styles.containerTop}>
                    <Space>
                        <div className={styles.leftTitle}>
                            <h1 >已完成</h1>
                            <div className={styles.downloadCount}>{downloadFinishList.length}</div>
                        </div>

                    </Space>
                    <div>
                        <Space>
                            <Button icon={<SearchOutlined />}></Button>
                            <Button icon={<PauseOutlined />}></Button>
                            {/*<Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>*/}
                            {/*    新建*/}
                            {/*</Button>*/}
                        </Space>
                    </div>
                </div>
                <div key={2} className={styles.downloadList} ref={listRef}>
                    <If condition={downloadFinishList.length != 0}>
                        <Then>
                            <VirtualList
                                data={ downloadFinishList }
                                height={ listHeight }
                                itemKey="id"
                            >

                                {
                                    (item, index) =>
                                        <QueueAnim delay={ index * 20 } ease={'easeOutQuart'} duration={300} type={ 'right' } className={styles.downloadContainer}>
                                            <div key={item.id}>
                                                <MemoDownloadItem  item={item} status={ 1 } commandCommon={commandCommon}/>
                                            </div>
                                        </QueueAnim>
                                }
                            </VirtualList>
                        </Then>
                        <Else>
                            <Empty style={{marginTop: '50px'}}/>
                        </Else>
                    </If>
                </div>
            </div>
        </>
    )
}

export default DownloadFinish
