import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//引入redux
import { connect, Provider } from 'react-redux';
import store from './redux/store';
//引入路由组件
import { BrowserRouter } from 'react-router-dom';
const AppRoot =()=> (
        <Provider store={store}>
            <App />
        </Provider>


)

ReactDOM.render(<AppRoot />, document.getElementById('root'));
registerServiceWorker();
