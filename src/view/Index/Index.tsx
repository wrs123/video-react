import styles from './Index.module.scss'
import { useState } from 'react'
import { CheckCircleOutlined, SettingFilled, DownloadOutlined  } from '@ant-design/icons';
import classnames from 'classnames';
import DownLoad from '../Download/Download'
import Config from '../Config/Config'
import { Button, Modal } from "antd";
import WindowTitleBar from "../../components/windowTitleBar.tsx";
import logoIconLight from '../../assets/images/logo-light.png'
import logoIconDark from '../../assets/images/logo-dark.png'
import { useTheme } from "../../components/ThemeProvider.tsx";
import {If, Else, Then} from 'react-if';

const stepList = [
    {
        label: '下载中',
        key: 'download',
        icon: <DownloadOutlined style={{fontSize: '18px'}} />,
        activeIcon: <DownloadOutlined style={ {color: 'var(--color-primary);', fontSize: '18px'}}/>
    },
    {
        label: '已完成',
        key: 'finish',
        icon: <CheckCircleOutlined style={{fontSize: '18px'}} />,
        activeIcon: <CheckCircleOutlined style={ {color: 'var(--color-primary)', fontSize: '18px'}}/>
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
                        <img src={ theme === "light" ? logoIconLight : logoIconDark } alt="logo"/>
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
                        <Button color="primary" variant="outlined" block icon={<SettingFilled />} onClick={openSysConfig}>
                            软件设置
                        </Button>
                    </div>
                </div>
                <div className={styles.projectContainer}>

                    <If condition={activeStep === 'download'}>
                        <Then>
                            <DownLoad style={{ display: activeStep === 'download' ? 'block' : 'none' }} key="1" status={0} navigateFinishTask={(val ) => {setActiveStep('finish')}}/>
                        </Then>
                    </If>
                    <If condition={activeStep === 'finish'}>
                        <Then>
                            <DownLoad style={{ display: activeStep === 'download' ? 'block' : 'none' }} key="1" status={1} />
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
