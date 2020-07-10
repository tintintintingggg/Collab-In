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
        if(this.state.currentUser){
            console.log('hqhqhqh')
            
        }
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
                this.setState({
                    currentUser: user,
                    currentUserId: user.uid,
                    currentUserName: user.displayName
                })
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
                                console.log('User created successfully');
                                this.setState({
                                    currentUser: user,
                                    currentUserId: user.uid,
                                    currentUserName: user.displayName
                                })
                            })
                            .catch(function(error){
                                alert(error.message);
                            });
                        })
                        .catch((error) => {
                            alert(error.message);
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
                                console.log('User created successfully');
                            })
                            .catch(function(error){
                                alert(error.message);
                            });
                        }else{
                            console.log('data is already built')
                        }
                    }).catch(function(error){
                        alert(error.message);
                    });
                }else{
                    console.log('else')
                }
            }else{
              console.log('Log In to Comment Below!');
                this.setState({
                    currentUser: null
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
                console.log(cred);
                this.setState({
                    userCredential: cred,
                    currentUserName: name
                });
            }).catch(error => {
                alert(error.message);
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
                console.log(cred);
                console.log(firebase.auth().currentUser)
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
          var errorCode = error.code;
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
        let db = this.props.db;
        
    }
}

export {App} ;


   