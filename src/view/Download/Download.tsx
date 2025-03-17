import styles from './Download.module.scss'
import { Radio, Button, Modal, Input, Space } from "antd";
import { FileAddOutlined, FolderOpenOutlined, RocketFilled, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {useState, forwardRef } from 'react'
const { TextArea } = Input;


function Download(){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">
                            <Space>
                                <ClockCircleOutlined />
                                下载中
                            </Space>
                        </Radio.Button>
                        <Radio.Button value="b">

                            <Space>
                                <CheckCircleOutlined />
                                已完成
                            </Space>
                        </Radio.Button>
                    </Radio.Group>
                    <div>
                        <Button type="primary" icon={<FileAddOutlined />} onClick={ showModal }>
                            新建下载
                        </Button>
                    </div>
                </div>
            </div>
            <Modal title="新建下载" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                   footer={null}
            >
                <Space direction="vertical"  style={{ display: 'flex' }}>
                    <TextArea placeholder="多连接下载请换行" autoSize={{ minRows: 5, maxRows: 5 }}></TextArea>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input />
                        <Button type="primary" icon={<FolderOpenOutlined />} >
                            选择位置
                        </Button>
                    </Space.Compact>
                    <Button type="primary" block htmlType="submit" size="large" icon={<RocketFilled/>}>
                        创建下载
                    </Button>
                </Space>
            </Modal>
        </>

    )
}

export default  Download
