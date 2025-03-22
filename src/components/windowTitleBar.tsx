import styles from './windowTitleBar.module.scss'
import { LineOutlined, FullscreenExitOutlined, CloseOutlined, FullscreenOutlined } from '@ant-design/icons';
import {If, Else, Then} from 'react-if';
import {useState} from 'react'
import API from "../request/api.ts";

function WindowTitleBar() {

    const [isMaximized, setIsMaximized] = useState<boolean>(false)

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




    return (
        <div className={styles.windowTitleContainer}>
            <div></div>
            <div className={styles.windowBottonGroup}>
                <div className={styles.windowBotton} onClick={()=> onElectronOperationWindow('min')}>
                    <LineOutlined />
            </div>
                <If condition={!isMaximized}>
                   <Then>
                       <div className={styles.windowBotton} v-if="!isMaximized" onClick={ () => onElectronOperationWindow('max')}>
                           <FullscreenOutlined />
                       </div>
                   </Then>
                    <Else>
                        <div className={styles.windowBotton} v-if="isMaximized" onClick={() => onElectronOperationWindow('restore')}>
                            <FullscreenExitOutlined />
                        </div>
                    </Else>
                </If>
                <div className={`${styles.windowBotton} ${styles.closeButton}`} onClick={() => onElectronOperationWindow('close')}>
                        <CloseOutlined />
                </div>
            </div>
        </div>
    )
}

export default WindowTitleBar
