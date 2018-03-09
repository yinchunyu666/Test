const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const md5 = require('md5');
const uuid = require('uuid');
const moment=require('moment');
module.exports = router;

router.post('/', (req, res) => {
    let { login_id, password, remember } = req.body;
    password = md5(password);
    let $sql_find = `
    SELECT
        *
    FROM
        admin_user
    WHERE 
        admin_user.login_id=? AND
        admin_user.password=? AND
        locked = 0
    `
    let $sql_set =
        `
    UPDATE admin_user SET token=?,last_login=? WHERE user_id=?
    `
    async.waterfall([
        (callback) => {
            dq($sql_find,[login_id,password]).then((result)=>{
                if(result.length){
                    const user_info = result[0];
                    callback(null, user_info)
                }else {
                    callback({ message: '用户名或密码错误' })
                }
            }).catch((error)=>{
                callback(error)
            })
        },
        (user_info, callback) => {
            const { login_id, user_name, icon, last_login, last_ip, is_administrator, email, user_id } = user_info;
            const token = uuid();
            const nowTime = moment(Date.now()).format('YYYYMMDDHHmmss')
            dq($sql_set, [token, nowTime, user_id]).then((result) => {
                callback(null, { login_id, user_name, icon, last_login, last_ip, is_administrator, email, user_id, token })
            }).catch((error) => {
                callback(error)
            })
        }
    ], (error, result) => {
        if (error) {
            ho(res).internal_error(error).send()
        } else {
            let expires = 0
            if (remember) {
                expires = new Date(Date.now() + (60 * 60 * 1000 * 24 * 30));
            }
            res.cookie('token', result.token, { expires, httpOnly: true })

            delete result.token;
            ho(res).send(result);

        }
    })

})


router.get('/', (req, res) => {
    const { token } = req.cookies;
    const $sql = `select * from admin_user where token = ?`;
    dq($sql, token).then((result) => {
        if (result && result.length) {
            const {login_id, user_name, icon, last_login, last_ip, is_administrator, email, user_id} = result[0]
            ho(res).send({login_id, user_name, icon, last_login, last_ip, is_administrator, email, user_id})
        }else{
            ho(res).unauthorized({message:'你还没有登录'}).send();
        }
    }).catch((error)=>{
        ho(res).internal_error(error).send()
    })
})