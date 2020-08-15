import React from 'react';
import ReactDOM from 'react-dom';
import App from './Component/App';
// redux
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import store from './Redux/store';

ReactDOM.render(
    <Provider store={store}>
        <App /> 
    </Provider>
    , document.getElementById('root')
);