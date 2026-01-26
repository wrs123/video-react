import styles from './Index.module.scss'
import { useState } from 'react'
import Icon, { GlobalOutlined, ControlOutlined, DownloadOutlined  } from '@ant-design/icons';
import DownloadHome from '../Download/DownloadHome.tsx'
import Config from '../Config/Config'
import { Button, Modal } from "antd";
import WindowTitleBar from "../../components/windowTitleBar.tsx";
import logoIcon from '../../assets/images/icon.png'
import { useTheme } from "../../components/ThemeProvider.tsx";
import {If, Else, Then} from 'react-if';
import Parse from "../Parse/Parse.tsx";
import Browser from "../Browser/Browser.tsx";
import SearchDialog from "../Download/components/searchDialog.tsx";



function Index(){
    const [sysConfigVisible, setSysConfigVisible] = useState(false);
    let { theme } = useTheme();
    const [activeKey, setActiveKey] = useState<string>('')
    const [searchDialogVisible, setSearchDialogVisible] = useState<boolean>(false);
    const openSysConfig = () => {
        setSysConfigVisible(true)
    }

    const tabChange = ( key: string) => {
        setActiveKey(key)
    }

    const openSearch = () => {
        setSearchDialogVisible(true)
    }




    return (
        <div className={styles.indexContainer} >
            <WindowTitleBar openSysConfig={openSysConfig} openSearch={openSearch} tabChange={tabChange} />
            <div className={styles.contentContainer}>

                <div className={styles.projectContainer}>
                    <If condition={ activeKey === 'home'}>
                        <Then>
                                <DownloadHome />
                        </Then>
                        <Else>
                            <Parse />
                        </Else>
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
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(0,0,0,.08)',
                },
            }}
        >
            <SearchDialog close={ () => setSearchDialogVisible(false) } />
        </Modal>
        </div>
    )
}

export default Index
