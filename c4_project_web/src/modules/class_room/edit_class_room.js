import React from 'react';
import { Modal, Form, Button, Input,InputNumber,Spin,message } from 'antd'
import fd from '../../base/fetchData'
const FormItem=Form.Item;
class Create extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading:false,
            visible:props.show || false
        }
    }


    componentDidMount(){
        if(this.props.EditData){
            const { room_name, size, remark } = this.props.EditData;
            this.props.form.setFieldsValue({
                room_name, size, remark
            });
        }
    }
//关闭弹层有过度
    handler_hidden(){
        this.setState({visible:false})
    }
    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();//不执行默认动作。即不刷新
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                //验证通过，提交请求
                values.room_id = this.props.EditData.room_id;
                this.setState({loading:true})
                fd.postJSON(fd.ports.option.class_room.update, values).then(() => {
                    this.setState({loading:false})
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
                title="编辑教室"
                visible={this.state.visible}
                onCancel={this.handler_hidden.bind(this)}
                footer={null}
                afterClose={()=>this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="教室名称"
                    >
                        {getFieldDecorator('room_name', {
                            rules: [{
                                max: 10,
                                message: `最多只能输入10个字`
                            }, {
                                required: true,
                                message: '必需输入教室名称',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="容纳人数"
                    >
                        {getFieldDecorator('size', {
                            rules: [{
                                required: true,
                                message: '必需输入教室容量!',
                            }],
                            initialValue: 30
                        })(
                            <InputNumber max={500} min={2} />
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