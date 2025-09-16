import styles from "./Parse.module.scss";
import { useEffect, useRef, useState } from "react";
import API from "../../request/api.ts";
import {Button, Input, Space, Flex} from "antd";
import { ReloadOutlined, LeftOutlined, RightOutlined, SettingOutlined, MenuUnfoldOutlined, CloudOutlined, CloseOutlined } from '@ant-design/icons';
function Parse (){
    const webviewRef = useRef<Electron.WebviewTag>(null);

    const [ cookies, setCookies] = useState('')
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConsoleBar, setShowConsoleBar] = useState(false);

    const closeParseWindow = async () => {
        await API.closeParseWindow('')
    }

    const reloadWebview = () => {
        const webview = webviewRef.current;
        setLoading(true)
        webview.reload();
    }

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        webview.addEventListener("did-navigate", (event) => {
            console.log("Navigated to:", event.url);
            setUrl(event.url)
        });

        // 页面加载完成
        webview.addEventListener("did-finish-load", () => {
            console.log("Current URL:", webview.getURL());
            setLoading(false)
        });
    }, [])


    return (
        <div className={ styles.parseContainer }>
            <div className={styles.actionBar}>
                <Flex gap="middle" align="center" justify="space-between" style={{width:'100%'}}>
                    <Flex style={{flex: 1}} gap="10px">
                        <Button type="text" size={'small'} icon={<LeftOutlined />}></Button>
                        <Button type="text" size={'small'} icon={<RightOutlined />}></Button>
                        <Button size={'small'} type="text"  icon={loading ? <CloseOutlined /> : <ReloadOutlined />} onClick={ reloadWebview }></Button>
                        <Input size={'small'} value={url} prefix={<CloudOutlined style={{margin: '0 10px 0 4px'}} />} style={{flex: 1, marginLeft: '10px', marginRight: '10px'}} />
                        <Button size={'small'} type="text" icon={<SettingOutlined />}></Button>
                        <Button size={'small'} type="text" icon={<MenuUnfoldOutlined />} onClick={() => setShowConsoleBar(!showConsoleBar)}></Button>
                    </Flex>
                    <Space>
                        <Button size={'small'} color="default" onClick={closeParseWindow}>退出</Button>
                        <Button type="primary" size={'small'} >确认</Button>
                    </Space>
                </Flex>
            </div>
            <div className={styles.viewContainer}>
                <webview
                    ref={webviewRef}
                    src='https://youtube.com'
                    className={styles.parseWindow}
                ></webview>
                <div className={ `${styles.consoleContainer} ${ showConsoleBar ? '' : styles.hide}` }></div>
            </div>
        </div>
    )
}


export default Parse
