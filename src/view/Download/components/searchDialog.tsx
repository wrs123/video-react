import API from "../../../request/api.ts";
import {ResultStatus} from "../../../shared/enums.ts";
import styles from "../Download.module.scss";
import { Button, Empty, Input } from "antd";
import { CloseOutlined, AimOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react'
import {If, Then} from 'react-if'


const SearchDialog = (props: any) => {
    const inputRef = useRef(null);
    const [query, setQuery] = useState("");
    const [taskList, setTaskList] = useState([]);


    const searchTask = async (e: any) => {
        console.warn(e)
        const _query = `${e.target.value}`;
        setQuery(_query)
        console.warn(_query)
        if(_query === ''){
            setTaskList([])
            return
        }
        const res = await API.getTaskList({ name: _query })
        if(res.status === ResultStatus.OK){
            console.warn(res)
            setTaskList(res.data.list || [])
        }
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);


    return (
        <div className={ styles.searchDialog }>
            <div className={ styles.searchHeader } >
                <Input ref={ inputRef } placeholder="请输入搜索内容" size={ 'large' } variant="borderless" onInput={ searchTask } />
                <div className={styles.divider}></div>
                <Button color="default" className={styles.closeBtn} variant="text" onClick={ props.close }>
                    <CloseOutlined />
                </Button>
            </div>
            <If condition={ query != '' }>
                <Then>
                    <div className={ styles.taskContainer } >
                        <If condition={ taskList.length === 0 }>
                            <Empty />
                        </If>
                        {
                            taskList.map(item => {
                                return (
                                    <div className={ styles.taskItem } key={ item.id }>
                                        <div className={ styles.name }>{ item.name }</div>
                                        <Button color="default" variant="text" >
                                            <AimOutlined />
                                        </Button>

                                    </div>
                                )
                            })
                        }
                    </div>
                </Then>
            </If>

        </div>
    )
}

export default SearchDialog
