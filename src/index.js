import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './Component/App';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

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
    ReactDOM.render(
        <App db={db} realtimeDb={realtimeDb} storage={storage}/> 
        , document.getElementById('root'));
})



// componentDidMount(){} 畫面被 render 出來後做事，可以用來跟資料庫拿資料
// 第一時間：畫面載入（還不知道資料 -> loading期間）
// 第二時間：componentDidMount(){去拿資料，資料放進 state}
// 第三時間：state被改變 -> 畫面重新 render
