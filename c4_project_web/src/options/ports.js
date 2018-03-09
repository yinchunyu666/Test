/**定义所有接口地址 */

export default {
    option: {
        class_room: {
            list: `/admin/room/list`,
            create: `/admin/room/create`,
            remove: `/admin/room/remove`,
            update: `/admin/room/update`
        },
        lesson: {
            list: `/admin/lesson/list`,
            create: `/admin/lesson/create`,
            remove: `/admin/lesson/remove`,
            update: `/admin/lesson/update`
        },
        major: {
            list: `/admin/major/list`,
            create: `/admin/major/create`,
            remove: `/admin/major/remove`,
            update: `/admin/major/update`
        },
        class: {
            list: `/admin/class/list`,
            create: `/admin/class/create`,
            remove: `/admin/class/remove`,
            update: `/admin/class/update`,
            all_list:`/admin/class/all_list`
        },
        student:{
            list: `/admin/student/list`,
            create: `/admin/student/create`,
            remove: `/admin/student/remove`,
            update: `/admin/student/update`
        },
        schedule:{
            list: `/admin/schedule/list`,
            create: `/admin/schedule/create`,
            remove: `/admin/schedule/remove`
        }
    },
    admin:{
        access:{
            list: `/admin/access/list`,
            create: `/admin/access/create`,
            remove: `/admin/access/remove`,
            update: `/admin/access/update`
        },
        role:{
            list: `/admin/role/list`,
            create: `/admin/role/create`,
            remove: `/admin/role/remove`,
            update: `/admin/role/update`
        },
        user:{
            list: `/admin/user/list`,
            create: `/admin/user/create`,
            remove: `/admin/user/remove`,
            update: `/admin/user/update`
        }
    },
    login: `/login`,
    logout:`/logout`,
    editPassword:`/logout/editPassword`
}