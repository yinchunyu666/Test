import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Spin, Select, message } from 'antd'
import fd from '../base/fetchData';
import { connect } from 'react-redux';
import actionTypes from '../redux/actionTypes';
const FormItem = Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false
        }
    }
    //关闭弹层有过度
    handler_hidden() {
        this.setState({ visible: false })
    }
    //提交动作
    handler_submit(e) {

        this.props.form.validateFields((error, values) => {
            if (!error) {
                //验证通过，提交请求
                this.setState({ loading: true })
                Modal.confirm({
                    title: '修改密码',
                    content: "确认要修改密码吗",
                    onOk: () => {
                        fd.postJSON(fd.ports.editPassword, values).then(() => {
                            this.props.handler_close();
                            Modal.confirm({
                                title: '修改成功',
                                content: "请问要重新登录吗？",
                                onOk: () => {
                                    this.props.dispatch(
                                        actionTypes.create(
                                            actionTypes.SET_LOGIN_STATE, { isLogin: false }
                                        )
                                    )

                                }
                            })
                        }).catch((error) => {
                            message.error("修改密码失败")
                        });
                        this.setState({ loading: false })
                    }
                })

            }
        });
        if (e) {
            e.preventDefault();//不执行默认动作。即不刷新
        }
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
                title="修改密码"
                visible={this.state.visible}
                onCancel={() => { this.handler_hidden() }}
                footer={null}
                afterClose={() => this.props.handler_close()}//弹层完全关闭后调用handlerclose，使showadd变为false
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>

                    <FormItem
                        {...formItemLayout}
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                max: 32,
                                message: '密码最长为32位!'
                            }, {
                                required: true,
                                message: '必需输入密码!',
                            }],
                        })(
                            <Input type="password" placeholder="请输入密码" />
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
                            <Input type="password" placeholder="请再次输入密码" />
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>提交</Button>

                        <Button onClick={() => { this.handler_hidden() }} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default connect(state => ({ isLogin: state.get('isLogin') }))(Form.create()(Create))