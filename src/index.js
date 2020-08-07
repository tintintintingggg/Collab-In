import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './Component/App';
import { createStore } from 'redux';





// let reducer = function(state, action){
//     switch(action.type){
//         case "UPDATE_SWITCH":
//             return {on: !state.on};
//         default:
//             return state;
//     }
// }
// let handler = function(){
//     console.log(store.getState())
// }
// 建立儲存空間(store)，必須準備好狀態處理函式(reducer)，以及初始的狀態物件
// const store = createStore(reducer, {on:false})
// console.log(store);
// let unsbuscribe = store.subscribe(handler);
// document.addEventListener('click', ()=>{
//     store.dispatch({
//         type: "UPDATE_SWITCH"
//     })
// })
ReactDOM.render(
    <App /> 
    , document.getElementById('root')
);

