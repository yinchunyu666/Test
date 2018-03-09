/**
 * ajax
 */

import "whatwg-fetch";
//引入接口列表
import ports from '../options/ports';
import actionTypes from '../redux/actionTypes';
import store from '../redux/store';
const { dispatch } = store;
// 把对像格式参数添加到url末尾
function UrlQuery(url, params) {
    let paramsArray = [];
    //拼接参数  
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
    } else {
        url += '&' + paramsArray.join('&')
    }
    return url;
}
//调用redux
function set_nologin(callback) {
    dispatch(actionTypes.create(
        actionTypes.SET_LOGIN_STATE, { isLogin: false, callback }
    ))
}

async function check_response(response, {resolve,reject,callback}) {
    if (response.status == 200) {
        if (response.headers.get("Content-Type").indexOf("application/json") >= 0) {
            resolve(response);
        } else {
            reject({ message: "返回结果的Content-Type的类型不对" })
        }
    } else {
        switch (response.status) {
            //未登录
            case 401:
                set_nologin(callback)
                break;
            //404
            case 404:
                reject ({ message: '找不到指定的服务！' })
            //权限不够
            case 403:
                reject ({ message: '您的权限不够！' })
            default:
                if (response.headers.get("Content-Type").indexOf("application/json") >= 0) {
                    let error = await response.json();
                    reject (error)
                } else {
                    let text = await response.text();
                    if (text) {
                        reject ({ message: text })
                    } else {
                        reject ({ message: '服务器发生未知错误' })
                    }
                }

        }
    }
}


var FetchData = {
    ports,
    get(url, params={}) {
        //fetch有一问题，除了链接不成功reject外，其他（如404,500等）都运行resolve
        return new Promise((resolve, reject) => {
            fetch(UrlQuery(url, params), {
                credentials: "include"//每次都携带cookie
            }).then((response) => {
                check_response(response, {
                    resolve,
                    reject,
                    callback: () => this.get(url, params).then(resolve).catch(reject)
                })
            }).catch((err) => {
                reject(err);
            })
        })
    },
    getJSON(url, params = {}) {
        //fetch有一问题，除了链接不成功reject外，其他（如404,500等）都运行resolve
        return new Promise((resolve, reject) => {
            this.get(url, params).then((response) => {
                return response.json();
            }).then((json) => {
                resolve(json);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    post(url,params={}){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                credentials: "include",//每次都携带cookie
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            }).then((response) => {
                check_response(response, {
                    resolve,
                    reject,
                    callback: () => this.post(url, params).then(resolve).catch(reject)
                })
            }).catch((err) => {
                reject(err);
            })
        })
    
    },
    postJSON(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.post(url, params).then((response) => {
                return response.json();
            }).then((json) => {
                resolve(json);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}



export default FetchData;