import React from 'react';
import Container from '../../compontent/container';
import fd from '../../base/fetchData';
import { Table, Button, Icon, Form, Select, Input, Modal, Spin,message } from 'antd';
import moment from 'moment';
import ModalAdd from './create_user';
import ModalEdit from './edit_user';
const Option = Select.Option;
const FormItem = Form.Item;


export default class extends React.Component {
    constructor(props) {
        super();
        this.state = {
            list: [],
            loading: false,
            //关键字查询
            keyword: '',

            //分页
            pageNum: 1,
            pageSize: 10,
            list_total: 0,

            //两个弹层
            show_add: false,
            show_edit: false,

            //编辑弹层时自带原本数据
            edit_data: null,

        }
    }


    componentDidMount() {
        this.get_list()
    }
    async get_list() {
        this.setState({ loading: true })
        let { keyword, pageNum, pageSize} = this.state;
        try {
            let result = await fd.getJSON(fd.ports.admin.user.list, { keyword,pageNum, pageSize });
            this.setState({ list: result.list, list_total: result.total })
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            this.setState({ loading: false })
        }
    }


    async  handler_remove(user_id) {
        try {
            await fd.postJSON(fd.ports.admin.user.remove, { user_id });
            this.get_list();
        }
        catch (error) {
            message.error(error.message)
        }
    }
    render() {

        const columns = [{
            title: '用户姓名',
            dataIndex: 'user_name'
        },
        {
            title: '登录ID',
            dataIndex: 'login_id'
        },
        {
            title: '角色',
            dataIndex: 'role_name'
        }, {
            title: '上次登录',
            dataIndex: 'last_login',
            render:(text)=>text?moment(text).format('YYYY-MM-DD HH:mm:ss'):'用户未登录过'
        },
         {
            title: "",
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
                            onClick={
                                () => {
                                    Modal.confirm({
                                        title: '删除用户',
                                        content: "您确定要删除吗？",
                                        onOk: () => {
                                            this.handler_remove(record.user_id)
                                        }

                                    })
                                }}
                        >
                            <Icon type="delete" />
                            删除
                        </Button>
                    </span >
                )
            }
        }];
        const pagination = {
            total: this.state.list_total,
            defaultPageSize: this.state.pageSize,
            onChange: (pageNum, pageSize) => {
                this.setState({ pageNum, pageSize }, () => {
                    this.get_list();
                });
            },
            onShowSizeChange: (pageNum, pageSize) => {
                this.setState({ pageNum, pageSize }, () => {
                    this.get_list();
                });
            },
            showSizeChanger:true
        }
        return (

            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Form layout="inline" style={{ height: 39 }}
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    this.get_list()
                                }
                            }
                        >
                            <FormItem>
                                <Button onClick={() => {
                                    this.setState({ show_add: true })
                                }}>
                                    <Icon type="user-add" />
                                    添加用户
                                </Button>
                            </FormItem>
                            
                            <FormItem label="关键字">
                                <Input placeholder="请输入关键字" onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                            </FormItem>
                            <FormItem>
                                <Button htmlType="submit">
                                    <Icon type="search" />
                                    查找
                                </Button>
                            </FormItem>
                        </Form>

                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <Table
                            columns={columns}
                            dataSource={this.state.list}
                            rowKey={(r) => r.user_id}
                            pagination={pagination}
                        />
                    </Spin>
                </Container>
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
            </div>);
    }

}