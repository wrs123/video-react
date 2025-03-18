import styles from './Download.module.scss'
import {Button, Modal, Radio, Space, Table, Progress, ConfigProvider } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined
} from '@ant-design/icons';
import {useState} from 'react'
import type { DownloadType } from "../../../types.ts";
import { DownloadStatus } from "../../../enums.ts";
import { If } from 'react-if';
import CreateDialog from "./components/createDialog"
import { createStyles } from 'antd-style';

const { Column } = Table;

function Download(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadList, setDownloadList] = useState<DownloadType[]>([
        {
            name: "下载名称",
            percent: 30,
            status: DownloadStatus.PENDING,
            path: '',
            size: 2048,
            finishSize: 1024
        }
    ]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const percentParse = (finishSize: number, size: number) => {
        return (finishSize / size * 100).toFixed(2).replace(/\.?0+$/, '');
    }

    const statusParse = (status : DownloadStatus ) => {
        let res: string = ""

        switch(status){
            case DownloadStatus.PENDING:
                res = "下载中"
                break;
            case DownloadStatus.PAUSE:
                res = "已暂停"
                break;
            case DownloadStatus.FINISH:
                res = "下载完成"
                break;
        }
        return res
    }

    const commandCommon = (type: string, item: DownloadType) => {
        switch (type) {
            case "PAUSE":
                item.status = DownloadStatus.PAUSE;
                setDownloadList(prevList => prevList.map(preItem =>
                    item.name == item.name ? {...preItem, ...item} : preItem
                ));
                break;
            case "PUSH":
                item.status = DownloadStatus.PENDING;
                setDownloadList(prevList => prevList.map(preItem =>
                    item.name == item.name ? {...preItem, ...item} : preItem
                ));
                break;
        }
    }

    const progressColor = (status: DownloadStatus) => {
        let res: string = ""

        switch (status) {
            case DownloadStatus.PAUSE:
                res = "#d7d7d7"
                break;
            case DownloadStatus.PENDING:
                res = "var(--color-primary)"
                break;
            case DownloadStatus.ERROR:
                res = "#f2f2f2"
                break;
            case DownloadStatus.FINISH:
                res = "#f2f2f2"
                break;
        }
        return res
    }

    const useStyle = createStyles(({ prefixCls, css }) => ({
        linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
    }));

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
                        <ConfigProvider
                            button={{
                                className: useStyle().styles.linearGradientButton,
                            }}
                        >
                            <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" onClick={ showModal }>
                            </Button>
                        </ConfigProvider>
                    </div>
                </div>
                <div className={styles.downloadList}>
                    <Table<DownloadType> dataSource={downloadList} size="small" pagination={false}>
                        <Column title="名称" dataIndex="name" key="name" />
                        <Column title="大小" dataIndex="size" key="size" width="140px"
                                render={(_:any, record: DownloadType) => (
                                    <span>{record.finishSize}/{record.size}({percentParse(record.finishSize, record.size)}%)</span>
                                )}
                        />
                        <Column title="状态" dataIndex="progress" key="progress" width="200px"
                                render={(_:any, record: DownloadType) => (
                                    <div style={{display: "flex", flexDirection: "column", paddingRight:"8px"}} >
                                        <Progress
                                                  percent={record.finishSize / record.size * 100}
                                                  showInfo={false}
                                                  size="small"
                                                  strokeColor={progressColor(record.status)}
                                        />
                                        <span style={{fontSize: "12px", color: "var(--color-text-second)"}}>{statusParse(record.status)}</span>
                                    </div>
                                )}
                        />
                        <Column title="操作" dataIndex="progress" key="progress" width="120px"
                                render={(_:any, record: DownloadType) => (
                                    <>
                                        <If condition={record.status == DownloadStatus.PENDING}>
                                            <Button type="text" onClick={() => commandCommon('PAUSE', record)} icon={<PauseCircleOutlined />} />
                                        </If>
                                        <If condition={record.status == DownloadStatus.PAUSE}>
                                            <Button type="text" onClick={() => commandCommon('PUSH', record)} icon={<PlayCircleOutlined />} />
                                        </If>
                                        <Button type="text" icon={<SearchOutlined />} />
                                        <Button color="danger" variant="text" icon={<DeleteOutlined />} />
                                    </>
                                )}
                        />
                    </Table>
                </div>
            </div>
            <Modal title="新建下载"
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   width="450px"
                   footer={null}
                   destroyOnClose
            >
                <CreateDialog />
            </Modal>
        </>
    )
}

export default  Download
