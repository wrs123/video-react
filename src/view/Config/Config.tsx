import styles from './Config.module.scss'
import { CloseOutlined, RocketOutlined, RocketFilled, CloudServerOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input, Switch } from "antd";
import { useState } from 'react'
import {If, Then} from 'react-if';


interface ConfigProps {
    style?: { display: string }
    onClose?: () => void
}

function Config({onClose}: ConfigProps) {

    type FieldType = {
        downloadUrl?: string;
        useProxy?: string;
        remember?: string;
    };

    const [formData] = Form.useForm<FieldType>()
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
                                    <div>系统代理</div>
                                    <Form
                                        name="basic"
                                        form={formData}
                                        layout={'vertical'}
                                        variant={'filled'}
                                        initialValues={{ remember: true, layout: 'vertical', variant: 'filled' }}
                                        autoComplete="off"
                                    >
                                        <Form.Item<FieldType>
                                            name="downloadUrl"
                                        >
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Input disabled />
                                                <Button type="primary">选择地址</Button>
                                            </Space.Compact>
                                        </Form.Item>
                                    </Form>
                                </Then>
                            </If>
                            <If condition={activeGroup === 'proxy'}>
                                <Then>
                                    <div>系统代理</div>
                                    <Form
                                        name="basic"
                                        layout={'vertical'}
                                        // variant={'filled'}
                                        initialValues={{ remember: true, layout: 'vertical', variant: 'filled' }}
                                        autoComplete="off"
                                        form={formData}
                                    >
                                        <Form.Item<FieldType>
                                            label="系统代理"
                                            name="useProxy"
                                            layout={'horizontal'}
                                        >
                                            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                                        </Form.Item>
                                        <Form.Item<FieldType>
                                            name="useProxy"
                                            label=""
                                            layout={'horizontal'}
                                            style={{ marginLeft: '68px' }}
                                        >
                                            <Space.Compact >
                                                <Input placeholder="代理域名" style={{ width: '65%' }} />
                                                <Input placeholder="代理端口" style={{ width: '35%' }} />
                                            </Space.Compact>
                                        </Form.Item>
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
