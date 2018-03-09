import React from 'react';

import { Breadcrumb, Icon } from 'antd';

import LeftMenu from '../options/left_menu';

export default class extends React.Component {
    find_path(url) {
        const path = [];
        const find = (list = []) => {
            for (let item of list) {
                path.push(item);
                switch (item.type) {
                    case "SubMenu":
                    case "MenuItemGroup":
                        if (find(item.children)) {
                            return true;
                        }
                        break;
                    case "Item":
                        if (url == item.url) {
                            return true
                        }   
                }
                path.pop()
            }
        }

        find(LeftMenu);
        return path;
    }

    create_item() {
        const url = window.location.pathname;
        return this.find_path(url).map((v, k) => {
            return (
                <Breadcrumb.Item key={`k`}>
                    <Icon type={v.icon} />
                    <span>{v.title}</span>
                </Breadcrumb.Item>
            )
        })
    }


    render() {
        return (
            <Breadcrumb>
                {this.create_item()}
            </Breadcrumb>
        )
    }
}
