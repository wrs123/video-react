import styles from "./Parse.module.scss";
import { useEffect, useRef, useState } from "react";
import API from "../../request/api.ts";
import {Button, Input, Space, Flex} from "antd";
import { ReloadOutlined, LeftOutlined, RightOutlined, SettingOutlined, MenuUnfoldOutlined, GlobalOutlined, CloseOutlined } from '@ant-design/icons';
function Parse (){
    const webviewRef = useRef<Electron.WebviewTag>(null);

    const [ cookies, setCookies] = useState('')
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [ canGoBack, setCanGoBack] = useState(false);
    const [ canGoForward, setCanGoForward] = useState(false);
    const [showConsoleBar, setShowConsoleBar] = useState(true);

    const closeParseWindow = async () => {
        await API.closeParseWindow('')
    }

    const reloadWebview = () => {
        const webview = webviewRef.current;
        setLoading(true)
        webview.reload();
    }

    const goBackWebview = () => {
        const webview = webviewRef.current;
        webview.goBack();
        initNav()
    }

    const goForwardWebview = () => {
        const webview = webviewRef.current;
        webview.goForward();
        initNav()
    }


    const initNav = () => {
        const webview = webviewRef.current;
        console.warn(webview.canGoBack(), webview.canGoForward())
        setCanGoBack(webview.canGoBack())
        setCanGoForward(webview.canGoForward())
    }


    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;


        webview.addEventListener("dom-ready", () => {
            console.log("webview is ready!");
            initNav()
        });

        webview.addEventListener("did-navigate", (event) => {
            console.log("Navigated to:", event.url);
            setLoading(true)
            setUrl(event.url)
            initNav()
        });

        webview.addEventListener("did-navigate-in-page", (event) => {
            console.log("In-page navigation:", event.url);
            setUrl(event.url)
            initNav()
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
                        <Button type="text" size={'small'} disabled={ !canGoBack } icon={<LeftOutlined />} onClick={ goBackWebview }></Button>
                        <Button type="text" size={'small'} disabled={ !canGoForward } icon={<RightOutlined />} onClick={ goForwardWebview }></Button>
                        <Button size={'small'} type="text"  icon={loading ? <CloseOutlined /> : <ReloadOutlined />} onClick={ reloadWebview }></Button>
                        <Input size={'small'} value={url} onChange={(e) => {setUrl(e.target.value)}} prefix={<GlobalOutlined style={{margin: '0 10px 0 4px'}} />} style={{flex: 1, marginLeft: '10px', marginRight: '10px'}} />
                        <Button size={'small'} type="text" icon={<SettingOutlined />}></Button>
                        <Button size={'small'} type="text" icon={<MenuUnfoldOutlined />} onClick={() => setShowConsoleBar(!showConsoleBar)}></Button>
                    </Flex>
                    <Space>
                        <Button size={'small'} color="danger" onClick={closeParseWindow} variant="text">退出</Button>
                        <Button type="text" size={'small'} >确认</Button>
                    </Space>
                </Flex>
            </div>
            <div className={styles.viewContainer}>
                <webview
                    ref={webviewRef}
                    src='https://youtube.com'
                    className={styles.parseWindow}
                ></webview>
                <div className={ `${styles.consoleContainer} ${ showConsoleBar ? '' : styles.hide}` }>
                    <div className={styles.cookiesContent}>
                        {cookies}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Parse
