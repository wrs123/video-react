import Parse from "../Parse/Parse.tsx";
import styles from "./Browser.module.scss";
import { useState } from "react";
import { CloseOutlined } from '@ant-design/icons';
import QueueAnim from "rc-queue-anim";


function Browser(){
    const [ tabList, setTabList] = useState<any[]>([
        {
            name: '新标签',
            key: 'newTab'
        }
    ])

    const [ activeTab, setActiveTab] = useState<string>('newTab')


    return (
        <div className={ styles.browserContainer}>
            <QueueAnim delay={0} type={ 'scaleBig' } >
                <div key={1}  className={styles.tabList}>
                    {
                        tabList.map(item => (
                            <div className={`${styles.tabItem} ${activeTab === item.key ? styles.active : ''}`}>
                                {item.name}
                                <div className={styles.closeButton}>
                                    <CloseOutlined />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </QueueAnim>
            <QueueAnim delay={0} type={ 'bottom' } >
                <div key={1}><Parse   /></div>
            </QueueAnim>
        </div>
    )
}

export default Browser;
