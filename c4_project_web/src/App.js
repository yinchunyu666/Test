import React, { Component } from 'react';
import './App.css';
import 'moment/locale/zh-cn';//引入moment国际化
import Layout from './compontent/layout';


import ActionTypes from './redux/actionTypes';
import LoginPage from './compontent/login_page';
//引入redux
import { connect, Provider } from 'react-redux';
import store from './redux/store';
//引入路由组件
import { BrowserRouter } from 'react-router-dom';
class App extends Component {
  render() {
    const { isLogin, isMount } = this.props;
    if (isLogin || !isMount) {
      this.props.dispatch(ActionTypes.create(ActionTypes.SET_VIEW_IS_MOUNT, false))
      return (
        <BrowserRouter>
          <Layout />
        </BrowserRouter>

      );
    } else {
      return (
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

    }
  }
}

export default connect(state => ({ isLogin: state.get('isLogin'), isMount: state.getIn(['view', 'isMount']) }))(App);
