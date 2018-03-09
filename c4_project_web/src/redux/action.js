import ActionTypes from './actionTypes';
import immutable, { fromJS } from 'immutable';
import actionTypes from './actionTypes';

let action = {};

export default action;
//左边栏折叠
action[actionTypes.COLLASPED_IS_SIDER] = (state, date) => {
    return state.setIn(["view", "collapsed"], date);
}
//设置登录状态
action[actionTypes.SET_LOGIN_STATE] = (state, data) => {
    const { isLogin, callback } = data;
    if (isLogin) {
        //这是成功登录
        let callback = state.get('loginCallback').toJSON();
        if (callback.length) {
            for (let i = callback.length - 1; i >= 0; i--) {
                callback.pop()()
            }
        }
        return state.set("isLogin", true).set("loginCallback", fromJS(callback))
    } else {
        //这是退出登录
        return state.set("isLogin", false).update("loginCallback", (v) => {
            if (callback) {
                return v.push(callback)
            } else {
                return v;
            }
        })
    }
}
//把视图重新初始化
action[actionTypes.SET_VIEW_IS_MOUNT]=(state,data)=>{
    return state.setIn(['view',"isMount"],data)
}