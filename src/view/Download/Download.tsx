import styles from './Download.module.scss'
import {Button, Modal, Radio, Space, Table, Progress, ConfigProvider, Empty} from "antd";
import {
    PlusOutlined,
    PauseOutlined
} from '@ant-design/icons';
import React, {useState} from 'react'
import {DownloadTaskType} from "../../../types.ts";
import {DownloadFileType, DownloadStatus, ResultStatus} from "../../../enums.ts";
import {If, Else, Then} from 'react-if';
import CreateDialog from "./components/createDialog"
import API from "../../request/api.ts";
import DownloadItem from "./components/DownloadItem.tsx";

const {Column} = Table;

interface DownLoadProps {
    style?: { display: string }
}

function Download({style}: DownLoadProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [downloadList, setDownloadList] = useState<DownloadTaskType[]>([
        {
            id: "string", //下载任务id
            originUrl: "string", //原视频地址
            status: DownloadStatus.ANAL, //下载状态
            TotalBytes: 11111, //视频总字节数
            receivedBytes: 2222222, //已下载的字节数
            savePath: "string", //下载的本地地址
            fileObj: {
                fileName: "string", //文件名
                analysisUrl: 'string', //解析后的下载地址
                suffix: ".mp4", //文件后缀
                fileType: DownloadFileType.M3U8
            },
            speed: 11
        }
    ]);

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

    const commandCommon = async (type: string, item: DownloadTaskType) => {

        switch (type) {
            case "PAUSE":

                item.status = DownloadStatus.PAUSE;
                setDownloadList && setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "PUSH":
                item.status = DownloadStatus.PENDING;
                setDownloadList && setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
            case "UPDATE":
                setDownloadList&& setDownloadList(prevList => prevList.map(preItem =>
                    item.id == preItem.id ? {...preItem, ...item} : preItem
                ));
                break;
        }
    }

    onDownloadUpdate.get((event: unknown, str: any) => {
        commandCommon('UPDATE', str)
    })

    return (
        <>
            <div className={styles.downloadContainer}>
                <div className={styles.containerTop}>
                    <div></div>
                    <div>
                        <Space>
                            <Button icon={<PauseOutlined />}></Button>
                            <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                                新建
                            </Button>
                        </Space>

                    </div>
                </div>
                <div className={styles.downloadList}>
                    <If condition={downloadList.length != 0}>
                        <Then>
                            {
                                downloadList.map((item: DownloadTaskType) => {
                                    return (
                                        <DownloadItem key={item.id} item={item} commandCommon={commandCommon}/>
                                    )
                                })
                            }

                            {/*<Table<DownloadTaskType> dataSource={downloadList} size="small" pagination={false}>*/}
                            {/*    <Column title="" dataIndex="name" key="name" width="50px"*/}
                            {/*            render={(_: any, record: DownloadTaskType) => (*/}
                            {/*                <If condition={record.status == DownloadStatus.PENDING}>*/}
                            {/*                    <Then>*/}
                            {/*                        <Button type="text" onClick={() => commandCommon('PAUSE', record)}*/}
                            {/*                                icon={<PauseCircleOutlined/>}/>*/}
                            {/*                    </Then>*/}
                            {/*                </If>*/}
                            {/*            )}*/}
                            {/*    />*/}
                            {/*    <Column title="名称" dataIndex="name" key="name" ellipsis={true}*/}
                            {/*            render={(_: any, record: DownloadTaskType) => (*/}
                            {/*                <span>{record.fileObj.fileName}</span>*/}
                            {/*            )}*/}
                            {/*    />*/}
                            {/*    <Column title="大小" dataIndex="size" key="size" width="190px"*/}
                            {/*            render={(_: any, record: DownloadTaskType) => (*/}
                            {/*                <span>*/}
                            {/*                <If condition={record.status == DownloadStatus.FINISH}>*/}
                            {/*                    <Then>*/}
                            {/*                        {fileSizeFormat(record.TotalBytes)}*/}
                            {/*                    </Then>*/}
                            {/*                </If>*/}
                            {/*                <If condition={record.status == DownloadStatus.PENDING || record.status == DownloadStatus.PAUSE}>*/}
                            {/*                    <Then>*/}
                            {/*                        {fileSizeFormat(record.receivedBytes)}/{fileSizeFormat(record.TotalBytes)}*/}
                            {/*                        ({percentParse(record.receivedBytes, record.TotalBytes)}%)*/}
                            {/*                    </Then>*/}
                            {/*                </If>*/}
                            {/*            </span>*/}
                            {/*            )}*/}
                            {/*    />*/}
                            {/*    <Column title="状态" dataIndex="progress" key="progress" width="200px"*/}
                            {/*            render={(_: any, record: DownloadTaskType) => (*/}
                            {/*                <div*/}
                            {/*                    style={{display: "flex", flexDirection: "column", paddingRight: "8px"}}>*/}
                            {/*                    <If condition={record.status != DownloadStatus.FINISH && record.status != DownloadStatus.ERROR}>*/}
                            {/*                        <Then>*/}
                            {/*                            <Progress*/}
                            {/*                                percent={record.receivedBytes / record.TotalBytes * 100}*/}
                            {/*                                showInfo={false}*/}
                            {/*                                size="small"*/}
                            {/*                                strokeColor={progressColor(record.status)}*/}
                            {/*                            />*/}
                            {/*                        </Then>*/}
                            {/*                    </If>*/}
                            {/*                    <span style={{*/}
                            {/*                        fontSize: "12px",*/}
                            {/*                        color: "var(--color-text-second)"*/}
                            {/*                    }}>{statusParse(record.status)}*/}
                            {/*                        <If condition={record.status == DownloadStatus.PENDING}>*/}
                            {/*                            <span>{fileSizeFormat(record.speed)}/s</span>*/}
                            {/*                        </If>*/}
                            {/*                    </span>*/}
                            {/*                </div>*/}
                            {/*            )}*/}
                            {/*    />*/}
                            {/*    <Column title="操作" dataIndex="progress" key="progress" width="120px"*/}
                            {/*            render={(_: any, record: DownloadTaskType) => (*/}
                            {/*                <>*/}
                            {/*                    <If condition={record.status == DownloadStatus.PAUSE}>*/}
                            {/*                        <Then>*/}
                            {/*                            <Button type="text"*/}
                            {/*                                    onClick={() => commandCommon('PUSH', record)}*/}
                            {/*                                    icon={<PlayCircleOutlined/>}/>*/}
                            {/*                        </Then>*/}
                            {/*                    </If>*/}
                            {/*                    <Button type="text" icon={<FolderOpenOutlined/>}*/}
                            {/*                            onClick={() => openFolder(record.savePath)}/>*/}
                            {/*                    <Button color="danger" variant="text" icon={<DeleteOutlined/>}/>*/}
                            {/*                </>*/}
                            {/*            )}*/}
                            {/*    />*/}
                            {/*</Table>*/}
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
