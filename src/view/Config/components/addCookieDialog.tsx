import {CookieType} from "../../../../types.ts";
import API from "../../../request/api.ts";
import { Form, Input, Flex, Button } from "antd";
const { TextArea, Search } = Input;
import { useState, useEffect } from 'react'
import { CloudSyncOutlined } from '@ant-design/icons';

function AddCookie({ onConfrim, onCancel, activeCookie }) {
    const [formData] = Form.useForm<CookieType>()
    const defaultValue = activeCookie || {}

    const confrim = (val) => {
        onConfrim({
            ...defaultValue,
            ...val
        })
    }



    useEffect( () => {
        console.warn(1111)
    }, [])

    return (
        <>
            <Form
                name="addCookie"
                form={formData}
                layout={'vertical'}
                initialValues={ defaultValue }
                autoComplete="off"
                size="middle"
                onFinish={ confrim }
            >
                <Flex vertical >
                    <Form.Item<CookieType>
                        name="domain"
                        label={'域名'}
                        rules={[{ required: true, message: '请输入网站域名' }]}
                        style={{marginBottom: '0px'}}
                    >
                        <Input placeholder="请输入网站域名" />
                    </Form.Item>
                    <Form.Item<CookieType>
                        name="cookies"
                        label={
                            <Flex justify="space-between" style={{ width: '100%' }} align="center">
                                <span>cookie</span>
                                {/*<Button type="link" size="small" onClick={ getCookieByBrowser } icon={<CloudSyncOutlined />}>*/}
                                {/*    获取cookie*/}
                                {/*</Button>*/}

                            </Flex>
                        }
                        rules={[{ required: true, message: '请输入cookie' }]}
                        style={{marginBottom: '0px'}}
                    >
                        <TextArea placeholder="请输入cookie" autoSize={{ minRows: 10, maxRows: 10 }}></TextArea>
                    </Form.Item>
                </Flex>
                <Flex gap={'small'} justify={'flex-end'} style={{marginTop: '12px'}}>
                    <Button onClick={ onCancel }>
                        取消
                    </Button>
                    <Button htmlType="submit" type="primary" >
                        确认
                    </Button>
                </Flex>
            </Form>
        </>
    )
}

export default AddCookie;
