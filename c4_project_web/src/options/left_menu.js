/**左导航菜单配置 */
export default [
    {
        title: '首页',
        type: 'Item',
        icon: 'home',
        url: '/'
    },
    {
        title: '课程表',
        type: 'Item',
        icon: 'calendar',
        url: '/schedule'
    }, {
        title: '学员管理',
        type: 'Item',
        icon: 'user',
        url: '/student'
    }, {
        title: '班级管理',
        type: 'Item',
        icon: 'team',
        url: '/class'
    }, {
        title: '教学设置',
        type: 'SubMenu',
        icon: 'setting',
        children: [{
            title: '专业设置',
            type: 'Item',
            icon: 'schedule',
            url: '/major'
        }, {
            title: '课程设置',
            type: 'Item',
            icon: 'exception',
            url: '/lesson'
        }, {
            title: '教室管理',
            type: 'Item',
            icon: 'home',
            url: '/room'
        }]
    }, {
        title: '后台设置',
        type: 'SubMenu',
        icon: 'setting',
        children: [
            {
                title: '后台用户',
                type: 'MenuItemGroup',
                icon: 'usergroup-add',
                children: [{
                    title: '用户管理',
                    type: 'Item',
                    icon: 'user',
                    url: '/system/users'
                }]
            },
            {
                title: '权限与角色',
                type: 'MenuItemGroup',
                icon: 'lock',
                children: [
                    {
                        title: '角色管理',
                        type: 'Item',
                        icon: 'woman',
                        url: '/system/roles'
                    },
                    {
                        title: '权限树设置',
                        type: 'Item',
                        icon: 'key',
                        url: '/system/access'
                    }
                ]
            }
        ]
    }
]