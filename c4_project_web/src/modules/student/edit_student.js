import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Spin,Select,message } from 'antd'
import fd from '../../base/fetchData'
const FormItem = Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false,
            list:[]
        }
    }


    async get_student_list() {
        try {
            let list = await fd.getJSON(fd.ports.option.class.all_list);
            this.setState({ list: list });
        } catch (error) {
            message.error(error.message)
        } 
    }

    componentDidMount() {
        if (this.props.EditData) {
            const { student_name,mobile,id_card_number,class_id,remark } = this.props.EditData;

            this.props.form.setFieldsValue({
                student_name,mobile,id_card_number,class_id:class_id.toString(),remark
            });
        }
        this.get_student_list();
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
                //验证通过，提交请求
                values.student_id = this.props.EditData.student_id;
                this.setState({ loading: true })
                fd.postJSON(fd.ports.option.student.update, values).then(() => {
                    this.setState({ loading: false })
                    this.handler_hidden();
                    this.props.get_list()
                }).catch((error) => {
                    message.error(error.message)
                });
                this.setState({ loading: false })
            }
        });
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
        return (
            <Modal
                title="编辑学生"
                visible={this.state.visible}
                onCancel={this.handler_hidden.bind(this)}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                <FormItem
                        {...formItemLayout}
                        label="学生名称"
                    >
                        {getFieldDecorator('student_name', {
                            rules: [{
                                max: 30,
                                message: `最多只能输入30个字`
                            }, {
                                required: true,
                                message: '必需输入班级名称',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号"
                    >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                len: 11,
                                message: '手机号码为11位!'
                            }, {
                                required: true,
                                message: '必需输入手机号!',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="身份证号码"
                    >
                        {getFieldDecorator('id_card_number', {
                            rules: [{
                                len: 18,
                                message: '身份证号码为18位!'
                            },{
                                required: true,
                                message: '必需输入身份证号码!',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    
                    <FormItem
                        {...formItemLayout}
                        label="选择班级"
                    >
                        {getFieldDecorator('class_id', {
                            rules: [{
                                required: true,
                                message: '必需选择班级!',
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                // placeholder="请输入课程等级"

                            >
                                {this.state.list.map((v, k) => {
                                    return (
                                        <Select.Option key={v.class_id}>{v.class_name}</Select.Option>
                                    )

                                })}
                            </Select>
                            
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注信息"
                    >
                        {getFieldDecorator('remark', {
                            rules: [{
                                max: 200,
                                message: `最多只能输入200个字`
                            }],
                        })(
                            <Input.TextArea />
                            )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>提交</Button>

                        <Button onClick={this.handler_hidden.bind(this)} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Create);