import React from 'react';
import Container from '../../compontent/container';
import fd from '../../base/fetchData';
import { Table, Button, Icon, Form, Select, Input, Modal, Spin,message } from 'antd';

import ModalAdd from './create_student';
import ModalEdit from './edit_student';
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

            //表头查询,下拉菜单
            major_id: 'all',
            class_id: 'all',
            major_list: [],
            class_list: []
        }

        const { location } = props;
        if (location.state && location.state.class_id) {
            this.state.class_id = location.state.class_id.toString();
        }
    }


    componentDidMount() {
        this.get_major();
        this.get_class();
        this.get_list()
    }
    async get_list() {
        this.setState({ loading: true })
        let { keyword, pageNum, pageSize, major_id, class_id } = this.state;
        if (major_id == 'all') {
            major_id = ""
        }
        if (class_id == "all") {
            class_id = ""
        }
        try {
            let result = await fd.getJSON(fd.ports.option.student.list, { keyword, major_id, class_id, pageNum, pageSize });
            this.setState({ list: result.list, list_total: result.total })
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            this.setState({ loading: false })
        }
    }
    get_major() {
        fd.getJSON(fd.ports.option.major.list).then((result) => {
            this.setState({ major_list: result })
        }).catch((error) => {
            message.error(error.message)
        })
    }
    get_class() {
        fd.getJSON(fd.ports.option.class.all_list).then((result) => {
            this.setState({ class_list: result })
        }).catch((error) => {
            message.error(error.message)
        })
    }

    async  handler_remove(student_id) {
        try {
            await fd.postJSON(fd.ports.option.student.remove, { student_id });
            this.get_list();
        }
        catch (error) {
            message.error(error.message)
        }
    }
    render() {

        const columns = [{
            title: '学生姓名',
            dataIndex: 'student_name',
        },
        {
            title: '所属专业',
            dataIndex: 'major_name',
        },
        {
            title: '班级',
            dataIndex: 'class_name',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
        }, {
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
                                        title: '删除课程',
                                        content: "您确定要删除吗？",
                                        onOk: () => {
                                            this.handler_remove(record.student_id)
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
                                    添加学生
                                </Button>
                            </FormItem>
                            <FormItem label="专业">
                                <Select
                                    value={this.state.major_id}
                                    showSearch
                                    style={{ width: 200 }}
                                    onChange={(v) => {
                                        this.setState({ major_id: v, class_id: 'all', pageNum: 1 }, () => {
                                            this.get_list()
                                        })
                                    }}
                                    defaultValue="all"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key="all">全部</Option>
                                    {

                                        this.state.major_list.map((v, k) => {
                                            return (
                                                <Option key={v.major_id}>{v.major_name}</Option>
                                            )
                                        })}

                                </Select>
                            </FormItem>
                            <FormItem label="班级">
                                <Select
                                    value={this.state.class_id}
                                    showSearch
                                    style={{ width: 200 }}
                                    defaultValue="all"
                                    onChange={(v) => {
                                        let major_id;
                                        for (let item of this.state.class_list) {
                                            if (item.class_id == v) {
                                                major_id = item.major_id.toString()
                                            }
                                        }
                                        this.setState({ class_id: v, major_id: major_id || "all", pageNum: 1 }, () => {
                                            this.get_list()
                                        })
                                    }}

                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key="all">全部</Option>
                                    {this.state.class_list.map((v, k) => {
                                        return (
                                            <Option key={v.class_id}>{v.class_name}</Option>
                                        )
                                    })}
                                </Select>
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
                            rowKey={(r) => r.student_id}
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