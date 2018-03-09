const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const md5 = require('md5')
module.exports = router;

router.get('/list', async (req, res) => {
    let { keyword, pageNum, pageSize } = req.query;
    keyword = keyword ? `%${keyword}%` : '%';
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);

    limitNum = (pageNum - 1) * pageSize;
    const $sql_query =
        `SELECT
        admin_user.user_id,
        admin_user.login_id,
        admin_user.\`password\`,
        admin_user.user_name,
        admin_user.last_login,
        admin_user.remark,
        admin_user.created_time,
        admin_user.is_administrator,
        admin_user.token,
        admin_user.role_id,
        admin_user.access_list,
        admin_role.role_name,
        admin_role.access_list
    FROM
        admin_user
    INNER JOIN 
        admin_role ON admin_user.role_id = admin_role.role_id
    WHERE   
        user_name LIKE ?
    ORDER BY 
        user_id
    LIMIT ?,?
    `;
    const $sql_total = `SELECT COUNT(*) FROM admin_user WHERE user_name LIKE ?`

    try {
        var list = await dq($sql_query, [keyword, limitNum, pageSize]);
        var total = await dq($sql_total, [keyword]);
        ho(res).send({ list, total })
    }
    catch (e) {
        ho(res).internal_error(e).send();
    }
})

router.post("/create", async (req, res) => {
    let { login_id, password, user_name, remark, role_id } = req.body;
    password = md5(password)

    const $sql_find = `SELECT login_id FROM admin_user WHERE login_id=?`
    const $sql = `INSERT INTO admin_user(login_id,password,user_name,remark,role_id)
    VALUES(?,?,?,?,?)`;

    try {
        var find_list = await dq($sql_find, [login_id]);
        if (find_list && find_list.length > 0) {
            ho(res).praram_error().send({ message: '这个登录ID已被注册！' })
        } else {
            dq($sql, [login_id, password, user_name, remark, role_id]).then((result, fields) => {
                ho(res).send(result);
            }).catch((error) => {
                ho(res).internal_error().send(error);
            })
        }
    } catch (e) {
        ho(res).internal_error(e).send()
    }

})

router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM admin_user WHERE user_id = ?`;
    const { user_id } = req.body;

    dq($sql, [user_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})


router.post("/update", async (req, res) => {
    let { login_id, password, user_name, remark, role_id, user_id } = req.body;

    let update_password_str=password?`,password=?`:'';

    const $sql_find = `SELECT user_id FROM admin_user WHERE login_id=?`
    const $sql = `UPDATE 
    admin_user SET login_id=?,  user_name=?, remark=?, role_id=? ${update_password_str} WHERE user_id=?`;

    let param_arr=[login_id, user_name, remark, role_id];
    if(password){
        param_arr.push(md5(password))
    }
    param_arr.push(user_id)
    try {
        var find_list = await dq($sql_find, [login_id]);
        if (find_list && find_list.length && find_list[0].user_id!=user_id) {
            ho(res).praram_error().send({ message: '这个登录ID已被注册！' })
        } else {
            dq($sql, param_arr).then((result, fields) => {
                ho(res).send(result);
            }).catch((error) => {
                ho(res).internal_error().send(error);
            })
        }
    } catch (e) {
        ho(res).internal_error(e).send()
    }

})