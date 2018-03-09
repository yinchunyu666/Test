const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
module.exports = router;

router.get('/list', (req, res) => {
    const $sql = `SELECT * FROM admin_access ORDER BY access_id`;

    dq($sql).then((result) => {
        ho(res).send(result)
    }).catch((error) => {
        ho(res).internal_error(error).send();
    })
})

router.post("/create", (req, res) => {
    const $sql = `INSERT INTO admin_access(access_name, node_type, parent_id, url,remark)
    VALUES(?,?,?,?,?)`;
    const { access_name, node_type, parent_id, url, remark } = req.body;

    dq($sql, [access_name, node_type, parent_id, url, remark]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM admin_access WHERE access_id = ?`;
    const { access_id } = req.body;

    dq($sql, [access_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {

    const { access_name, node_type, parent_id, url, remark, access_id } = req.body;
    const $sql = `
        UPDATE admin_access SET access_name=?,node_type=?,parent_id=?,url=?,remark=? WHERE access_id=?`;
    dq($sql, [access_name, node_type, parent_id, url, remark, access_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});
