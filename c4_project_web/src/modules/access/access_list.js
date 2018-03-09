import React from 'react';
import Container from '../../compontent/container';
import fd from '../../base/fetchData';
import { Button, Icon, Select, Modal, Spin, Tree, Form,message } from 'antd';
import ModalAdd from './create_access';
import ModalEdit from './edit_access';
const FormItem = Form.Item;
export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            treeData: [],
            selectTreeKey: null,
            selectTreeData: null,

            show_add_folder: false,
            show_add_children: false,

            show_edit: false,


            loading: false

        }
    }
    componentDidMount() {
        this.get_tree()
    }
    format_tree(list) {
        const findChildren = (parent_id) => {
            let children = [];
            for (let item of list) {
                if (item.parent_id === parent_id) {
                    children.push(item)
                }
            }
            return children;
        }

        let tree = [];
        for (let f of list) {
            if (f.node_type === 0) {
                let folder = Object.assign({}, f);
                folder.children = findChildren(folder.access_id);
                tree.push(folder);
            }
        }
        return tree;
    }

    async get_tree() {
        this.setState({ loading: true })
        try {
            let list = await fd.getJSON(fd.ports.admin.access.list);
            if (list.length) {
                this.setState({ treeData: this.format_tree(list) })
            } else {
                this.setState({ treeData: [] })
            }
        } catch (error) {
            message.error(error.message)
        } finally {
            this.setState({ loading: false })
        }
    }
    renderTreeNodeBar(nodedata) {
        //定义分类dom
        const folder = () => (
            <div className="tree_title_bar">
                <span>
                    <Icon type="folder" />
                    {`${nodedata.access_name} [${nodedata.children.length}]`}
                </span>
                <span className="folder_url">
                    {`[菜单地址:${nodedata.url}]`}
                </span>
                <span className="ant-divider" />
                <Button 
                    icon="file-add" 
                    style={{ marginRight: 5 }} 
                    size="small" 
                    shape="circle" 
                    title="添加子节点" 
                    onClick={()=>this.handler_show_create_children()}
                />
                <Button 
                    icon="edit" 
                    style={{ marginRight: 5 }} 
                    size="small" 
                    shape="circle" 
                    title="编辑" 
                    onClick={()=>this.setState({show_edit:true})}
                />
                <Button
                    icon="delete"
                    size="small"
                    shape="circle"
                    title="删除"
                    onClick={
                        () => {
                            Modal.confirm({
                                title: '删除权限',
                                content: "您确定要删除吗？",
                                onOk: () => {
                                    this.handler_remove(nodedata.access_id)
                                }

                            })
                        }
                    }

                />

            </div>
        )
        //定义节点dom
        const leaf = () => (
            <div className="tree_title_bar">
                <span className="title">
                    {`${nodedata.access_name}`}
                </span>
                <span className="port_url">
                    {`[接口地址:${nodedata.url}]`}
                </span>
                <span className="ant-divider" />
                <Button 
                    icon="edit" 
                    style={{ marginRight: 5 }} 
                    size="small" 
                    shape="circle" 
                    title="编辑" 
                    onClick={()=>this.setState({show_edit:true})}
                />
                <Button
                    icon="delete"
                    size="small"
                    shape="circle"
                    title="删除"
                    onClick={
                        () => {
                            Modal.confirm({
                                title: '删除权限',
                                content: "您确定要删除吗？",
                                onOk: () => {
                                    this.handler_remove(nodedata.access_id)
                                }

                            })
                        }
                    }
                />
            </div>
        )

        return !!nodedata.node_type ? leaf() : folder();
    }
    renderTreeNode(nodedata) {
        return (
            <Tree.TreeNode
                title={this.renderTreeNodeBar(nodedata)}
                key={nodedata.access_id}
                node_data={nodedata}
            >
                {
                    !!nodedata.children && nodedata.children.map((v, k) => {
                        return this.renderTreeNode(v);
                    })
                }
            </Tree.TreeNode>
        )
    }
    async  handler_remove(access_id) {
        try {
            await fd.postJSON(fd.ports.admin.access.remove, { access_id });
            this.get_tree();
        }
        catch (error) {
            message.error(error.message)
        }
    }

    handler_tree_select(key, e) {
        var data = e.node.props.node_data;
        this.setState({
            selectTreeKey: key,
            selectTreeData: data
        })
    }
    //弹出添加分类
    handler_show_create_folder(){
        this.setState({
            selectTreeData:null,
            selectTreeKey:null,
            show_add_folder:true
        })
    }
    //弹出添加节点
    handler_show_create_children(){
        this.setState({
            show_add_children:true
        })
    }
    render() {
        const isFolder=(this.state.selectTreeData) && (this.state.selectTreeData.node_type===0)
        return (
            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Button.Group>
                            <Button 
                                icon="folder-add" 
                                type="primary"
                                onClick={()=>this.handler_show_create_folder()}
                            >
                                添加分类
                            </Button>
                            <Button 
                                icon="file-add"
                                disabled={!isFolder}
                                onClick={()=>this.handler_show_create_children()}
                            >
                                添加节点
                            </Button>
                        </Button.Group>
                        <span className="ant-divider" />
                        <span className="ant-divider" />
                        <Button.Group>
                            <Button 
                                icon="edit"
                                disabled={!this.state.selectTreeKey}
                                onClick={()=>{
                                    this.setState({show_edit:true})
                                }}
                            >
                                修改
                            </Button>
                            <Button 
                                icon="delete"
                                disabled={!this.state.selectTreeKey}
                                onClick={
                                    () => {
                                        Modal.confirm({
                                            title: '删除权限',
                                            content: "您确定要删除吗？",
                                            onOk: () => {
                                                this.handler_remove(this.state.selectTreeKey)
                                            }
            
                                        })
                                    }
                                }
                            >
                                删除
                            </Button>
                        </Button.Group>
                    </div>
                </Container>

                <Container>
                    <Spin spinning={this.state.loading} >
                        <div style={{ overflow: 'hidden' }}>
                            <Tree
                                showLine
                                autoExpandParent
                                onSelect={(key, e) => this.handler_tree_select(key, e)}
                            >
                                {
                                    this.state.treeData.map((v, k) => {
                                        return this.renderTreeNode(v);
                                    })
                                }
                            </Tree>
                        </div>
                    </Spin>
                    {this.state.show_add_folder &&
                        <ModalAdd
                            show={this.state.show_add_folder}
                            handler_close={() => this.setState({ show_add_folder: false })}
                            get_list={this.get_tree.bind(this)}
                        />
                    }
                    {this.state.show_add_children &&
                        <ModalAdd
                            show={this.state.show_add_children}
                            handler_close={() => this.setState({ show_add_children: false })}
                            get_list={this.get_tree.bind(this)}
                            parent_id={this.state.selectTreeData}
                        />
                    }
                    {this.state.show_edit &&
                            <ModalEdit
                                show={this.state.show_edit}
                                handler_close={() => this.setState({ show_edit: false })}
                                get_list={this.get_tree.bind(this)}
                                EditData={this.state.selectTreeData}
                            />
                        }
                </Container>
            </div>
        )
    }
}