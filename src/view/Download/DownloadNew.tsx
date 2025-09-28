import styles from './Download.module.scss'
import Download from "./Download.tsx";
import Icon, { PlusOutlined } from '@ant-design/icons';
import downloadingIcon from '../../assets/svgs/downloading-icon.svg?react'
import complateIcon from '../../assets/svgs/complate-icon.svg?react'
import { Button, Modal } from "antd";
import { useState } from 'react';
import Browser from "../Browser/Browser.tsx";
import {If, Else, Then} from 'react-if';
import DownLoad from '../Download/Download'
import QueueAnim from 'rc-queue-anim';
import DownloadFinish from "./DownloadFinish.tsx";
import CreateDialog from "./components/createDialog.tsx";
import {DownloadTaskType} from "../../../types.ts";
import {useCusStore} from "../../store";


const filterList = [
    {
        key: 'downloading',
        label: '正在下载',
        icon: <Icon component={ downloadingIcon }/>
    },
    {
        key: 'downloaded',
        label: '已完成',
        icon: <Icon component={ complateIcon }/>
    }
]

function DownloadNew(){
    const [activeFilter, setActiveFilter] = useState('downloading')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modal, confrimContextHolder] = Modal.useModal();
    const downloadingList = useCusStore(state => state.downloadingList);
    const setDownloadingList = useCusStore(state => state.setDownloadingList);

    const createSuccess = (_param: DownloadTaskType) => {
        console.log(_param);
        setIsModalOpen(false);
        setDownloadingList([_param, ...downloadingList]);
    };

    const createError = async (param) => {
        setIsModalOpen(false)
        console.log(param);

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
            // props.navigateFinishTask(param)
            setActiveFilter('downloaded')
        }
    }

    return (
        <>
            {confrimContextHolder}
            <QueueAnim delay={0} type={ 'bottom' } className={styles.downloadMain} >
                <div key={1} className={styles.downloadBar}>
                    <div className={styles.downloadBtn}>
                        <Button color="primary" variant="solid" icon={<PlusOutlined />} block
                            onClick={() => setIsModalOpen(true)}
                        >新建下载</Button>
                    </div>
                    {
                        filterList.map((item, index) => (
                            <div className={`${styles.barItem} ${activeFilter === item.key ? styles.active : ''}`} onClick={() => {
                                setActiveFilter(item.key)
                            }}>
                                { item.icon }
                                { item.label }
                            </div>
                        ))
                    }
                </div>
                <div key={2} className={styles.leftContainer}>
                    <If condition={activeFilter === 'downloading'}>
                        <Then>
                            <DownLoad key="1"/>
                        </Then>
                    </If>
                    <If condition={activeFilter === 'downloaded'}>
                        <Then>
                            <DownloadFinish key="2" />
                        </Then>
                    </If>
                </div>
            </QueueAnim>
            <Modal title="新建下载"
                   open={isModalOpen}
                   onCancel={() => setIsModalOpen(false)}
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

export default DownloadNew;
