import styles from './Index.module.scss'
import { useState } from 'react'
import { CheckCircleOutlined, SettingFilled, DownloadOutlined  } from '@ant-design/icons';
import classnames from 'classnames';
import DownLoad from '../Download/Download'
import Config from '../Config/Config'
import { Button, Modal } from "antd";
import WindowTitleBar from "../../components/windowTitleBar.tsx";
import logoIcon from '../../assets/images/logo.png'
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
                        <img src={logoIcon} alt="logo"/>
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
                            <DownLoad style={{ display: activeStep === 'download' ? 'block' : 'none' }} key="1" status={0} />
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
                height="100%"
                open={sysConfigVisible}
                onCancel={() => setSysConfigVisible(false)}
                destroyOnClose
                styles={{
                    mask: {
                        backdropFilter: 'blur(20px) brightness(1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    },
                }}
                style={{ top: 0, margin: 0, maxWidth: 'unset', padding: 0 }}
                maskClosable={false}
                className={styles.sysConfigDrawer}
                width='100vw'
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
