import React from 'react';
import Container from '../../compontent/container';
import fd from '../../base/fetchData';
import {  Button, Icon, Form, Select, Modal, Spin, Calendar,message } from 'antd';
import moment from 'moment';
import ModalAdd from './create_schedule';
const Option = Select.Option;
const FormItem = Form.Item;


export default class extends React.Component {


    constructor(props) {
        super();
        this.state = {
            list: [],
            loading: false,
            //添加弹层
            show_add: false,

            //编辑弹层时自带原本数据
            edit_data: null,

            //表头查询,下拉菜单
            class_id: '',
            class_list: [],

            month: moment(new Date(Date.now())).format('YYYY/MM/DD'),

            result:null
        }
        const { location } = props;
        if (location.state && location.state.class_id) {
            this.state.class_id = location.state.class_id.toString();
        }

    }


    componentDidMount() {
        this.get_class();
        if (!!this.state.class_id) {
            this.get_list();
        }
    }
    get_class() {
        fd.getJSON(fd.ports.option.class.all_list).then((result) => {
            this.setState({ class_list: result }, () => {
                if (!this.state.class_id && this.state.class_list.length) {
                    this.setState({ class_id: this.state.class_list[0].class_id.toString() }, () => {
                        this.get_list()
                    })
                }
            })
        }).catch((error) => {
            message.error(error.message)
        })
    }
    async get_list() {
        this.setState({ loading: true })
        let { class_id, month } = this.state;
        try {
            let result = await fd.getJSON(fd.ports.option.schedule.list, { class_id: Number(class_id), month });
            this.setState({ list: result })
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            this.setState({ loading: false })
        }
    }

    //不可选择在日历上下一个月
    view_disabled(date) {
        if (moment(this.state.month).format('YYYY/MM') === moment(date).format('YYYY/MM')) {
            return false;
        } else {
            return true;
        }
    }
    //渲染单元格里的内容
    dateCellRender(value) {
        //定义当前时间
        let today = value.format('L');
        let lesson = this.state.list.filter((v, k) => {
            if (today === moment(v.begin_time).format('L')) {
                return true
            } else {
                return false
            }
        });

        return (
            <ul className="lesson_of_day">
                {
                    lesson.map((v, k) => {
                        let beginTime = moment(v.begin_time).format('HH:mm');
                        let endTime = moment(v.end_time).format("HH:mm")
                        return (
                            <li key={k}>
                                <span className="room">{`${v.room_name}`}</span>
                                <br />
                                <span className="time">{`${beginTime}-${endTime}`}</span>
                            </li>
                        )
                    })
                }

            </ul>
        )
    }

    //点击选择日期回调
    handler_onSelect(value) {
        this.setState({edit_data:value})
    }
    //日期面板变化回调
    handler_onPanelChange(data, mode) {
        this.setState({ edit_data: data })
    }
    render() {


        return (

            <div 
                onDoubleClick={()=>this.setState({show_add:true})}
            >
                <Container>
                    <div style={{ padding: 12 }}>
                        <Form layout="inline" style={{ height: 39 }}

                        >


                            <FormItem label="班级">
                                <Select
                                    value={this.state.class_id}
                                    showSearch
                                    style={{ width: 200 }}
                                    onChange={(v) => {
                                        this.setState({ class_id: v }, () => {
                                            this.get_list()
                                        })
                                    }}

                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.state.class_list.map((v, k) => {
                                        return (
                                            <Option key={v.class_id}>{v.class_name}</Option>
                                        )
                                    })}
                                </Select>
                            </FormItem>
                            <FormItem>
                                <Button 
                                onClick={() => {
                                    this.setState({ show_add: true })
                                }}
                                disabled={!this.state.edit_data}
                                >
                                    <Icon type="file-add" />
                                    添加课程
                                </Button>
                            </FormItem>

                        </Form>

                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <Calendar
                            fullscreen={true}
                            disabledDate={(date) => this.view_disabled(date)}
                            dateCellRender={(v) => this.dateCellRender(v)}
                            onPanelChange={(data, mode) => this.handler_onPanelChange(data, mode)}
                            onSelect={(data) => this.handler_onSelect(data)}
                        />
                    </Spin>
                </Container>
                {this.state.show_add &&
                    <ModalAdd
                        show={this.state.show_add}
                        handler_close={() => this.setState({ show_add: false })}
                        get_list={this.get_list.bind(this)}
                        lesson_list={this.state.list}
                        edit_data={this.state.edit_data}
                        class_id={this.state.class_id}
                    />
                }
            </div>);
    }

}