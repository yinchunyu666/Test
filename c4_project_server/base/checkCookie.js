const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const url = require("url");
module.exports = function (req, res, next) {
    //收集参数
    const { token } = req.cookies;
    // 收集pathname
    const pathname = req.baseUrl;
    async.waterfall([
        //如果是权限列表中没有的地址，就不验证权限
        (callback) => {
            const $sql_find_url = `select access_id from admin_access where url=?`;
            dq($sql_find_url, [pathname]).then((result) => {
                if (result.length) {
                    //表中有数据，继续判断
                    callback(null, false);
                } else {
                    // 表中无此数据，直接pass

                    callback(null, true)
                }
            }).catch(error => {
                callback(error)
            })
        },
        //收集用户信息
        (pass, callback) => {
            if (!pass) {
                const $sql_findUser = `select * from admin_user where token=?`;
                dq($sql_findUser, [token]).then((result) => {
                    if (result.length) {
                        callback(null, { pass: false, user_info: result[0] })
                    } else {
                        callback({ status: 401, message: '身份凭证无效,请重新登录' })
                    }
                }).catch((error) => {
                    callback(error)
                })
            } else {
                callback(null, { pass: true })
            }

        },
        //有用户信息时，分析权限
        ({ pass, user_info }, callback) => {
            if (!pass) {
                // 把用户信息放在req里，以便后续使用
                req.userInfo = user_info;
                // 如果对方是超级管理员，就不需要验证权限
                if (user_info.is_administrator) {
                    callback(null)
                } else {
                    //验证权限
                    const $sql_get_access = `
                    select * from admin_access
                    where instr(
                        (
                            select concat(",",access_list,",") as access_list from admin_role
                            where role_id in(select role_id from admin_user where user_id=?)
                        ),
                        concat(",",access_id,",")
                    )
                    and url=?`
                    dq($sql_get_access, [user_info.user_id, pathname]).then((result) => {
                        if (result.length) {
                            //有权限，过了
                            callback(null)
                        } else {
                            //没权限，扔个403
                            callback({ statusCode: 403, message: '你没有进行此操作的权限！' })

                        }
                    }).catch((error) => {
                        callback(error)
                    })
                }
            }else{
                callback(null)
            }
        }
    ], (error, result) => {
        if (error) {
            switch (error.status) {
                case 401:
                    ho(res).unauthorized(error).send();
                    break;
                case 403:
                    ho(res).forbidden(error).send();
                    break;
                default:
                    ho(res).internal_error(error).send();
            }
        } else {
            next()
        }
    })

}