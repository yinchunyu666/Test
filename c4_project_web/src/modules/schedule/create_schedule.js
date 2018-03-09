import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Table, Select, TimePicker,message } from 'antd'
import fd from '../../base/fetchData'
import moment from 'moment';
import {is} from 'immutable'
const FormItem = Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false,
            room_list: [],
            class_list: [],
            lesson_list:  [],
            date:null || props.edit_data
            
        }
    }
    componentDidMount() {
        this.get_class_list();
        this.get_room_list();
        this.get_lesson_list();
    }
    componentWillReceiveProps(nextProps){
        if (!is(nextProps.edit_data, this.props.edit_data) || !is(nextProps.lesson_list, this.props.lesson_list)) {
            //计算当日课程
            let today_lesson = nextProps.lesson_list.filter((v, k) => {
                if (moment(nextProps.edit_data).format("YYYY/MM/DD") === moment(v.begin_time).format("YYYY/MM/DD")) {
                    return true;
                } else {
                    return false;
                }
            });
            this.setState({ date: nextProps.edit_data, lesson_list: today_lesson });
        }
    }
    get_lesson_list(){
        let today_lesson=this.props.lesson_list.filter((v,k)=>{
            if (moment(this.props.edit_data).format("YYYY/MM/DD") === moment(v.begin_time).format("YYYY/MM/DD")) {
                return true;
            } else {
                return false;
            }
        })
        this.setState({
            lesson_list:today_lesson
        })
    }


    async get_room_list() {
        try {
            let list = await fd.getJSON(fd.ports.option.class_room.list);
            this.setState({ room_list: list });
        } catch (error) {
            message.error(error.message)
        } finally {
        }
    }
    async get_class_list() {
        try {
            let list = await fd.getJSON(fd.ports.option.class.all_list);
            this.setState({ class_list: list });
        } catch (error) {
            message.error(error.message)
        } finally {
        }
    }
    //关闭弹层有过度
    handler_hidden() {
        this.setState({ visible: false })
    }
    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();//不执行默认动作。即不刷新
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {

                let begin_time = moment(`${this.state.date.format("L")} ${values.begin_time.format("HH:mm")}:00`),
                end_time = moment(`${this.state.date.format("L")} ${values.end_time.format("HH:mm")}:00`);
            Object.assign(values, { begin_time, end_time ,class_id:this.props.class_id});
                //验证通过，提交请求
                this.setState({ loading: true })
                fd.postJSON(fd.ports.option.schedule.create, values).then(() => {
                    this.setState({ loading: false })
                    this.props.get_list();
                }).catch((error) => {
                    message.error(error.message)
                    this.setState({ loading: false })
                });
                this.setState({ loading: false })
            }
        });
    }
    async handler_remove(schedule_id){
        try {
            await fd.postJSON(fd.ports.option.schedule.remove, { schedule_id });
            this.props.get_list();

        }
        catch (error) {
            message.error(error.message)
        }
    }
    render() {
        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单内输入项大小比例 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const columns = [{
            title: `开始时间`,
            dataIndex: `begin_time`,
            render: (text) => `${moment(text).format("HH:mm")} 开始`
        }, {
            title: `结束时间`,
            dataIndex: `end_time`,
            render: (text) => `${moment(text).format("HH:mm")} 结束`
        }, {
            title: `教室`,
            dataIndex: `room_name`,
            render: (text) => `教室：${text}`
        }, {
            title: ``,
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button icon="delete" size="small"
                        onClick={
                            () => {
                                Modal.confirm({
                                    title: '删除课程',
                                    content: "您确定要删除吗？",
                                    onOk: () => {
                                        this.handler_remove(record.schedule_id)
                                    }

                                })
                            }}
                    >
                        删除
                    </Button>
                </span>
            )
        }];
        return (
            <Modal
                title="添加课程"
                visible={this.state.visible}
                onCancel={() => { this.handler_hidden() }}
                footer={null}
                afterClose={() => this.props.handler_close()}//弹层完全关闭后调用handlerclose，使showadd变为false
            >
                <Table
                    columns={columns}
                    dataSource={this.state.lesson_list}
                    bordered={false}
                    size="small"
                    showHeader={false}
                    key={"lesson_"}
                    pagination={false}
                    rowKey={(r)=>r.schedule_id}
                />
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="开始时间"
                    >
                        {getFieldDecorator('begin_time', {
                            rules: [{
                                required: true,
                                message: '必需输入班级名称',
                            }],
                        })(
                            <TimePicker format={'HH:mm'} minuteStep={5} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="结束时间"
                    >
                        {getFieldDecorator('end_time', {
                            rules: [{
                                required: true,
                                message: '必需输入手机号!',
                            }],
                        })(
                            <TimePicker format={'HH:mm'} minuteStep={5} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="选择教室"
                    >
                        {getFieldDecorator('room_id', {
                            rules: [{
                                required: true,
                                message: '必需选择教室!',
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                            >
                                {this.state.room_list.map((v, k) => {
                                    return (
                                        <Select.Option key={v.room_id}>{v.room_name}</Select.Option>
                                    )

                                })}
                            </Select>

                            )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>提交</Button>

                        <Button onClick={() => { this.handler_hidden() }} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Create);