import React from 'react';
import { Modal, Form, Button, Input, InputNumber, Spin, Select,message } from 'antd'
import fd from '../../base/fetchData'
const FormItem = Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false,
            list: []
        }
    }
    componentDidMount() {
        this.get_lesson_list();
    }
    async get_lesson_list() {
        try {
            let list = await fd.getJSON(fd.ports.option.lesson.list);
            this.setState({ list: list });
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
                //验证通过，提交请求
                this.setState({ loading: true })
                fd.postJSON(fd.ports.option.major.create, values).then(() => {
                    this.setState({ loading: false })
                    this.handler_hidden();
                    this.props.get_list();
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
                title="添加专业"
                visible={this.state.visible}
                onCancel={() => { this.handler_hidden() }}
                footer={null}
                afterClose={() => this.props.handler_close()}//弹层完全关闭后调用handlerclose，使showadd变为false
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="专业名称"
                    >
                        {getFieldDecorator('major_name', {
                            rules: [{
                                max: 30,
                                message: `最多只能输入30个字`
                            }, {
                                required: true,
                                message: '必需输入专业名称',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="课程等级"
                    >
                        {getFieldDecorator('lesson_list', {
                            rules: [{
                                required: true,
                                message: '必需输入课程等级!',
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                                // placeholder="请输入课程等级"

                            >
                                {this.state.list.map((v, k) => {
                                    return (
                                        <Select.Option key={v.lesson_id}>{v.lesson_name}</Select.Option>
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

                        <Button onClick={() => { this.handler_hidden() }} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Create);