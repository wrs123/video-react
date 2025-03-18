import { Space, Input, Button, Divider, Form } from "antd";
import {
    FolderOpenOutlined,
    RocketFilled,
} from '@ant-design/icons';
import API from "../../../request/api.ts";
const { TextArea, Search } = Input;

type FieldType = {
    urls?: string;
    path?: string;
};

function CreateDialog (){
    const [formData] = Form.useForm<FieldType>();

    const onFinish = async (values: any) => {
        console.warn(values)
        const res = await API.createTask(values)
        console.warn(res)
    }

     const getFolderPath = async () => {
        const res= await API.getFolderPath()
         console.warn(res.data)
         if(res.status == "OK"){

             formData.setFieldsValue({
                 urls: 'https://www.91porn.com/view_video.php?viewkey=8280bf4b5a31fa5329ed&c=piktl&viewtype=&category=',
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
                <Button type="primary" block htmlType="submit" size="large" icon={<RocketFilled/>}>
                    创建下载
                </Button>
            </Space>
        </Form>

    )
}

export default CreateDialog
