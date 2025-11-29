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
    const [pageType, setPageType] = useState<string>('tab')
    const [activeKey, setActiveKey] = useState<string>('')
    const [searchDialogVisible, setSearchDialogVisible] = useState<boolean>(false);
    const openSysConfig = () => {
        setSysConfigVisible(true)
    }

    const tabChange = (type: string, key: string) => {
        console.warn(key, type)
        setPageType(type)
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
                    <If condition={pageType === 'action' && activeKey === 'download'}>
                        <Then>
                                <DownloadHome />
                        </Then>
                    </If>
                    <If condition={pageType === 'tab'}>
                        <Then>
                          <Parse />
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
                    backdropFilter: 'blur(20px)',
                },
            }}
        >
            <SearchDialog close={ () => setSearchDialogVisible(false) } />
        </Modal>
        </div>
    )
}

export default Index
