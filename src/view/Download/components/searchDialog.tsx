import API from "../../../request/api.ts";
import {ResultStatus} from "../../../shared/enums.ts";
import styles from "../Download.module.scss";
import { Button, Empty, Input } from "antd";
import Icon, { CloseOutlined, AimOutlined, EnterOutlined, ArrowUpOutlined, ArrowDownOutlined, FileOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react'
import { If, Then, Else } from 'react-if'
import searchIcon from '../../../assets/svgs/search-icon.svg?react'

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
                <Input ref={ inputRef } prefix={ <Icon style={{marginRight: '10px'}} component={ searchIcon } /> } placeholder="搜索下载内容或任务" size={ 'large' } variant="borderless" onInput={ searchTask } />
                <div className={styles.divider}></div>
                <Button color="default" className={styles.closeBtn} variant="text" onClick={ props.close }>
                    <CloseOutlined />
                </Button>
            </div>
            <div className={ styles.taskContainer } >
                <If condition={ taskList.length === 0 }>
                    <Empty />
                </If>
                {
                    taskList.map(item => {
                        return (
                            <div className={ styles.taskItem } key={ item.id }>
                                <div className={ styles.searchItemIcon } >
                                    <FileOutlined />
                                </div>
                                <div className={ styles.name }>{ item.name }</div>
                                <Button color="default" variant="text" icon={ <AimOutlined /> }>

                                </Button>

                            </div>
                        )
                    })
                }
            </div>
            <div className={ styles.searchBottom }>
                <div className={ styles.shortCutItem }>
                    <EnterOutlined />
                    <div className={ styles.btnText }>选择</div>
                </div>
                <div className={ styles.shortCutItem }>
                    <ArrowUpOutlined />
                    <ArrowDownOutlined />
                    <div className={ styles.btnText }>导航</div>
                </div>
            </div>
        </div>
    )
}

export default SearchDialog
