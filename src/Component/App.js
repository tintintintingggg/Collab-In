import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Homepage} from './Homepage';
import { Redirect } from 'react-router-dom';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userCredential: null,
            currentUser: null,
            currentUserName: null,
            currentUserId: null
        }
    }
    render(){
        
        return <div className="app">
            <Homepage 
                db={this.props.db}
                signUp={this.signUp.bind(this)}
                signIn={this.signIn.bind(this)}
                googleSignIn={this.googleSignIn.bind(this)}
                facebookSignIn={this.facebookSignIn.bind(this)}
                currentUser={this.state.currentUser}
                currentUserId={this.state.currentUserId}
                currentUserName={this.state.currentUserName}
                signOut={this.signOut.bind(this)}
             />
        </div>
    }
    componentDidMount(){
        let db = this.props.db;
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.onlineCheck(user.uid);   
                // this.setState({
                //     currentUser: user,
                //     currentUserId: user.uid,
                //     currentUserName: user.displayName
                // })
                let userCredential = this.state.userCredential;
                if(userCredential !== null){
                    if(userCredential.additionalUserInfo.isNewUser){
                        user.updateProfile({displayName: this.state.currentUserName})
                            .then(() => {
                                db.collection('users').doc(user.uid).set({
                                    email: user.email,
                                    uid: user.uid,
                                    name: user.displayName
                                })
                                .then(function(){
                                    this.setState({
                                        currentUser: user,
                                        currentUserId: user.uid,
                                        currentUserName: user.displayName
                                    })
                                })
                                .catch(function(error){
                                    alert('alret1',error.message);
                                });
                            })
                            .catch((error) => {
                                alert('alret2',error.message);
                            });
                    }
                }else if(user.photoURL !== null){
                    db.collection('users').doc(user.uid).get()
                    .then(function(doc){
                        if(!doc.exists){
                            db.collection('users').doc(user.uid).set({
                                email: user.email,
                                name: user.displayName,
                                photoURL: user.photoURL,
                                uid: user.uid
                            })
                            .then(function(){
                                // console.log('User created successfully');
                            })
                            .catch(function(error){
                                alert('alret3',error.message);
                            });
                        }else{
                            // console.log('data is already built')
                        }
                    }).catch(function(error){
                        alert('alret4',error.message);
                    });
                }else{
                    this.setState({
                        currentUser: user,
                        currentUserId: user.uid,
                        currentUserName: user.displayName
                    })
                }
            }else{
                this.setState({
                    currentUser: null,
                    currentUserId: null,
                    currentUserName: null
                })
            }
        });  
        
    }
    
    signUp(email, password, name){
        if(!email){
            alert('You forget to enter Email!')
        }else if(!password){
            alert('You forget to enter Password!')
        }else if(!name){
            alert('You forget to enter your Name!')
        }else{
            console.log('hi');
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                // console.log(cred);
                this.setState({
                    userCredential: cred,
                    currentUserName: name
                });
            }).catch(error => {
                alert('alret5',error.message);
              });
        }   
    }
    signIn(email, password){
        if(!email){
            alert('You forget to enter Email!')
        }else if(!password){
            alert('You forget to enter Password!')
        }else{
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((cred) => {
                // console.log(cred);
                // console.log(firebase.auth().currentUser)
                this.setState({
                    userCredential: cred
                })
                alert('You are logged in!');
            })
            .catch((error) => {
              alert(error.message);
            });
        }
    }
    googleSignIn(){
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            'login_hint': 'user@example.com'
        });
        firebase.auth().signInWithPopup(googleProvider).then(function(result) {
            var token = result.credential.accessToken;
            alert('You are logged in!');
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log(errorCode, errorMessage, email, credential);
            alert(error.message);
        });
    }
    signOut(){
        firebase.auth().signOut().then(function() {
            alert("Sign Out!");
          }).catch(function(error) {
            alert(error.message);
          });
    }
    
    facebookSignIn(){
        let fbProvider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        // fbProvider.setCustomParameters({
        //     'display': 'popup'
        //   });
        firebase.auth().signInWithPopup(fbProvider).then(function(result) {
          var token = result.credential.accessToken;
          alert('You are logged in!');
        }).catch(function(error) {
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log('error')
          console.log(email)
          console.log(credential)
          console.log(errorMessage);
          alert(error.message);
        });
    }
    onlineCheck(uid){
        let url = location.href.toString();
        let docId = url.split('document/')[1];
        // let uid = this.state.currentUserId;
        console.log('uid',uid)
        if(docId !== undefined){
            let userStatusDatabaseRef = this.props.realtimeDb.ref(docId+ '/status/' + uid);
            let docStatusDatabaseRef = this.props.realtimeDb.ref(docId+ '/status/')
            let isOfflineForDatabase = {
                state: 'offline',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            let isOnlineForDatabase = {
                state: 'online',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            this.props.realtimeDb.ref('.info/connected').on('value', function(snapshot) {
                if (snapshot.val() == false) {
                    return;
                };
                userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                    userStatusDatabaseRef.set(isOnlineForDatabase);
                });
            });


            //////
            if(uid !== null){
                let userStatusFirestoreRef = this.props.db.collection("status").doc(docId).collection('online').doc(uid);
                let docStatusFirestoreRef = this.props.db.collection("status").doc(docId).collection('online').doc("total");
                let isOfflineForFirestore = {
                    state: 'offline',
                    // last_changed: firebase.firestore.FieldValue.serverTimestamp(),
                };
                
                let isOnlineForFirestore = {
                    state: 'online',
                    // last_changed: firebase.firestore.FieldValue.serverTimestamp(),
                };
                
                this.props.realtimeDb.ref('.info/connected').on('value', function(snapshot) {
                    if (snapshot.val() == false) {
                        userStatusFirestoreRef.set(isOfflineForFirestore);
                        return;
                    };
                
                    userStatusDatabaseRef.onDisconnect()
                        .set(isOfflineForDatabase)
                        .then(function() {
                            docStatusDatabaseRef.once("value")
                            .then(function(doc){
                                console.log(doc.val())
                                let data = doc.val();
                                let arr = []
                                for(let prop in data){
                                    let obj = {}
                                    if(data[prop]["state"] === 'online'){
                                        // console.log(data.prop)
                                        // console.log(Object.keys(data))
                                        obj[prop] = data[prop]["state"]
                                        arr.push(obj)
                                        // arr.push(data.keys)
                                    }
                                }
                                console.log(arr)
                                docStatusFirestoreRef.set({
                                    total: arr
                                })
                                userStatusDatabaseRef.set(isOnlineForDatabase);
                            })
                            
                            
                        });
                });

                // userStatusFirestoreRef.onSnapshot(function(doc) {
                //     let isOnline = doc.data().state == 'online';
                //     console.log('see')
                // });
            }
            
        }
        
    }
}

export {App} ;


   