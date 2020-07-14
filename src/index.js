import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './Component/App';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

import firebase, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';
import "firebase/functions";
// import * as admin from 'firebase-admin';

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
// admin.initializeApp(
//     // {credential: admin.credential.applicationDefault(),
//     // databaseURL: "https://collabin-21f76.firebaseio.com"}
//     functions.config().firebase
// );
let db = firebase.firestore();
let realtimeDb = firebase.database();




// class Main extends React.Component{
//     constructor(props){
//         super(props);
//     }
//     render(){
//         let content = [];
//         if(this.props.currentChapter){
//             for(let i = 0; i<this.props.currentChapter.sections.length; i++){
//                 content.push(<li className="section-item" key={i}>{this.props.currentChapter.sections[i]}</li>)
//             }
//             content.push(<Link className="link" to="/" key="homepage" >回首頁</Link>);
//         }
//         return <div className="sections">
//             {content}
//         </div>
//     }
// }

// class App extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             headline: '',
//             chapters: null,
//             chapterNumber: 0,
//             currentChapterContent: ''
//         }
//     }
//     componentDidMount(){
//         let req = new XMLHttpRequest();
//         req.open('GET', 'https://cwpeng.github.io/live-records-samples/data/content.json');
//         req.onload = function(){
//             let data = JSON.parse(req.responseText);
//             console.log(data.headline);
//             this.setState({
//                 headline: data.headline,
//                 chapters: data.chapters,
//                 chapterNumber: data.chapters.length
//             })
//         }.bind(this);
//         req.send();
//     }
//     handleCurrentChapter(e){
//         let currentChapterContent;
//         if(this.state.chapters !== null){
//             for(let i = 0; i<this.state.chapters.length; i++){
//                 if(i == e.target.id){
//                     currentChapterContent = this.state.chapters[i];
//                 }
//             }
//         }
//         this.setState({
//             currentChapterContent: currentChapterContent
//         })
//     }

//     render(){
//         let link = [];
//         let chapters = this.state.chapters;
//         if(chapters !== null){
//             for (let i = 0; i<chapters.length; i++){
//                 link.push(<Link className="link" to={'/'+chapters[i].key} key={i} id={i} onClick={this.handleCurrentChapter.bind(this)}>{chapters[i].title}</Link>)
//             }
//         }
//         let route = [];
//         if(chapters !== null){
//             for(let i = 0; i<chapters.length; i++){
//                 route.push(<Route path={'/'+chapters[i].key} key={i}><Main currentChapter={this.state.currentChapterContent}/></Route>)
//             }
//             route.push(<Route path='/' key="homePage"><Title className="title" headline={this.state.headline}/></Route>)
//         }
//         return (
//             <Router>
//             <div className="container">
//                 {link}
//                 <Switch>
//                 {route}
//                 </Switch>
//             </div>
//             </Router>
//         );
//     }
// }


window.addEventListener("load", () => {
    ReactDOM.render(
        <App db={db} realtimeDb={realtimeDb}/> 
        , document.getElementById('root')); // 塞入元素
})



// componentDidMount(){} 畫面被 render 出來後做事，可以用來跟資料庫拿資料
// 第一時間：畫面載入（還不知道資料 -> loading期間）
// 第二時間：componentDidMount(){去拿資料，資料放進 state}
// 第三時間：state被改變 -> 畫面重新 render
