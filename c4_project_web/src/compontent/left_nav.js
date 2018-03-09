import React from 'react';
import {  Menu, Icon } from 'antd';
import LeftMenu from '../options/left_menu';
import { Link } from 'react-router-dom';


function createMenu(items, key) {
    return items.map((v, k) => {
        switch (v.type) {
            case "Item":
                return (
                    <Menu.Item key={v.url}>
                        <Link to={v.url}>
                            <Icon type={v.icon} />
                            <span>{v.title}</span>
                        </Link >
                    </Menu.Item >
                )
            case "SubMenu":
                return (
                    <Menu.SubMenu
                        key={`${key}_${k}`}
                        title={<span><Icon type={v.icon} /><span>{v.title}</span></span>}
                    >
                        {createMenu(v.children, `${key}_${k}`)}
                    </Menu.SubMenu>
                )
            case "MenuItemGroup":
                return (
                    <Menu.ItemGroup
                        key={`${key}_${k}`}
                        title={<span><Icon type={v.icon} /><span>{v.title}</span></span>}
                    >
                        {createMenu(v.children, `${key}_${k}`)}
                    </Menu.ItemGroup>
                )
        }
    })
}

export default class extends React.Component {
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} 
                selectedKeys={[window.location.pathname]}
            >
                {createMenu(LeftMenu, 0)}
            </Menu>

        )
    }
}