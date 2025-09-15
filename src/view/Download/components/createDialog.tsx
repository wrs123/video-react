import { Space, Input, Button, Divider, Form, message, Modal } from "antd";
import { useState, useEffect } from 'react'
import {
    FolderOpenOutlined,
    RocketFilled,
} from '@ant-design/icons';
import API from "../../../request/api.ts";
import {ResultStatus} from "../../../../enums.ts";
const { TextArea, Search } = Input;

type FieldType = {
    urls?: string;
    path?: string;
};


function CreateDialog ({ onSubmit, onError }){
    const [formData] = Form.useForm<FieldType>()
    const [posting, setPosting ] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();



    useEffect(() => {
        formData.setFieldsValue({
            path: window['sysConfig'].savePath,
        })
    }, [])

    const onFinish = async (values: any) => {
        setPosting(true)
        const res = await API.createTask(values)
        console.warn(res)
        if(res.status == ResultStatus.OK){
            onSubmit(res.data)
            messageApi.open({
                type: 'success',
                content: '创建成功',
            });
        }else{

            if(res.code === 202){
                setPosting(false)
                onError(res.data)
            }else{
                messageApi.open({
                    type: 'warning',
                    content: `创建失败：${res.message}`,
                });
            }
        }
        setPosting(false)
    }

     const getFolderPath = async () => {
        const res= await API.getFolderPath()
         console.warn(res.data)
         if(res.status == "OK"){
             // https://www.91porn.com/view_video.php?viewkey=a68aa309566890ce4144&c=piktl&viewtype=&category=
             formData.setFieldsValue({
                 path: res.data,
             })
         }
    }

    return (
        <Form
            form={formData}
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{}}
        >
            {contextHolder}
            <Space direction="vertical"  style={{ display: 'flex' }}>
                <Form.Item<FieldType>
                    name="urls"
                    rules={[{ required: true, message: '请输入下载链接' }]}
                    style={{marginBottom: '0px'}}
                >
                    <TextArea placeholder="多链接下载请换行" autoSize={{ minRows: 5, maxRows: 5 }}></TextArea>
                </Form.Item>
                <Form.Item<FieldType>
                    name="path"
                    rules={[{ required: true, message: '请选择下载地址' }]}
                    style={{marginBottom: '0px'}}
                >
                    <Search placeholder="请选择下载路径"
                            disabled={true}
                            onSearch={() => getFolderPath()}
                            enterButton={ <Button disabled={false} type="primary" icon={<FolderOpenOutlined />} >
                                选择位置
                            </Button>} />
                </Form.Item>
                <Divider variant="dashed" style={{margin: "4px"}} />
                <Button type="primary" loading={posting} block htmlType="submit" size="large" icon={<RocketFilled/>}>
                    创建下载
                </Button>
            </Space>
        </Form>

    )
}

export default CreateDialog
