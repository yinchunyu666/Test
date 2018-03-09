
const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");

module.exports = router;

router.get("/list", (req, res) => {
    const $sql = `SELECT *
    FROM
    lesson
    ORDER BY lesson_id`;

    dq($sql).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});

router.post("/create",(req,res)=>{
    const $sql =`INSERT INTO lesson(lesson_name,length,level,remark)
    VALUES(?,?,?,?)`;
    const {lesson_name,length,level,remark}=req.body;

    dq($sql,[lesson_name,length,level,remark]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})

router.post("/remove",(req,res)=>{
    const $sql=`DELETE FROM lesson WHERE lesson_id = ?`;
    const {lesson_id} = req.body;

    dq($sql,[lesson_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {
    const { lesson_name,length,level,remark,lesson_id } = req.body;
    const $sql = `
        UPDATE lesson SET lesson_name=?,length=?,level=?,remark=? WHERE lesson_id=?
    `;
    dq($sql, [lesson_name,length,level,remark,lesson_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});