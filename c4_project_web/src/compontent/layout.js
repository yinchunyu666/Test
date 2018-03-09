import React, { Component } from 'react';
import { Layout, Icon, LocaleProvider } from 'antd';
//路由组件引入
import Routers from '../router';

//引入功能型组件

import HeadBar from './headBar';
import LeftBar from './left_bar';
//国际化组件，让有默认语言包的自动变成中文,如弹层文字
import zh_CN from 'antd/lib/locale-provider/zh_CN';



const { Sider } = Layout;
export default class extends Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
                    <LocaleProvider locale={zh_CN}>
                        <Layout>
                            <LeftBar path={window.location.pathname}/>
                            <Layout style={{ paddingBottom: 24 }}>
                                <HeadBar path={window.location.pathname}/>
                                {/* 路由组件引入区 */}
                                <Routers />
                            </Layout>
                        </Layout>
                    </LocaleProvider>
                
        );
    }
}

