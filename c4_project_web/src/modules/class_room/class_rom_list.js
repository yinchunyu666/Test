import React from 'react';

import { Table, Button, Spin, Form, Icon, Modal ,message} from 'antd';

import Container from '../../compontent/container';
import ModalAdd from './create_class_room';

import ModalEdit from './edit_class_room';
import fd from '../../base/fetchData';
import async from 'async';

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
        try{      
            let list=await fd.getJSON(fd.ports.option.class_room.list);
            this.setState({ list, loading: false })
        }
        catch(error){
             message.error(error.message)
        }
        finally{
            this.setState({ loading: false })
        }
    }

    //删除数据
    handler_remove(room_id) {
        Modal.confirm({
            title: '删除班级',
            content: "您确定要删除吗？",
            onOk: () => {
                this.setState({ loading: true })
                fd.postJSON(fd.ports.option.class_room.remove, { room_id }).then(() => {
                    this.setState({ loading: false });
                    this.get_list();
                }).catch((error) => {
                    this.setState({ loading: false });
                    message.error(error.message)
                })
            }
        })
    }
    render() {
        const columns = [{
            title: '教室名称',
            dataIndex: 'room_name',
        }, {
            title: '容纳人数',
            dataIndex: 'size',
        },  {
            title: "",
            key: "action",
            render: (text, record) => {
                return (
                    <span>
                        <Button size="small"
                        onClick={() => this.setState({ show_edit: true, edit_data: record })}>
                            <Icon type="edit" />
                            修改
                        </Button>
                        <span className="ant-divider" />
                        <Button size="small"
                            onClick={() => this.handler_remove(record.room_id)}
                        >
                            <Icon type="delete" />
                            删除
                        </Button>
                    </span >
                )
            }
        }];
        return (
            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Form layout="inline" style={{ height: 39 }}>
                            <Form.Item>
                                <Button
                                    onClick={() => { 
                                        this.setState({ show_add: true }) }}
                                >
                                    <Icon type="file-add" />
                                    添加教室
                                </Button>
                            </Form.Item>
                        </Form>
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
                    </div>
                </Container>
                <Container>
                    <Spin tip="正在加载" spinning={this.state.loading}>
                        <div style={{ overflow: 'hidden' }}>
                            <Table
                                dataSource={this.state.list}
                                columns={columns}
                                pagination={false}
                                rowKey={(r) => r.room_id}
                            />
                        </div>
                    </Spin>
                </Container>
            </div>
        )
    }
}