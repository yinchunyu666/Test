import React, { Component } from 'react';

import {Layout} from 'antd';

const {Content} = Layout;


export default class extends Component{
    render (){
        return(
            <Content style={{ margin: '24px 16px 0px', background: '#fff' }}>
                {this.props.children}
            </Content>
        )
    }
}