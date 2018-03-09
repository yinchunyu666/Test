import React from 'react';

import { Layout, Icon, Menu, Dropdown, Button, Modal, Form, Input, message } from 'antd';

import { connect } from 'react-redux';
import actionTypes from '../redux/actionTypes';
import ModalEdit from './edit_password';
import BreadCrumb from './Breadcrumb';
import fd from '../base/fetchData';
import LoginModal from './login_modal';
const { Header } = Layout;

class UserBtn extends React.Component {
    constructor() {
        super();
        this.state = {
            show_edit: false
        }
    }
    handler_click(e) {
        switch (e.key) {
            case '2':
                this.props.handler_logout();
                break;
            case '1':
                this.setState({ show_edit: true })
        }
    }
    render() {
        const menu = (
            <Menu onClick={(e) => this.handler_click(e)} >
                <Menu.Item key="1">修改密码</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">退出登录</Menu.Item>
            </Menu>
        )
        if (this.props.isLogin) {
            return (
                <div>
                    <Dropdown overlay={menu}>
                        <Button shape="circle">
                            <Icon type="user" />
                        </Button>
                    </Dropdown>
                    {
                        this.state.show_edit &&
                        <ModalEdit
                            show={this.state.show_edit}
                            handler_close={() => this.setState({ show_edit: false })}
                        />
                    }
                </div>
            )
        } else {
            return null;
        }

    }

}

class Head extends React.Component {

    toggle() {
        this.props.dispatch(actionTypes.create(actionTypes.COLLASPED_IS_SIDER, !this.props.collapsed))
    }

    handler_logout() {
        fd.postJSON(fd.ports.logout, {}).then(() => {
            this.props.dispatch(
                actionTypes.create(
                    actionTypes.SET_LOGIN_STATE, { isLogin: false }
                )
            )
            this.props.dispatch(
                actionTypes.create(
                    actionTypes.SET_VIEW_IS_MOUNT, { isMount: true }
                )
            )
        }).catch((error) => {
            message.error("退出失败")
        })
    }

    render() {
        return (
            <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle.bind(this)}
                />
                <BreadCrumb path={window.location.pathname} />
                <div style={{ float: 'right', padding: '0 15px' }}>
                    <UserBtn
                        isLogin={this.props.isLogin}
                        handler_logout={() => this.handler_logout()}
                    />
                    <LoginModal 
                        isLogin={!this.props.isLogin}
                        dispatch={this.props.dispatch}
                        actionTypes={actionTypes}
                    />
                </div>
            </Header>
        )
    }
}

export default connect(state => ({ collapsed: state.getIn(["view", "collapsed"]), isLogin: state.get("isLogin") }))(Head)