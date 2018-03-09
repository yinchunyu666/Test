import immutable from 'immutable';

export default immutable.fromJS({
    user_info:null,//保存用户信息
    view:{
        viewLoading:false,//全局加载中
        isMount:true,//第一次加载页面
        collapsed:false//左侧折叠
    },
    isLogin:false,//是否已验证身份
    loginCallback:[]//login后自动回调队列

})