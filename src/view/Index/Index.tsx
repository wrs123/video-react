import styles from './Index.module.scss'
import { useState } from 'react'
import { ControlFilled, RocketFilled  } from '@ant-design/icons';
import classnames from 'classnames';
import DownLoad from '../Download/Download'
import Config from '../Config/Config'

import { If } from 'react-if';


const stepList = [
    {
        label: '下载',
        key: 'download',
        icon: <RocketFilled style={{fontSize: '16px'}} />,
        activeIcon: <RocketFilled style={ {color: 'var(--color-primary);', fontSize: '16px'}}/>
    },
    {
        label: '设置',
        key: 'config',
        icon: <ControlFilled style={{fontSize: '16px'}} />,
        activeIcon: <ControlFilled style={ {color: 'var(--color-primary)', fontSize: '16px'}}/>
    },
]


function Index(){
    const [activeStep, setActiveStep] = useState('download')

    const changeItem = (key: string) => {
        setActiveStep(key)
    }

    return (
        <div className={styles.indexContainer} >
            <div className={styles.stepBar}>
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
            </div>
            <div className={styles.projectContainer}>
                <If condition={activeStep == 'download'}>
                    <DownLoad key="1" />
                </If>
                <If condition={activeStep == 'config'}>
                    <Config key="2" />
                </If>
            </div>
        </div>
    )
}

export default Index
