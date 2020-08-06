import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './Component/App';
import { createStore } from 'redux'
import firebase, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';
import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAwHewumFHBjhO0QX22yEMTzN-2aJfq4uU",
    authDomain: "collabin-21f76.firebaseapp.com",
    databaseURL: "https://collabin-21f76.firebaseio.com",
    projectId: "collabin-21f76",
    storageBucket: "collabin-21f76.appspot.com",
    messagingSenderId: "592261204349",
    appId: "1:592261204349:web:273f19eba69f20ca812414",
    measurementId: "G-K0FS0GX00K"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let realtimeDb = firebase.database();
let storage = firebase.storage();



window.addEventListener("load", () => {
    let reducer = function(state, action){
        switch(action.type){
            case "UPDATE_SWITCH":
                return {on: !state.on};
            default:
                return state;
        }
    }
    let handler = function(){
        console.log(store.getState())
    }
    // 建立儲存空間(store)，必須準備好狀態處理函式(reducer)，以及初始的狀態物件
    const store = createStore(reducer, {on:false})
    console.log(store);
    let unsbuscribe = store.subscribe(handler);
    // document.addEventListener('click', ()=>{
    //     store.dispatch({
    //         type: "UPDATE_SWITCH"
    //     })
    // })
    ReactDOM.render(
        <App db={db} realtimeDb={realtimeDb} storage={storage}/> 
        , document.getElementById('root'));
})
