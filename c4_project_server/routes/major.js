
const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");

module.exports = router;

router.get("/list", (req, res) => {
    const $sql = `SELECT *
    FROM
    major
    ORDER BY major_id`;

    dq($sql).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});

router.post("/create",(req,res)=>{
    const $sql =`INSERT INTO major(major_name,lesson_list,remark)
    VALUES(?,?,?)`;
    const {major_name,lesson_list,remark}=req.body;

    dq($sql,[major_name,lesson_list,remark]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})

router.post("/remove",(req,res)=>{
    const $sql=`DELETE FROM major WHERE major_id = ?`;
    const {major_id} = req.body;

    dq($sql,[major_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {
    const { major_name,lesson_list,remark,major_id } = req.body;
    const $sql = `
        UPDATE major SET major_name=?,lesson_list=?,remark=? WHERE major_id=?
    `;
    dq($sql, [major_name,lesson_list,remark,major_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});