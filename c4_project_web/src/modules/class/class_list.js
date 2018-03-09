import React from 'react';
import { Table, Button, Icon, Form, Select, Input, Spin, Modal,message } from 'antd';
import { Redirect } from 'react-router-dom';
import fd from '../../base/fetchData';

import Container from '../../compontent/container';

import ModalAdd from './create_class';
import ModalEdit from './edit_class';


const FormItem = Form.Item;




export default class extends React.Component {


    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,



            //关键字查询
            keyword: '',

            //分页
            pageNum: 1,
            pageSize:10,
            list_total:0,


            //跳到课程表和学生管理
            redirect_schedule: null,
            redirect_student_list: null,

            //两个弹层
            show_add: false,
            show_edit: false,

            //编辑弹层时自带原本数据
            edit_data: null
        }
    }


    componentDidMount() {
        this.get_list()
    }
    async get_list() {
        this.setState({ loading: true })

        try {
            const { keyword, pageNum, pageSize } = this.state;
            let result = await fd.getJSON(fd.ports.option.class.list, { keyword, pageNum, pageSize });
            this.setState({ list:result.list,list_total:result.total })
        }
        catch (error) {
            message.error(error.message)

        }
        finally {
            this.setState({ loading: false })
        }
    }

    async  handler_remove(class_id) {
        try {
            await fd.postJSON(fd.ports.option.class.remove, { class_id });
            this.get_list();
        }
        catch (error) {
            message.error(error.message)
        }
    }
    render() {

        if (!!this.state.redirect_student_list) {
            return (<Redirect
                to={{ pathname: '/student', state: { class_id: this.state.redirect_student_list } }}
            />);
        } else if (!!this.state.redirect_schedule) {
            return (<Redirect
                to={{ pathname: '/schedule', state: { class_id: this.state.redirect_schedule } }}
            />);
        } else {
            const columns = [{
                title: '班级名称',
                dataIndex: 'class_name',
            }, {
                title: '所属专业',
                dataIndex: 'major_name',
            }, {
                title: '状态',
                dataIndex: 'closed',
            }, {
                title: '学生人数',
                dataIndex: 'total',
            }, {
                title: "",
                render: (text, record) => {
                    return (
                        <span>
                            <Button icon="calendar" type="primary"
                                onClick={() => this.setState({ redirect_schedule: record.class_id })}
                            >
                                课程表
                            </Button>
                            <span className="ant-divider" />
                            <Button icon="team"
                                onClick={() => this.setState({ redirect_student_list: record.class_id })}
                            >
                                学生管理
                            </Button>
                            <span className="ant-divider" />
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
                                            title: '删除课程',
                                            content: "您确定要删除吗？",
                                            onOk: () => {
                                                this.handler_remove(record.class_id)
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

            //定义分页
            const pagination ={
                total:this.state.list_total,
                defaultPageSize:this.state.pageSize,
                onShowSizeChange: (pageNum, pageSize) => {
                    this.setState({ pageNum, pageSize }, () => {
                        this.get_list();
                    });
                },
                onChange: (pageNum, pageSize) => {
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
                            <Form layout="inline" style={{ height: 39 }}>
                                <FormItem>
                                    <Button
                                        onClick={() => {
                                            this.setState({ show_add: true })
                                        }}>
                                        <Icon type="file-add" />
                                        添加班级
                                    </Button>
                                </FormItem>

                                <FormItem label="关键字">
                                    <Input placeholder="请输入班级名字"
                                        value={this.state.keyword}
                                        onChange={(e) => { this.setState({ keyword: e.target.value }) }}

                                    />
                                </FormItem>
                                <FormItem>
                                    <Button onClick={() => this.get_list()}>
                                        <Icon type="search" />
                                        查找
                                    </Button>
                                </FormItem>
                            </Form>

                        </div>
                    </Container>
                    <Container>
                        <Spin spinning={this.state.loading}>
                            <Table columns={columns} dataSource={this.state.list} rowKey={(r) => r.class_id} pagination={pagination}/>
                        </Spin>
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
                    </Container>
                </div>);


        }




    }

}