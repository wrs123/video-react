import styles from './Index.module.scss'
import { useState } from 'react'
import { CheckCircleFilled, ThunderboltFilled, SettingFilled  } from '@ant-design/icons';
import classnames from 'classnames';
import DownLoad from '../Download/Download'
import Config from '../Config/Config'
import { Button } from "antd";
import WindowTitleBar from "../../components/windowTitleBar.tsx";
import logoIcon from '../../assets/images/logo.png'

const stepList = [
    {
        label: '下载中',
        key: 'download',
        icon: <ThunderboltFilled style={{fontSize: '16px'}} />,
        activeIcon: <ThunderboltFilled style={ {color: 'var(--color-primary);', fontSize: '16px'}}/>
    },
    {
        label: '已完成',
        key: 'config',
        icon: <CheckCircleFilled style={{fontSize: '16px'}} />,
        activeIcon: <CheckCircleFilled style={ {color: 'var(--color-primary)', fontSize: '16px'}}/>
    },
]


function Index(){
    const [activeStep, setActiveStep] = useState<string>('download')

    const changeItem = (key: string) => {
        setActiveStep(key)
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
                        <Button color="primary" variant="outlined" block icon={<SettingFilled />}>
                            软件设置
                        </Button>
                    </div>
                </div>
                <div className={styles.projectContainer}>
                    <DownLoad style={{ display: activeStep == 'download' ? 'block' : 'none' }} key="1" />
                    <Config style={{ display: activeStep == 'config' ? 'block' : 'none' }} key="2" />
                </div>
            </div>

        </div>
    )
}

export default Index
