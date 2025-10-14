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
    const { updateDownloadFinishList, pushDownloadFinishList } = useCusStore()
    const delDownloadFinishList = useCusStore(state => state.delDownloadFinishList);
    const listRef = useRef(null);
    const [modal, confrimContextHolder] = Modal.useModal();


    const commandCommon = async (type: string, item: DownloadTaskType, delSql: boolean = true) => {

        switch (type) {

            case "PUSH":
                item.status = DownloadStatus.PENDING;
                pushDownloadFinishList(item)
                break;
            case "UPDATE":
                updateDownloadFinishList(item)
                break;
            case "DELETE":
                const res = await API.deleteTask({id: item?.id})
                if(res.status === ResultStatus.OK){
                    delDownloadFinishList(item?.id)
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
                                itemHeight={ 76 }
                                itemKey="id"
                            >
                                {
                                    (item, index) =>
                                        <MemoDownloadItem key={item.id} item={item} status={ 1 } commandCommon={commandCommon}/>
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
