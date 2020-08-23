import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
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

export {db, realtimeDb, storage, firebase};