import actionTypes from './actionTypes';
import action from './action';
import initalState from './state';

export default (state = initalState, { type, data })=> {
    if(action[type]){
        //找到action
        return action[type](state,data);
    }else{
        //未找到action
        console.log("redux---未找到合适的action",type,data)
        return state;
    }
}