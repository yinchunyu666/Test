//数据库链接
const connection_object = {
    host: 'localhost',
    port: 3306,
    database: 'c4_school_info',
    user: 'root',
    password: '123456789'
}
//数据库链接对像
const pool = require("mysql").createPool(connection_object)
//QUERY对像
module.exports = (queryString, params) => {
    return new Promise((resolve, reject) => {
        pool.query(queryString, params, (error, results, fields) => {
            if (error) {
                reject(error_translate(error))
            } else {
                resolve(results, fields);
            }
        });
    });
}

function error_translate(error) {
    error=Object.assign({},error)
    error.OriginaMessage = error.message;
    switch (error.errno) {
        case 'ECONNREFUSED':
            error.message = "无法连接数据库"
            break;
        case 1451:
            error.message = "不能删除或更新已被外键引用的数据";
            break;
        default:
            delete error.OriginaMessage;
    }
    return error;
}