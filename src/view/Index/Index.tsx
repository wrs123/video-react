import styles from './Index.module.scss'
import { useState } from 'react'
import Icon, { GlobalOutlined, ControlOutlined, DownloadOutlined  } from '@ant-design/icons';
import DownloadIcon from '../../assets/svgs/download.svg?react'
import DownloadFillIcon from '../../assets/svgs/download-fill.svg?react'
import BrowserIcon from '../../assets/svgs/browser.svg?react'
import BrowserFillIcon from '../../assets/svgs/browser-fill.svg?react'
import SettingIcon from '../../assets/svgs/setting-icon.svg?react'
import classnames from 'classnames';
import DownloadNew from '../Download/DownloadNew'
import Config from '../Config/Config'
import { Button, Modal } from "antd";
import WindowTitleBar from "../../components/windowTitleBar.tsx";
import logoIcon from '../../assets/images/icon.png'
import { useTheme } from "../../components/ThemeProvider.tsx";
import {If, Else, Then} from 'react-if';
import Parse from "../Parse/Parse.tsx";
import Browser from "../Browser/Browser.tsx";


const stepList = [
    {
        label: '下载',
        key: 'download',
        icon: <Icon component={ DownloadIcon } />,
        activeIcon: <Icon component={ DownloadFillIcon } />
    },
    {
        label: '嗅探',
        key: 'finish',
        icon: <Icon component={ BrowserIcon } />,
        activeIcon: <Icon component={ BrowserFillIcon } />
    },
]


function Index(){
    const [activeStep, setActiveStep] = useState<string>('download')
    const [sysConfigVisible, setSysConfigVisible] = useState(false);
    let { theme } = useTheme();

    const changeItem = (key: string) => {
        setActiveStep(key)
    }

    const openSysConfig = () => {
        setSysConfigVisible(true)
    }


    return (
        <div className={styles.indexContainer} >
            <WindowTitleBar />
            <div className={styles.contentContainer}>
                <div className={styles.stepBar}>
                    <div className={styles.logoContainer}>
                        <img src={ logoIcon } alt="logo"/>
                    </div>
                    {
                        stepList.map(item =>
                            <div className={classnames(styles.stepBarItem, activeStep == item.key && styles.active)}
                                 key={item.key}
                                 onClick={() => changeItem(item.key)}
                            >
                                {activeStep == item.key ? item.activeIcon : item.icon}
                                <span className={styles.itemLabel}>{item.label}</span>
                            </div>
                        )
                    }
                    <div className={styles.bottomButton}>
                        <Button color="default" variant="link" size='large' icon={<Icon component={ SettingIcon } />} onClick={openSysConfig}>
                            {/*软件设置*/}
                        </Button>
                    </div>
                </div>
                <div className={styles.projectContainer}>
                    <If condition={activeStep === 'download'}>
                        <Then>
                                <DownloadNew />
                            {/*<DownLoad style={{ display: activeStep === 'download' ? 'block' : 'none' }} key="1" status={0} navigateFinishTask={(val ) => {setActiveStep('finish')}}/>*/}
                        </Then>
                    </If>
                    <If condition={activeStep === 'finish'}>
                        <Then>
                          <Browser />
                        </Then>
                    </If>
                </div>
            </div>
            <Modal
                open={sysConfigVisible}
                onCancel={() => setSysConfigVisible(false)}
                destroyOnClose
                maskClosable={false}
                className={styles.sysConfigDrawer}
                closable={false}
                footer={null}
                title={null}
            >
                <Config onClose={() => setSysConfigVisible(false)} />
            </Modal>
        </div>
    )
}

export default Index
