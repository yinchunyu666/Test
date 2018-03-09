const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
module.exports = router;

router.get('/list', (req, res) => {
    const $sql = `SELECT * FROM admin_role ORDER BY role_id`;

    dq($sql).then((result) => {
        ho(res).send(result)
    }).catch((error) => {
        ho(res).internal_error(error).send();
    })
})

router.post("/create", (req, res) => {
    const $sql = `INSERT INTO admin_role(role_name,remark)
    VALUES(?,?)`;
    const { role_name,remark } = req.body;

    dq($sql, [role_name,remark]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM admin_role WHERE role_id = ?`;
    const { role_id } = req.body;

    dq($sql, [role_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {

    const { role_name,access_list,remark,role_id } = req.body;
    const $sql = `
        UPDATE admin_role SET role_name=?,access_list=?,remark=? WHERE role_id=?`;
    dq($sql, [role_name,access_list,remark,role_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});
