import React from 'react';

import { Row, Col, Input, Button, Form, Modal, Spin, Icon, Card, Checkbox,message } from 'antd';
import fd from '../base/fetchData';
import { connect } from 'react-redux';
import ActionTypes from '../redux/actionTypes';
import actionTypes from '../redux/actionTypes';
const FormItem = Form.Item;
class LoginPage extends React.Component {
    constructor() {
        super();
        this.state = {
            submitting: false
        }
    }
    //第一次载入时自动验证状态
    componentDidMount() {
        this.setState({submitting:true})
        fd.getJSON(fd.ports.login).then((result) => {
            if (result) {
                this.props.dispatch(
                    actionTypes.create(
                        actionTypes.SET_LOGIN_STATE,
                        { isLogin: true }
                    )
                )
            }
            this.setState({ submitting: false })
        }).catch(() => {
            this.setState({ submitting: false })
        })
        this.setState({ submitting: false })
    }

    // 登录动作
    doLogin(e) {
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
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
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="loginPage">
                <Row type="flex" style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Col sm={16}>
                        <div className="left_photo"
                            style={{
                                height: '100%',
                                margin: '0 15%',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <img src="/img/xwz.jpg" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </Col>
                    <Col sm={8} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Spin spinning={this.state.submitting}>
                            <div style={{ overflow: 'hidden' }}>
                                <Card title="请登录" bordered={false} style={{ minWidth: 300 }}>
                                    <Form onSubmit={(e) => this.doLogin(e)} className="login_form">
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
                                </Card>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default connect(state => ({ isLogin: state.get('isLogin') }))(Form.create()(LoginPage))