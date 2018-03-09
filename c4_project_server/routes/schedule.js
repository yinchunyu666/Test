const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const moment = require('moment')
module.exports = router;


router.get('/list', (req, res) => {
    const { class_id, month } = req.query;
    let time_begin = moment(month).format('YYYY/MM') + "/1";
    let time_end = moment(month).add(1, "month").format("YYYY/MM") + '/1';

    let $sql_query = `
    SELECT
        lesson_schedule.schedule_id,
        lesson_schedule.begin_time,
        lesson_schedule.end_time,
        lesson_schedule.room_id,
        lesson_schedule.class_id,
        lesson_schedule.lesson_id,
        class_room.room_name,
        class.class_name
    FROM
        class_room
    INNER JOIN 
        lesson_schedule ON lesson_schedule.room_id = class_room.room_id
    INNER JOIN 
        class ON lesson_schedule.class_id = class.class_id
    WHERE 
        lesson_schedule.class_id=?
    AND 
        lesson_schedule.begin_time>=?
    AND 
        lesson_schedule.begin_time<=?
    ORDER BY lesson_schedule.begin_time ASC
    `;

    dq($sql_query, [class_id, time_begin, time_end]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
})


router.post("/remove", (req, res) => {
    const $sql = `DELETE FROM lesson_schedule WHERE schedule_id = ?`;
    const { schedule_id } = req.body;

    dq($sql, [schedule_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
})


router.post("/create", (req, res) => {

    let { begin_time, end_time, room_id, class_id } = req.body;

    begin_time = moment(begin_time).format("YYYY-MM-DD HH:mm:ss");
    end_time = moment(end_time).format("YYYY-MM-DD HH:mm:ss");
    room_id = Number(room_id);
    class_id = Number(class_id)
    async.parallel([
        //检查时间开始时间是否大于现在，结束时间不能早于开始时间
        (callback) => {
            let nowTime = moment(new Date(Date.now())),
                b_time = moment(begin_time),
                e_time = moment(end_time);
            if (b_time <= nowTime) {
                callback({ message: '不能选择之前的时间！' })
            } if (e_time <= b_time) {
                callback({ message: '结束时间不能早于开始时间！' })
            } else {
                callback(null)
            }

        },
        //检查该时间段该班是不是已经有课了 SQL
        (callback) => {
            let $sql =
                `
            SELECT 
                schedule_id 
            FROM 
                lesson_schedule 
            WHERE (
                (begin_time>=? AND begin_time <=?) 
            OR 
                (end_time>=? AND end_time <=?)
            )
            AND 
                class_id=?
            `;
            dq($sql, [begin_time, end_time, begin_time, end_time, class_id]).then((result, fields) => {
                if (result.length) {
                    callback({ message: '这个时间段已经有课了' });
                } else {
                    callback(null)
                }
            }).catch((error) => {
                callback(error)
            })
        },
        //检查该时间段教室是否占用 SQL  
        (callback) => {
            let $sql =
                `SELECT 
                schedule_id 
            FROM 
                lesson_schedule 
            WHERE (
                (begin_time>=? AND begin_time <=?) 
            OR 
                (end_time>=? AND end_time <=?))
            AND 
                room_id=?
            `;
            dq($sql, [begin_time, end_time, begin_time, end_time, room_id]).then((result, fields) => {
                if (result.length) {
                    callback({ message: '这个时间段教室里有其他班级' });
                } else {
                    callback(null)
                }
            }).catch((error) => {
                callback(error)
            })
        },
        //检查教室能不能装下个班
        (callback) => {
            let $sql =
                `SELECT 
                    size,
                (SELECT COUNT(*) FROM student WHERE class_id=?) AS total
                FROM 
                    class_room
                WHERE 
                    room_id=?
            `
            dq($sql, [class_id, room_id]).then((result, fields) => {
                if (result.length) {
                    if (result[0].total > result[0].size) {
                        callback({ message: '该教室装不下该班级的学生' })
                    } else {
                        callback(null)
                    }
                } else {
                    callback(null)
                }
            }).catch((error) => {
                callback(error)
            })
        }
    ], (error, result) => {
        let $sql = `INSERT INTO lesson_schedule(begin_time,end_time,room_id,class_id)
        VALUES(?,?,?,?)`;
        if (!error) {
            dq($sql, [begin_time, end_time, room_id,class_id]).then((result, fields) => {
                ho(res).send(result);
            }).catch((error) => {
                ho(res).internal_error().send(error);
            })
        } else {
            ho(res).internal_error().send(error);
        }
    })

})


