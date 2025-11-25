import styles from './windowTitleBar.module.scss'
import Icon, { LineOutlined, CompressOutlined, CloseOutlined, ExpandOutlined, PlusOutlined, FileOutlined } from '@ant-design/icons';
import {If, Else, Then} from 'react-if';
import {useState} from 'react'
import API from "../request/api.ts";
import logoIcon from "../assets/images/icon.png";
import DownloadIcon from '../assets/svgs/download.svg?react'
import DownloadFillIcon from '../assets/svgs/download-fill.svg?react'
import BrowserIcon from '../assets/svgs/browser.svg?react'
import BrowserFillIcon from '../assets/svgs/browser-fill.svg?react'
import SettingIconRound from '../assets/svgs/setting-icon-round.svg?react'
import searchIcon from '../assets/svgs/search-icon.svg?react'
import classnames from 'classnames';
import { Button } from "antd";
import moment from 'moment'

const stepList = [
    {
        label: '下载',
        key: 'download',
        icon: <Icon component={ DownloadIcon } />,
        activeIcon: <Icon component={ DownloadFillIcon } />
    },
    // {
    //     label: '嗅探',
    //     key: 'finish',
    //     icon: <Icon component={ BrowserIcon } />,
    //     activeIcon: <Icon component={ BrowserFillIcon } />
    // },
]

function WindowTitleBar(props: any) {

    const [isMaximized, setIsMaximized] = useState<boolean>(false)
    const [activeStep, setActiveStep] = useState<string>('download')
    const [ tabList, setTabList] = useState<any[]>([
        {
            name: '新标签',
            key: 'newTab',
            icon: <div class={styles.icon}><FileOutlined /></div>,
        }
    ])

    const [ activeTab, setActiveTab] = useState<string>('newTab')
    function onElectronOperationWindow(type: string){
        if (type == 'max') {
            setIsMaximized(true)
        }

        if (type == 'restore') {
            setIsMaximized(false)
        }

        API.operationWindow({
            type,
            windowKey: '',
        })
    }

    function addNewTab(){
        const key = moment().valueOf()
        setTabList([...tabList, {
            name: '新标签',
            key,
            icon: <div class={styles.icon}><FileOutlined /></div>,
        }])
        tabChange('tab', key)
    }

    function closeTab(e, activeTab){
        console.warn(e.stopPropagation, activeTab)
        e.stopPropagation();
        setTabList(prevList =>
            prevList.filter((item, index) => item.key !== activeTab.key)
        );
        tabChange('tab', tabList[tabList.length - 2].key)
    }

    function tabChange (type, key: string){
        setActiveTab(key)
        props.tabChange(type, key)
    }


    return (
        <div className={styles.windowTitleContainer}>
            <div className={styles.stepBar}>
                {/*<div className={styles.logoContainer}>*/}
                {/*    <img src={ logoIcon } alt="logo"/>*/}
                {/*</div>*/}

                <div className={styles.tabList}>
                    {
                        tabList.map((item, index) => (
                            <div
                                key={index}
                                className={classnames(styles.stepBarItem, styles.tabBar, activeTab === item.key && styles.active)}
                                onClick={ () => tabChange('tab', item.key)}
                            >
                                { item.icon }
                                <div className={ styles.itemLabel }>{item.name}</div>
                                <div className={styles.closeButton} onClick={(e) => closeTab(e, item)}>
                                    <CloseOutlined />
                                </div>
                                <div className={styles.tabDivider}></div>
                            </div>
                        ))
                    }
                    <div className={classnames(styles.stepBarItem, styles.active, styles.addBtn)}>
                        <Button
                            color="default"
                            variant="link"
                            size='large'
                            icon={<PlusOutlined />}
                            onClick={ addNewTab }
                        >
                            {/*软件设置*/}
                        </Button>
                    </div>
                </div>
                <div className={ classnames(styles.stepBarItem, styles.active, styles.fixBtn) }
                     onClick={() =>  tabChange('action', 'download')}
                >
                    <Icon component={ DownloadFillIcon } />
                    <span className={styles.itemLabel}>下载</span>
                </div>
                <div className={classnames(styles.stepBarItem, styles.active, styles.configBtn, styles.fixBtn)}>
                    <Button color="default" variant="link" size='large' icon={<Icon component={ searchIcon } />} onClick={props.openSysConfig}>
                        {/*软件设置*/}
                    </Button>
                </div>
                <div className={classnames(styles.stepBarItem, styles.active, styles.configBtn, styles.fixBtn)}>
                    <Button color="default" variant="link" size='large' icon={<Icon component={ SettingIconRound } />} onClick={props.openSysConfig}>
                        {/*软件设置*/}
                    </Button>
                </div>
            </div>
            <If condition={window['sysConfig'].platform != 'darwin'}>
                <Then>
                    <div className={styles.windowBottonGroup}>
                        <div className={styles.windowBotton} onClick={()=> onElectronOperationWindow('min')}>
                            <LineOutlined />
                        </div>
                        <If condition={!isMaximized}>
                            <Then>
                                <div className={styles.windowBotton} v-if="!isMaximized" onClick={ () => onElectronOperationWindow('max')}>
                                    <ExpandOutlined />
                                </div>
                            </Then>
                            <Else>
                                <div className={styles.windowBotton} v-if="isMaximized" onClick={() => onElectronOperationWindow('restore')}>
                                    <CompressOutlined />
                                </div>
                            </Else>
                        </If>
                        <div className={`${styles.windowBotton} ${styles.closeButton}`} onClick={() => onElectronOperationWindow('close')}>
                            <CloseOutlined />
                        </div>
                    </div>
                </Then>
            </If>
        </div>
    )
}

export default WindowTitleBar
