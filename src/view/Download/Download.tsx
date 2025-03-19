import styles from './Download.module.scss'
import {Button, Modal, Radio, Space, Table, Progress, ConfigProvider, Empty } from "antd";
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
import { DownloadTaskType} from "../../../types.ts";
import {DownloadStatus, ResultStatus} from "../../../enums.ts";
import { If, Else } from 'react-if';
import CreateDialog from "./components/createDialog"
import { createStyles } from 'antd-style';
import API from "../../request/api.ts";
const { Column } = Table;

function Download(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadList, setDownloadList] = useState<DownloadTaskType[]>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const createSuccess = (_param: DownloadTaskType) => {
        console.log(_param);
        setIsModalOpen(false);
        setDownloadList(prevList => [...prevList, _param]);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const percentParse = (finishSize: number, size: number) => {
        if(size == 0 || size < finishSize){
            return 0
        }

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

    const commandCommon = async (type: string, item: DownloadTaskType) => {

        // const res = await API.editTask({type})
        //
        // if(res.status == ResultStatus.OK){}

        switch (type) {
            case "PAUSE":

                item.status = DownloadStatus.PAUSE;
                setDownloadList(prevList => prevList.map(preItem =>
                    item.id == item.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "PUSH":
                item.status = DownloadStatus.PENDING;
                setDownloadList(prevList => prevList.map(preItem =>
                    item.id == item.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "UPDATE":
                setDownloadList(prevList => prevList.map(preItem =>
                    item.id == item.id ? {...preItem, ...item} : preItem
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

    onDownloadUpdate.get((event: unknown, str: any) => {
        console.warn(str)
        commandCommon('UPDATE', str)
    })

    const fileSizeFormat = (bytes: number) => {
        return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
    }

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
                            <Button type="primary"  shape="round" icon={<PlusOutlined />} size="large" onClick={ showModal }>

                            </Button>
                        </ConfigProvider>
                    </div>
                </div>
                <div className={styles.downloadList}>
                    <If condition={downloadList.length != 0}>
                        <Table<DownloadTaskType> dataSource={downloadList} size="small" pagination={false}>
                            <Column title="" dataIndex="name" key="name" width="50px"
                                    render={(_:any, record: DownloadTaskType) => (
                                        <If condition={record.status == DownloadStatus.PENDING}>
                                            <Button type="text" onClick={() => commandCommon('PAUSE', record)} icon={<PauseCircleOutlined />} />
                                        </If>
                                    )}
                            />
                            <Column title="名称" dataIndex="name" key="name" ellipsis={true}
                                    render={(_:any, record: DownloadTaskType) => (
                                        <span>{record.fileObj.fileName}</span>
                                    )}
                            />
                            <Column title="大小" dataIndex="size" key="size" width="170px"
                                    render={(_:any, record: DownloadTaskType) => (
                                        <span>
                                            <If condition={record.status == DownloadStatus.FINISH}>
                                                {fileSizeFormat(record.TotalBytes)}
                                            </If>
                                            <If condition={record.status == DownloadStatus.PENDING || record.status == DownloadStatus.PAUSE}>
                                                {fileSizeFormat(record.receivedBytes)}/{fileSizeFormat(record.TotalBytes)}
                                                ({percentParse(record.receivedBytes, record.TotalBytes)}%)
                                            </If>
                                        </span>
                                    )}
                            />
                            <Column title="状态" dataIndex="progress" key="progress" width="200px"
                                    render={(_:any, record: DownloadTaskType) => (
                                        <div style={{display: "flex", flexDirection: "column", paddingRight:"8px"}} >
                                            <If condition={record.status != DownloadStatus.FINISH && record.status != DownloadStatus.ERROR}>
                                                <Progress
                                                    percent={record.receivedBytes / record.TotalBytes * 100}
                                                    showInfo={false}
                                                    size="small"
                                                    strokeColor={progressColor(record.status)}
                                                />
                                            </If>
                                            <span style={{fontSize: "12px", color: "var(--color-text-second)"}}>{statusParse(record.status)}</span>
                                        </div>
                                    )}
                            />
                            <Column title="操作" dataIndex="progress" key="progress" width="120px"
                                    render={(_:any, record: DownloadTaskType) => (
                                        <>
                                            <If condition={record.status == DownloadStatus.PAUSE}>
                                                <Button type="text" onClick={() => commandCommon('PUSH', record)} icon={<PlayCircleOutlined />} />
                                            </If>
                                            <Button type="text" icon={<SearchOutlined />} />
                                            <Button color="danger" variant="text" icon={<DeleteOutlined />} />
                                        </>
                                    )}
                            />
                        </Table>
                    </If>
                    <Else>
                        <Empty style={{marginTop: '50px'}} />
                    </Else>

                </div>
            </div>
            <Modal title="新建下载"
                   open={isModalOpen}
                   onCancel={handleCancel}
                   width="450px"
                   footer={null}
                   destroyOnClose
                   maskClosable={false}
            >
                <CreateDialog onSubmit={createSuccess} />
            </Modal>
        </>
    )
}

export default  Download
