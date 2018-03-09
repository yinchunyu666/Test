import React from 'react';
import { Modal, Form, Button, Input, Tree, Spin, Icon ,message} from 'antd'
import fd from '../../base/fetchData'
const FormItem = Form.Item;
class setAccess extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            visible: props.show || false,
            select_key: props.EditData.access_list ? props.EditData.access_list.split(',') : [],
            treeData: []
        }
    }
    componentDidMount() {
        this.get_tree()
    }

    //关闭弹层有过度
    handler_hidden() {
        this.setState({ visible: false })
    }
    //提交动作
    async handler_submit() {
        this.setState({ loading: true })
        try {
            const postData = Object.assign({}, this.props.EditData);
            postData.access_list = this.state.select_key.join(",");
            await fd.postJSON(fd.ports.admin.role.update, postData);
            this.handler_hidden();
            this.props.get_list()
        }
        catch (error) {
            message.error(error.message)
        }
        finally {
            this.setState({ loading: false })
        }

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
            </div>
        )
        //定义节点dom
        const leaf = () => (
            <div className="tree_title_bar">
                <span className="title">
                    {`${nodedata.access_name}`}
                </span>
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
    handler_checkd(keys) {
        this.setState({ select_key: keys })
    }
    render() {
        return (
            <Modal
                title="编辑角色"
                visible={this.state.visible}
                onCancel={this.handler_hidden.bind(this)}
                afterClose={() => this.props.handler_close()}
                onOk={() => this.handler_submit()}
                confirmLoading={this.state.loading}
            >
                    <div style={{ overflow: 'hidden' }}>

                        {
                            this.state.treeData.length &&
                            <Tree
                                checkable
                                onCheck={this.handler_checkd.bind(this)}
                                showLine
                                autoExpandParent
                                checkedKeys={this.state.select_key}
                            // defaultCheckedKeys={this.state.select_key}
                            >
                                {
                                    this.state.treeData.map((v, k) => {
                                        return this.renderTreeNode(v);
                                    })
                                }
                            </Tree>
                        }
                    </div>
            </Modal>
        )
    }
}

export default setAccess;