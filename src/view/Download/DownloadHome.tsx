import styles from './Download.module.scss'
import Download from "./Download.tsx";
import Icon, { CloseOutlined } from '@ant-design/icons';
import downloadingIcon from '../../assets/svgs/downloading-icon.svg?react'
import complateIcon from '../../assets/svgs/complate-icon.svg?react'
import recycleIcon from '../../assets/svgs/recycle-icon.svg?react'
import { Button, Modal, Input } from "antd";
import { useState, useRef } from 'react';
import Browser from "../Browser/Browser.tsx";
import {If, Else, Then} from 'react-if';
import DownLoad from '../Download/Download'
import QueueAnim from 'rc-queue-anim';
import DownloadFinish from "./DownloadFinish.tsx";
import CreateDialog from "./components/createDialog.tsx";
import {DownloadTaskType} from "../../../types.ts";
import {useCusStore} from "../../store";
import API from "../../request/api.ts";
import {ResultStatus} from "../../shared/enums.ts";
import SearchDialog from "./components/searchDialog.tsx";
import searchIcon from '../../assets/svgs/search-icon.svg?react'


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
    },
    {
        key: 'recycle',
        label: '回收站',
        icon: <Icon component={ recycleIcon }/>
    }
]

function DownloadHome(){
    const [activeFilter, setActiveFilter] = useState('downloading')
    const [modal, confrimContextHolder] = Modal.useModal();
    const [searchDialogVisible, setSearchDialogVisible] = useState<boolean>(false);
    const inputRef = useRef(null)

    return (
        <>
            {confrimContextHolder}
            <QueueAnim delay={0} type={ 'bottom' } className={styles.downloadMain} >
                <div key={1} className={styles.downloadBar}>
                    <div className={styles.downloadTitle}>我的下载</div>
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
                    <Input ref={ inputRef } prefix={ <Icon component={ searchIcon } /> } className={styles.searchBtn} placeholder="搜索下载过的文件" variant="filled" onClick={ () => {
                        inputRef.current.blur();
                        setSearchDialogVisible(true)
                    } } />
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
            <Modal
                title=""
                closable={ false }
                width={700}
                open={ searchDialogVisible }
                onCancel={ () => setSearchDialogVisible(false) }
                footer={ null }
                mask={ true }
                className={styles.searchContainer}
                styles={{
                    mask: {
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <SearchDialog close={ () => setSearchDialogVisible(false) } />
            </Modal>
        </>

    )
}

export default DownloadHome;
