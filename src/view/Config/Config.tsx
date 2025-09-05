import styles from './Config.module.scss'
import { CloseOutlined, RocketOutlined, RocketFilled, CloudServerOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input, Switch, Select, Flex } from "antd";
import { useState } from 'react'
import {If, Then} from 'react-if'
import QueueAnim from 'rc-queue-anim';


interface ConfigProps {
    style?: { display: string }
    onClose?: () => void
}

function Config({onClose}: ConfigProps) {

    type FieldType = {
        maxDownloadCount: number,
        downloadUrl?: string;
        isLimitSpeed?: boolean;
        limitSpeed?: number;
        useProxy?: string;
        proxyPortal?: string;
        proxyHost?: string;
        proxyPort?: number;
    };

    const [formData] = Form.useForm<FieldType>()
    const defaultValue = window['sysConfig']
    const isLimitSpeed = Form.useWatch('isLimitSpeed', formData);
    const useProxy = Form.useWatch('useProxy', formData);
    const [activeGroup, setActiveGroup] = useState('download');
    const configGroup : any[] = [
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

    return (
        <div className={styles.configContainer}>

            <div className={styles.configContent}>
                <div className={styles.leftContent}>
                    <div className={styles.title}>设置</div>
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
                        <div className={styles.title} >下载</div>
                        <div className={styles.bottomContent}>
                            <If condition={activeGroup === 'download'}>
                                <Then>
                                    <Form
                                        name="basic"
                                        form={formData}
                                        layout={'vertical'}
                                        initialValues={ defaultValue }
                                        autoComplete="off"
                                    >
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
                                                            <Form.Item<FieldType>
                                                                name="limitSpeed"
                                                            >
                                                                <Flex gap="middle" align={'center'}>
                                                                    限速为<Input style={{width: "100px"}} />KB/s
                                                                </Flex>
                                                            </Form.Item>
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
                                                            name="downloadUrl"
                                                        >
                                                            <Input disabled />
                                                        </Form.Item>
                                                        <Button icon={<FolderOpenOutlined />}></Button>
                                                    </Space.Compact>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </Then>
                            </If>
                            <If condition={activeGroup === 'proxy'}>
                                <Then>
                                    <Form
                                        name="basic"
                                        layout={'vertical'}
                                        // variant={'filled'}
                                        initialValues={{ remember: true, layout: 'vertical', variant: 'filled' }}
                                        autoComplete="off"
                                        form={formData}
                                    >
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
                                                                <Input placeholder="代理域名" disabled={!useProxy} style={{ width: '200px' }} />
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
                                    </Form>
                                </Then>
                            </If>
                        </div>
                    </div>
                    <Button color="danger" variant="filled" icon={<CloseOutlined />} style={{marginTop: '35px', marginRight: '18px'}} onClick={() => onClose()}>
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default Config
