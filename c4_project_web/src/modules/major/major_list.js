import React from 'react';
import async from 'async'
import { Table, Button, Spin, Form, Icon, Modal, List,message } from 'antd';

import Container from '../../compontent/container';
import ModalAdd from './create_major';

import ModalEdit from './edit_major';
import fd from '../../base/fetchData';


export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,
            edit_data: null,
            show_edit: false,
            show_add: false
        }
    }
    componentDidMount() {
        this.get_list();
    }

    //第一次加在列表
    async get_list() {
        this.setState({ loading: true })
        try {
            let list = await fd.getJSON(fd.ports.option.major.list);
            this.setState({ list: list })
        }
        catch (error) {
            message.error(error.message)
        } finally {
            this.setState({ loading: false })
        }
    }

    //删除数据
    async  handler_remove(major_id) {
        try {
            await fd.postJSON(fd.ports.option.major.remove, { major_id });
            this.get_list();
        }
        catch (error) {
            message.error(error.message)
        }
    }
    render() {
        return (
            <div>
                <Container>


                    {this.state.show_add &&
                        <ModalAdd
                            show={this.state.show_add}
                            handler_close={() => this.setState({ show_add: false })}
                            get_list={this.get_list.bind(this)}
                        />
                    }
                    {this.state.show_edit &&
                        <ModalEdit
                            show={this.state.show_edit}
                            handler_close={() => this.setState({ show_edit: false })}
                            get_list={this.get_list.bind(this)}
                            EditData={this.state.edit_data}
                        />
                    }

                    <Spin spinning={this.state.loading}>
                        <List bordered
                            header={
                                <Button
                                    onClick={() => {
                                        this.setState({ show_add: true })
                                    }}
                                >
                                    <Icon type="file-add" />
                                    添加专业
                                </Button>
                            }
                            dataSource={this.state.list}
                            renderItem={
                                (item) => (
                                    <List.Item
                                        actions={[
                                            <Button size="small"
                                                onClick={() => this.setState({ show_edit: true, edit_data: item })}>
                                                <Icon type="edit" />
                                                修改
                                    </Button>,
                                            <Button size="small"
                                                onClick={() =>
                                                    Modal.confirm({
                                                        title: '删除课程',
                                                        content: "您确定要删除吗？",
                                                        onOk: () => {
                                                            this.handler_remove(item.major_id)
                                                        }

                                                    })
                                                }
                                            >
                                                <Icon type="delete" />
                                                删除
                                    </Button>
                                        ]}
                                    >

                                        <List.Item.Meta title={item.major_name} />


                                    </List.Item>
                                )


                            }
                        />
                    </Spin>


                </Container>
            </div>
        )
    }
}