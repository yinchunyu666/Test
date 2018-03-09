import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Spin, Select,message } from 'antd'
import fd from '../../base/fetchData'
const FormItem = Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false,
            list: []
        }
    }


    async get_role() {
        try {
            var list = await fd.getJSON(fd.ports.admin.role.list);
            this.setState({ list })
        } catch (error) {
            message.error(error.message)
        }
    }

    componentDidMount() {
        if (this.props.EditData) {
            const { login_id, user_name, remark, role_id, user_id } = this.props.EditData;

            this.props.form.setFieldsValue({
                login_id, user_name, remark, role_id:role_id.toString(), user_id
            });
        }
        this.get_role();
    }
    //关闭弹层有过度
    handler_hidden() {
        this.setState({ visible: false })
    }
    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();//不执行默认动作。即不刷新
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const do_it = () => {
                    //验证通过，提交请求
                    values.user_id = this.props.EditData.user_id;
                    this.setState({ loading: true })
                    fd.postJSON(fd.ports.admin.user.update, values).then(() => {
                        this.setState({ loading: false })
                        this.handler_hidden();
                        this.props.get_list()
                    }).catch((error) => {
                        message.error(error.message)
                    });
                    this.setState({ loading: false })
                }
                if (this.props.form.getFieldValue('password')) {
                    Modal.confirm({
                        title: '确认操作',
                        content: '检测到你已经修改了密码，确定吗？',
                        onOk: () => do_it()
                    })
                }else{
                    do_it();
                }
            }
        });
    }
    eq_password(rule, value, callback) {
        const form = this.props.form;
        const pw = form.getFieldValue("password")
        if (pw === value) {
            callback()
        } else {
            callback("两次输入的密码不同!")
        }
    }
    render() {
        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单内输入项大小比例 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return (
            <Modal
                title="编辑用户"
                visible={this.state.visible}
                onCancel={this.handler_hidden.bind(this)}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="用户名称"
                    >
                        {getFieldDecorator('user_name', {
                            rules: [{
                                max: 10,
                                message: `最多只能输入10个字`
                            }, {
                                required: true,
                                message: '必需输入用户名称',
                            }],
                        })(
                            <Input placeholder="请输入用户名称" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="登录ID"
                    >
                        {getFieldDecorator('login_id', {
                            rules: [{
                                required: true,
                                message: '必需输入登录ID!',
                            }],
                        })(
                            <Input placeholder="请输入登录ID" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                max: 32,
                                message: '密码最长为32位!'
                            }],
                        })(
                            <Input type="password" placeholder="如果不想改密码就不要输入" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                    >
                        {getFieldDecorator('eq_password', {
                            rules: [{
                                max: 32,
                                message: '密码最长为32位!'
                            }, {
                                validator: this.eq_password.bind(this)
                            }],
                        })(
                            <Input type="password" placeholder="如果不想改密码就不要输入" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="选择角色"
                    >
                        {getFieldDecorator('role_id', {
                            rules: [{
                                required: true,
                                message: '必需选择角色!',
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                            >
                                {this.state.list.map((v, k) => {
                                    return (
                                        <Select.Option key={v.role_id}>{v.role_name}</Select.Option>
                                    )

                                })}
                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注信息"
                    >
                        {getFieldDecorator('remark', {
                            rules: [{
                                max: 200,
                                message: `最多只能输入200个字`
                            }],
                        })(
                            <Input.TextArea placeholder="请输入备注信息" />
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>提交</Button>

                        <Button onClick={this.handler_hidden.bind(this)} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Create);