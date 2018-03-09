import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Spin, message,Icon,Checkbox } from 'antd'
import fd from '../base/fetchData'
import { connect } from 'react-redux';
import actionTypes from '../redux/actionTypes';
const FormItem = Form.Item;
class LoginModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false        }
    }
    

     // 登录动作
     doLogin(e) {
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
            const {dispatch,actionTypes} =this.props; 
            if (!error) {
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.login, values).then((data) => {
                    //成功设置redux里isLogin
                    this.props.dispatch(
                        actionTypes.create(
                            actionTypes.SET_LOGIN_STATE,
                            { isLogin: true }
                        )
                    )
                }).catch((error) => {
                    this.setState({ submitting: false });
                    message.error("登录失败")
                })
            }
        })
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
                title="请登录"
                visible={this.props.isLogin}
                footer={null}
                maskClosable={false}
                width={400}
                zIndex={2000}
                closable={false}

            >
                <Form 
                onSubmit={(e) => this.doLogin(e)} 
                className="login_form">
                    <FormItem>
                        {
                            getFieldDecorator('login_id', {
                                rules: [{
                                    required: true,
                                    message: '必须输入登录账号'
                                }]
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                    placeholder="用户名"
                                />
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: '必须输入密码'
                                }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,0.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('remember', {
                                valuePropaName: 'checked',
                                initalValue: true
                            })(
                                <Checkbox>
                                    一个月内免登录
                                </Checkbox>
                            )
                        }
                    </FormItem>
                    <FormItem style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
export default (Form.create()(LoginModal))