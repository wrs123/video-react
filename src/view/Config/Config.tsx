import styles from './Config.module.scss'
import { CloseOutlined, RocketOutlined, RocketFilled, AppstoreOutlined, CloudDownloadOutlined,
    FolderOutlined, AppstoreFilled, CloudServerOutlined, FolderOpenOutlined,
    SettingFilled} from '@ant-design/icons';
import { Button, Space, Form, Input, Switch, Select, Flex, Modal } from "antd";
import { useState } from 'react'
import {If, Then} from 'react-if'
import API from "../../request/api.ts";
import {ResultStatus} from "../../../enums.ts";
import CookieList from "./components/CookieList.tsx";


interface ConfigProps {
    style?: { display: string }
    onClose?: () => void
}

function Config({onClose}: ConfigProps) {

    type FieldType = {
        maxDownloadCount: number,
        savePath?: string;
        isLimitSpeed?: boolean;
        limitSpeed?: number;
        useProxy?: string;
        proxyPortal?: string;
        proxyHost?: string;
        proxyPort?: number;
        themeMode?: string;
        language?: string;
    };

    const [formData] = Form.useForm<FieldType>()
    const defaultValue = window['sysConfig']
    const isLimitSpeed = Form.useWatch('isLimitSpeed', formData);
    const [cookieDialogVisible, setCookieDialogVisible] = useState<boolean>(false);
    const useProxy = Form.useWatch('useProxy', formData);
    const [activeGroup, setActiveGroup] = useState('common');
    const configGroup : any[] = [
        {
            label: '通用',
            key: 'common',
            icon: <AppstoreOutlined />,
            activeIcon: <AppstoreFilled />
        },
        {
            label: '下载',
            key: 'download',
            icon: <RocketOutlined />,
            activeIcon: <RocketFilled />
        },
        {
            label: '代理',
            key: 'proxy',
            icon: <CloudServerOutlined />
        }
    ]

    const setSysConfig = async () => {
        console.warn(formData.getFieldsValue(true))
        const param = formData.getFieldsValue(true)
        const res = await API.setSysConfig(param)
        if(res.status === ResultStatus.OK){
            window['sysConfig'] = param
        }
    }


    return (
        <div className={styles.configContainer}>

            <div className={styles.configContent}>
                <div className={styles.leftContent}>
                    <div className={styles.configGroupList}>
                        {
                            configGroup.map((item: any, index: number) => {
                                return <div key={index} onClick={() => setActiveGroup(item.key)} className={`${styles.groupItem} ${activeGroup === item.key ? styles.active : ""}`} >
                                    {item.icon}
                                    <span className={styles.label}>{item.label}</span>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.rightMainContent}>
                        <div className={styles.title} >{configGroup.find(findItem => findItem.key === activeGroup).label}</div>
                        <div className={styles.bottomContent}>
                            <Form
                                name="basic"
                                form={formData}
                                layout={'vertical'}
                                initialValues={ defaultValue }
                                autoComplete="off"
                                onValuesChange={setSysConfig}
                                size="middle"
                            >
                                <If condition={activeGroup === 'common'}>
                                    <Then>
                                        <div className={styles.configBlock}>
                                            <div className={styles.configItem}>
                                                <div className={styles.labelPart}>
                                                    开机自动启动
                                                </div>
                                                <div className={styles.contentPart}>
                                                    <Form.Item<FieldType>
                                                        name="theme"
                                                    >
                                                        <Switch checkedChildren="是" unCheckedChildren="否" />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.configTitle}>个性化</div>
                                        <div className={styles.configBlock}>
                                            <div className={styles.configItem}>
                                                <div className={styles.labelPart}>
                                                    语言
                                                </div>
                                                <div className={styles.contentPart}>
                                                    <Form.Item<FieldType>
                                                        name="language"
                                                    >
                                                        <Select
                                                            style={{ width: '100px' }}
                                                            options={
                                                                [
                                                                    { value: 'simpleChinese', label: '简体中文' },
                                                                    { value: 'english', label: 'english' },
                                                                ]
                                                            }
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className={styles.configItem}>
                                                <div className={styles.labelPart}>
                                                    外观
                                                </div>
                                                <div className={styles.contentPart}>
                                                    <Form.Item<FieldType>
                                                        name="themeMode"
                                                    >
                                                        <Select
                                                            style={{ width: '100px' }}
                                                            options={
                                                                [
                                                                    { value: 'auto', label: '跟随系统' },
                                                                    { value: 'light', label: '浅色模式' },
                                                                    { value: 'dark', label: '深色模式' }
                                                                ]
                                                            }
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </Then>
                                </If>
                                <If condition={activeGroup === 'download'}>
                                    <Then>
                                        <div className={styles.configTitle}>解析</div>
                                        <div className={styles.configBlock}>
                                            <div className={styles.configItem}>
                                                <div className={styles.labelPart}>
                                                    yt-dlp
                                                </div>
                                                <div className={styles.contentPart}>
                                                    <Space.Compact>
                                                        <Form.Item<FieldType>
                                                            name="maxDownloadCount"

                                                        >
                                                            <Button type="link" block icon={<CloudDownloadOutlined />} />
                                                        </Form.Item>
                                                        <Form.Item<FieldType>
                                                            name="maxDownloadCount"
                                                            noStyle
                                                        >
                                                            <Button type="link" block icon={<FolderOutlined />} />
                                                        </Form.Item>
                                                    </Space.Compact>

                                                </div>
                                            </div>
                                            <div className={styles.configItem}>
                                                <div className={styles.labelPart}>
                                                    cookie管理
                                                </div>
                                                <div className={styles.contentPart}>
                                                    <Form.Item<FieldType>
                                                        name="maxDownloadCount"

                                                    >
                                                        <Button type="primary" size={'small'} icon={<SettingFilled />} onClick={() => {
                                                            setCookieDialogVisible(true)
                                                        }}>管理</Button>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.configTitle}>下载</div>
                                        <div className={styles.configBlock}>
                                                <div className={styles.configItem}>
                                                    <div className={styles.labelPart}>
                                                        同时下载数
                                                    </div>
                                                    <div className={styles.contentPart}>
                                                        <Form.Item<FieldType>
                                                            name="maxDownloadCount"
                                                        >
                                                            <Select
                                                                style={{ width: '70px' }}
                                                                options={
                                                                    Array(10).fill(0).map((_, index: number) => {
                                                                        return { value: index+1, label: index+1 }
                                                                    })
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className={styles.configItem}>
                                                    <div className={styles.labelPart}>
                                                        下载速度
                                                    </div>
                                                    <div className={styles.contentPart}>
                                                        <Form.Item<FieldType>
                                                            name="isLimitSpeed"
                                                        >
                                                            <Switch checkedChildren="限速" unCheckedChildren="不限速" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <If condition={isLimitSpeed}>
                                                    <Then>
                                                        <div className={`${styles.configItem} ${styles.subConfigItem} `} key={1}>
                                                            <div className={styles.labelPart}>

                                                            </div>
                                                            <div className={styles.contentPart}>
                                                                <Flex gap="middle" align={'center'}>
                                                                    限速为
                                                                    <Form.Item<FieldType>
                                                                        name="limitSpeed"
                                                                    >

                                                                            <Input style={{width: "100px"}} />

                                                                    </Form.Item>
                                                                    KB/s
                                                                </Flex>
                                                            </div>
                                                        </div>
                                                    </Then>
                                                </If>
                                                <div className={styles.configItem}>
                                                    <div className={styles.labelPart}>
                                                        下载地址
                                                    </div>
                                                    <div className={styles.contentPart}>
                                                        <Space.Compact >
                                                            <Form.Item<FieldType>
                                                                name="savePath"
                                                                noStyle
                                                            >
                                                                <Input disabled />
                                                            </Form.Item>
                                                            <Form.Item<FieldType>
                                                                name="savePath"
                                                                noStyle
                                                            >
                                                                <Button icon={<FolderOpenOutlined />}></Button>
                                                            </Form.Item>

                                                        </Space.Compact>
                                                    </div>
                                                </div>
                                            </div>

                                    </Then>
                                </If>
                                <If condition={activeGroup === 'proxy'}>
                                    <Then>
                                        <div className={styles.configBlock}>
                                                <div className={styles.configItem}>
                                                    <div className={styles.labelPart}>
                                                        系统代理
                                                    </div>
                                                    <div className={styles.contentPart}>
                                                        <Form.Item<FieldType>
                                                            name="useProxy"
                                                            layout={'horizontal'}
                                                        >
                                                            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <If condition={useProxy}>
                                                    <Then>
                                                        <div className={`${styles.configItem} ${styles.subConfigItem} `}>
                                                            <div className={styles.labelPart}>
                                                                协议
                                                            </div>
                                                            <div className={styles.contentPart}>
                                                                <Form.Item<FieldType>
                                                                    name="proxyPortal"
                                                                >
                                                                    <Select
                                                                        style={{ width: '100px' }}
                                                                        options={[
                                                                            { value: 'http', label: 'HTTP' },
                                                                            { value: 'https', label: 'HTTPS' },
                                                                            { value: 'socket', label: 'SOCKET' }
                                                                        ]
                                                                        }
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                        <div className={`${styles.configItem} ${styles.subConfigItem} `}>
                                                            <div className={styles.labelPart}>
                                                                域名
                                                            </div>
                                                            <div className={styles.contentPart}>
                                                                <Form.Item<FieldType>
                                                                    name="proxyHost"
                                                                >
                                                                    <Input placeholder="代理域名" disabled={!useProxy} style={{ width: '100px' }} />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                        <div className={`${styles.configItem} ${styles.subConfigItem} `}>
                                                            <div className={styles.labelPart}>
                                                                端口
                                                            </div>
                                                            <div className={styles.contentPart}>
                                                                <Form.Item<FieldType>
                                                                    name="proxyPort"

                                                                >
                                                                    <Input placeholder="代理端口" disabled={!useProxy} style={{ width: '100px' }} />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                    </Then>
                                                </If>
                                            </div>
                                    </Then>
                                </If>
                            </Form>
                        </div>
                    </div>
                    <Button color="danger" variant="filled" icon={<CloseOutlined />} className={styles.closeButton} onClick={() => onClose()}>
                    </Button>
                </div>
            </div>
            <Modal
                title="Cookie 管理"
                footer={ null }
                open={cookieDialogVisible}
                classNames={{
                    content: styles.cookieDialog
                }}
                onCancel={ () => setCookieDialogVisible(false) }
            >
                <CookieList onChange={setSysConfig} />
            </Modal>
        </div>
    )
}


export default Config
