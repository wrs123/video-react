import styles from './windowTitleBar.module.scss'
import Icon, { LineOutlined, CompressOutlined, CloseOutlined, ExpandOutlined, PlusOutlined, FileOutlined } from '@ant-design/icons';
import {If, Else, Then} from 'react-if';
import { useState, useEffect } from 'react'
import API from "../request/api.ts";
import DownloadIcon from '../assets/svgs/download.svg?react'
import BrowserIcon from '../assets/svgs/browser.svg?react'
import BrowserFillIcon from '../assets/svgs/browser-fill.svg?react'
import SettingIconRound from '../assets/svgs/setting-icon-round.svg?react'
import searchIcon from '../assets/svgs/search-icon.svg?react'
import logoIcon from '../assets/images/icon.png'
import classnames from 'classnames';
import { Button } from "antd";
import moment from 'moment'


function WindowTitleBar(props: any) {

    const [isMaximized, setIsMaximized] = useState<boolean>(false)
    const [ tabList, setTabList] = useState<any[]>([
        {
            name: '首页',
            key: 'home',
            icon: <Icon component={ DownloadIcon } />,
            activeIcon: <Icon component={ DownloadIcon } />
        }
    ])

    const [ activeTab, setActiveTab] = useState<string>('home')
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
        tabChange(tabList[tabList.length - 2].key)
    }

    function tabChange (type, key: string){
        setActiveTab(key)
        props.tabChange(key)
    }

    useEffect(() => {
        props.tabChange(activeTab)
    }, [])

    return (
        <div className={styles.windowTitleContainer}>
            <If condition={window['sysConfig'].platform != 'darwin'}>
                <Then><img className={styles.logo} src={ logoIcon } alt=""/></Then>
            </If>
            <div className={classnames(styles.stepBar, window['sysConfig'].platform != 'darwin' ? styles.winMode : '')}>
                {/*<div className={styles.logoContainer}>*/}
                {/*    <img src={ logoIcon } alt="logo"/>*/}
                {/*</div>*/}

                <div className={ styles.tabList }>
                    {/*<div className={ classnames(styles.stepBarItem, styles.tabBar, activeTab === 'download' && styles.active) }*/}
                    {/*     onClick={() => tabChange('action', 'download')}*/}
                    {/*>*/}
                    {/*    <Icon component={ DownloadIcon } />*/}
                    {/*    <span className={styles.itemLabel}>下载</span>*/}
                    {/*</div>*/}
                    {
                        tabList.map((item, index) => (
                            <div
                                key={index}
                                className={classnames(styles.stepBarItem, styles.tabBar, activeTab === item.key && styles.active)}
                                onClick={ () => tabChange('tab', item.key)}
                            >
                                { item.icon }
                                <div className={ styles.itemLabel }>{item.name}</div>
                                <If condition={item.key !== 'home'}>
                                    <Then>
                                        <div className={styles.closeButton} onClick={(e) => closeTab(e, item)}>
                                            <CloseOutlined />
                                        </div>
                                    </Then>
                                </If>
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

                <div className={classnames(styles.stepBarItem, styles.active, styles.configBtn, styles.fixBtn)}>
                    <Button color="default" variant="link" size='large' icon={<Icon component={ searchIcon } />} onClick={props.openSearch}>
                        {/*软件设置*/}
                    </Button>
                </div>
                <div className={classnames(styles.stepBarItem, styles.configBtn, styles.fixBtn)}>
                    <Button color="default" shape="circle" variant="text" size='default' onClick={props.openSysConfig}>
                        {/*软件设置*/}
                        <Icon component={ SettingIconRound } />
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
