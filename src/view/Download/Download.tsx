import styles from './Download.module.scss'
import {Button, Modal, Radio, Space, Table, Progress, ConfigProvider, Empty} from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    FolderOpenOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined
} from '@ant-design/icons';
import {useState} from 'react'
import {DownloadTaskType} from "../../../types.ts";
import {DownloadStatus, ResultStatus} from "../../../enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"
import {createStyles} from 'antd-style';
import API from "../../request/api.ts";

const {Column} = Table;

interface DownLoadProps {
    style?: { display: string }
}

function Download({style}: DownLoadProps) {
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
        if (size == 0 || size < finishSize) {
            return 0
        }

        return (finishSize / size * 100).toFixed(2).replace(/\.?0+$/, '');
    }

    const statusParse = (status: DownloadStatus) => {
        let res: string = ""

        switch (status) {
            case DownloadStatus.PENDING:
                res = "下载中"
                break;
            case DownloadStatus.PAUSE:
                res = "已暂停"
                break;
            case DownloadStatus.FINISH:
                res = "下载完成"
                break;
            case DownloadStatus.ANAL:
                res = "解析中"
                break;
            case DownloadStatus.ANALERROR:
                res = "解析失败"
                break;
            case DownloadStatus.ERROR:
                res = "下载失败"
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
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "PUSH":
                item.status = DownloadStatus.PENDING;
                setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "UPDATE":
                setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
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

    onDownloadUpdate.get((event: unknown, str: any) => {
        commandCommon('UPDATE', str)
    })

    const openFolder = async (path: string) => {
        const res = await API.openFolderPath({path: path})
        console.warn(res)
    }

    const fileSizeFormat = (bytes: number) => {
        return (bytes / (1024 * 1024)).toFixed(0) + 'MB';
    }

    return (
        <>
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <div></div>
                    {/*<Radio.Group defaultValue="a" buttonStyle="solid">*/}
                    {/*    <Radio.Button value="a">*/}
                    {/*        <Space>*/}
                    {/*            <ClockCircleOutlined/>*/}
                    {/*            下载中*/}
                    {/*        </Space>*/}
                    {/*    </Radio.Button>*/}
                    {/*    <Radio.Button value="b">*/}

                    {/*        <Space>*/}
                    {/*            <CheckCircleOutlined/>*/}
                    {/*            已完成*/}
                    {/*        </Space>*/}
                    {/*    </Radio.Button>*/}
                    {/*</Radio.Group>*/}
                    <div>
                        <Button type="primary" shape="circle" icon={<PlusOutlined/>} onClick={showModal}>
                        </Button>
                    </div>
                </div>
                <div className={styles.downloadList}>
                    <If condition={downloadList.length != 0}>
                        <Then>
                            <Table<DownloadTaskType> dataSource={downloadList} size="small" pagination={false}>
                                <Column title="" dataIndex="name" key="name" width="50px"
                                        render={(_: any, record: DownloadTaskType) => (
                                            <If condition={record.status == DownloadStatus.PENDING}>
                                                <Then>
                                                    <Button type="text" onClick={() => commandCommon('PAUSE', record)}
                                                            icon={<PauseCircleOutlined/>}/>
                                                </Then>
                                            </If>
                                        )}
                                />
                                <Column title="名称" dataIndex="name" key="name" ellipsis={true}
                                        render={(_: any, record: DownloadTaskType) => (
                                            <span>{record.fileObj.fileName}</span>
                                        )}
                                />
                                <Column title="大小" dataIndex="size" key="size" width="190px"
                                        render={(_: any, record: DownloadTaskType) => (
                                            <span>
                                            <If condition={record.status == DownloadStatus.FINISH}>
                                                <Then>
                                                    {fileSizeFormat(record.TotalBytes)}
                                                </Then>
                                            </If>
                                            <If condition={record.status == DownloadStatus.PENDING || record.status == DownloadStatus.PAUSE}>
                                                <Then>
                                                    {fileSizeFormat(record.receivedBytes)}/{fileSizeFormat(record.TotalBytes)}
                                                    ({percentParse(record.receivedBytes, record.TotalBytes)}%)
                                                </Then>
                                            </If>
                                        </span>
                                        )}
                                />
                                <Column title="状态" dataIndex="progress" key="progress" width="200px"
                                        render={(_: any, record: DownloadTaskType) => (
                                            <div
                                                style={{display: "flex", flexDirection: "column", paddingRight: "8px"}}>
                                                <If condition={record.status != DownloadStatus.FINISH && record.status != DownloadStatus.ERROR}>
                                                    <Then>
                                                        <Progress
                                                            percent={record.receivedBytes / record.TotalBytes * 100}
                                                            showInfo={false}
                                                            size="small"
                                                            strokeColor={progressColor(record.status)}
                                                        />
                                                    </Then>
                                                </If>
                                                <span style={{
                                                    fontSize: "12px",
                                                    color: "var(--color-text-second)"
                                                }}>{statusParse(record.status)}
                                                    <If condition={record.status == DownloadStatus.PENDING}>
                                                        <span>{fileSizeFormat(record.speed)}/s</span>
                                                    </If>
                                                </span>
                                            </div>
                                        )}
                                />
                                <Column title="操作" dataIndex="progress" key="progress" width="120px"
                                        render={(_: any, record: DownloadTaskType) => (
                                            <>
                                                <If condition={record.status == DownloadStatus.PAUSE}>
                                                    <Then>
                                                        <Button type="text"
                                                                onClick={() => commandCommon('PUSH', record)}
                                                                icon={<PlayCircleOutlined/>}/>
                                                    </Then>
                                                </If>
                                                <Button type="text" icon={<FolderOpenOutlined/>}
                                                        onClick={() => openFolder(record.savePath)}/>
                                                <Button color="danger" variant="text" icon={<DeleteOutlined/>}/>
                                            </>
                                        )}
                                />
                            </Table>
                        </Then>
                        <Else>
                            <Empty style={{marginTop: '50px'}}/>
                        </Else>
                    </If>
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
                <CreateDialog onSubmit={createSuccess}/>
            </Modal>
        </>
    )
}

export default Download
