const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");
const md5 = require('md5');
const uuid = require('uuid');
module.exports = router;

router.post('/', (req, res) => {
    const { token } = req.cookies;
    const $sql = `update admin_user set token = '' where token =?`;
    dq($sql, [token]).then((result) => {
        res.cookie('token', '0', { httpOnly: true });
        ho(res).send({message:'用户身份已失效'})
    }).catch((err)=>{
        ho(res).internal_error(err).send();
    })
})
router.post('/editPassword',async (req,res)=>{
    const {token} = req.cookies;
    let {password}=req.body;
    const $sql_ps=`update admin_user set \`password\`=? where token=?`;
    try{
        let list=await dq($sql_ps,[md5(password),token]);
        const $sql_token=`update admin_user set token=? where password=?`;
        const token1=uuid();
        dq($sql_token,[token1,md5(password)]).then(()=>{
            ho(res).send({});
        }).catch((err)=>{
            ho(res).internal_error(err).send({});
        })
    }catch(e){
        ho(res).internal_error(e).send();
    }
})