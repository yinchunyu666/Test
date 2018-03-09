import React from 'react';
import {Layout,Icon} from 'antd';
import LaftNav from './left_nav';

import { connect } from 'react-redux';
const {Sider} = Layout;
class LeftBar extends React.Component {

    render() {
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
            >
                <div className="logo">
                    <Icon style={{ fontSize: 14, color: 'white' }} type="github" />
                    <span className={!this.props.collapsed ? "logo_info_words" : "none"}>学生信息管理</span>
                </div>

                <LaftNav collapsed={this.props.collapsed} />
            </Sider>
        )
    }
}

export default connect(state=>({collapsed:state.getIn(["view","collapsed"])}))(LeftBar)