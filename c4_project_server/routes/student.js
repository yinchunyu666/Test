
const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
module.exports = router;

router.get("/list", (req, res) => {

    let { major_id, class_id, keyword, pageSize, pageNum } = req.query;

    pageNum = Number(pageNum);
    pageSize = Number(pageSize);
    const limitNum = (pageNum - 1) * pageSize;

    let keyword_where = !!keyword ? "student.student_name LIKE ?" : "true", //关键字条件处理
        major_id_where = !!major_id ? "class.major_id = ?" : "true", //专业条件处理
        class_id_where = !!class_id ? "student.class_id = ?" : "true";  //班级条件处理

    //参数数组的处理
    let params_array = [];
    if (!!keyword) {
        keyword = `%${keyword}%`;
        params_array.push(keyword);
    }
    if (!!major_id) {
        params_array.push(Number(major_id));
    }
    if (!!class_id) {
        params_array.push(Number(class_id));
    }

    params_array.push(limitNum);
    params_array.push(pageSize)
    const $sql_query = `
    SELECT
        student.student_id,
        student.student_name,
        student.id_card_number,
        student.mobile,
        student.remark,
        student.class_id,
        student.token,
        class.class_name,
        major.major_name,
        class.major_id
    FROM
        student
    INNER JOIN class ON student.class_id = class.class_id
    INNER JOIN major ON class.major_id = major.major_id
    WHERE ${keyword_where} AND ${major_id_where} AND ${class_id_where}
    ORDER BY student_id DESC
    LIMIT ?,?
    `;

    const $sql_total = `
        SELECT count(*) AS total FROM
            student
        INNER JOIN class ON student.class_id = class.class_id
        INNER JOIN major ON class.major_id = major.major_id
        WHERE ${keyword_where} AND ${major_id_where} AND ${class_id_where}
    `;

    //并行控制
    async.parallel({
        // 查询列表
        list: (callback) => {
            dq($sql_query, params_array).then((result, fields) => {
                callback(null, result);
            }).catch((error) => {
                callback(error);
            });
        },
        // 查询总数
        total: (callback) => {
            dq($sql_total, params_array).then((result, fields) => {
                callback(null, result[0].total)
            }).catch((error) => {
                callback(error);
            });
        }
    }, (error, result) => {
        // 返回结果
        if (!error) {
            ho(res).send(result);
        } else {
            ho(res).internal_error(error).send();
        }
    });
});

router.post("/create", (req, res) => {
    const $sql = `INSERT INTO student(student_name,mobile,id_card_number,class_id,remark)
    VALUES(?,?,?,?,?)`;
    const { student_name, mobile, id_card_number, class_id, remark } = req.body;

    dq($sql, [student_name, mobile, id_card_number, class_id, remark]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM student WHERE student_id = ?`;
    const { student_id } = req.body;

    dq($sql, [student_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})

router.post("/update", (req, res) => {
    const { student_name, mobile, id_card_number, class_id, remark, student_id } = req.body;
    const $sql = `
        UPDATE student SET student_name=?,mobile=?,id_card_number=?,class_id=?,remark=? WHERE student_id=?
    `;
    dq($sql, [student_name, mobile, id_card_number, class_id, remark, student_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error(error).send();
    });
});