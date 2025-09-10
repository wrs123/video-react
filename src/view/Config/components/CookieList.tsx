
import styles from "./CookieList.module.scss";
import {CookieType} from "../../../../types.ts";
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react'


const columns: TableProps<CookieType>['columns'] = [
    {
        title: '域名',
        dataIndex: 'domain',
        key: 'domain',
    },
    {
        title: 'cookie',
        dataIndex: 'cookie',
        key: 'cookie',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text) => <a>222</a>,
    },
]


function CookieList({ onChange }) {

    const [cookieList, setCookieList] = useState<CookieType[]>([]);

    return (
        <Table<CookieType>
            columns={ columns }
            dataSource={ cookieList }
            style={{ height: '70vh' }}
            size={'small'}
        />
    )
}

export default CookieList
