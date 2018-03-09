
const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async=require('async')

module.exports = router;

router.get("/list", (req, res) => {
    try {
        let { keyword, pageNum, pageSize } = req.query;
        keyword = !!keyword ? `%${keyword}%` : `%`;
        pageNum = Number(pageNum);
        pageSize = Number(pageSize);

        const limitNum = (pageNum - 1) * pageSize;
        const $sql_query =
            `SELECT
            class.class_id,
            class.class_name,
            class.major_id,
            class.remark,
            class.class_teacher_id,
            class.closed,
        (SELECT COUNT(*) FROM student WHERE student.class_id=class.class_id) AS total,
        major.major_name,
        major.lesson_list
       FROM
        class
       INNER JOIN major ON class.major_id = major.major_id
        WHERE class_name LIKE ?
        LIMIT ?,?
        `;
        const $sql_total=`SELECT count(*) AS total from class WHERE class_name LIKE ?`

        async.parallel({
            list:(callback)=>{
                dq($sql_query,[keyword, limitNum, pageSize]).then((result,fields)=>{
                    callback(null,result)
                }).catch((err)=>{
                    callback(err);
                })
            },
            total:(callback)=>{
                dq($sql_total,[keyword]).then((result,fields)=>{
                    callback(null,result[0].total)
                }).catch((err)=>{
                    callback(err);
                })
            }
        },(error,result)=>{
            if(!error){
                ho(res).send(result);
            }else{
                ho(res).internal_error().send(error);
            }
        })

    } 
    catch (err) {
        ho(res).internal_error().send(err);
    }

});

router.post("/create", (req, res) => {
    const $sql = `INSERT INTO class(class_name, major_id, remark, closed)
    VALUES(?,?,?,?)`;
    const { class_name, major_id, remark, closed } = req.body;

    dq($sql, [class_name, major_id, remark, closed]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM class WHERE class_id = ?`;
    const { class_id } = req.body;

    dq($sql, [class_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {

    const { class_name, major_id, remark, closed, class_id } = req.body;
    const $sql = `
        UPDATE class SET class_name=?,major_id=?,remark=?,closed=? WHERE class_id=?
    `;
    dq($sql, [class_name, major_id, remark, closed, class_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});

router.get("/all_list", (req, res) => {
    const $sql = `SELECT class_name,class_id,major_id FROM class ORDER BY class_id DESC`;
    dq($sql).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});