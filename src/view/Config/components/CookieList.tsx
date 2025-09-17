
import styles from "./CookieList.module.scss";
import {CookieType} from "../../../../types.ts";
import { Space, Table, Button, Flex, Modal } from 'antd';
import type { TableProps } from 'antd';
import { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {getCookieList} from "../../../../electron/models/sysModel.ts";
import API from "../../../request/api.ts";
import {ResultStatus} from "../../../../enums.ts";
import AddCookieDialog from "./addCookieDialog.tsx";
import moment from 'moment'


function CookieList({ onChange }) {

    const [addCookieDialogVisible, setAddCookieDialogVisible] = useState<boolean>(false);
    const [cookieList, setCookieList] = useState<CookieType[]>([]);
    const [activeCookie, setActiveCookie] = useState<CookieType | null>(null);

    const columns: TableProps<CookieType>['columns'] = [
        {
            title: '域名',
            dataIndex: 'domain',
            key: 'domain',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (_, item) => <>{moment(new Date(item.updateTime)).format('YYYY-MM-DD HH:mm')}</>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (_, item) => (
                <Space direction="horizontal">
                    <Button color="primary" variant="text" size={'small'} icon={<EditOutlined />} onClick={() => {
                        setActiveCookie(item)
                        setAddCookieDialogVisible(true)
                    }}/>
                    <Button color="danger" variant="text" size={'small'} icon={<DeleteOutlined />} onClick={ () => delCookie(item) }/>
                </Space>
            ),
        },
    ]

    const getCookieList = async () => {
        const res = await API.getCookieList()
        if(res.status === ResultStatus.OK){
            setCookieList(res.data || [])
        }
    }



    const delCookie = async (param) => {
        const res = await API.delCookie(param)

        if(res.status === ResultStatus.OK){
            getCookieList()
        }
    }

    const saveCookie = async (param) => {
        let res = null

        if(param.id){
            res = await API.updateCookie(param)
        }else{
            res = await API.addCookie(param)
        }

        if(res.status === ResultStatus.OK){
            setAddCookieDialogVisible(false)
            getCookieList()
        }
    }

    useEffect(() => {
        getCookieList()
    }, []);

    return (
        <div style={{marginTop: 20}}>
            <Flex vertical gap={'middle'} >
                <Button type="primary" style={{width: "max-content"}} onClick={() => {setActiveCookie(null);setAddCookieDialogVisible(true)}} size={'small'} icon={<PlusOutlined />}>添加cookie</Button>
                <Table<CookieType>
                    bordered
                    columns={ columns }
                    dataSource={ cookieList }
                    style={{ height: '70vh' }}
                    size={'small'}
                />
            </Flex>
            <Modal
                title={`${activeCookie ? '修改' : '添加'}Cookie`}
                open={ addCookieDialogVisible }
                centered={ true }
                destroyOnClose
                footer={ null }
                onCancel={ () => setAddCookieDialogVisible(false) }
            >
                <AddCookieDialog activeCookie={ activeCookie } onCancel={() => setAddCookieDialogVisible(false) } onConfrim={(val) => saveCookie(val)} />
            </Modal>
        </div>
    )
}

export default CookieList
