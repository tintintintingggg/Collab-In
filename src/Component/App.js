import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {Homepage} from './Homepage/Homepage';
import {LoadingPage} from './LoadingPage';
import {db} from '../utils/firebase';

class App extends React.Component{
    constructor(props){
        super(props);
        this.setUserDataInState = this.setUserDataInState.bind(this);
        this.state = {
            userCredential: null,
            currentUser: undefined,
            currentUserName: undefined
        }
    }
    render(){
        if(this.state.currentUser !== undefined){
            return <div className="app">
                <Homepage 
                    signUp={this.signUp.bind(this)}
                    signIn={this.signIn.bind(this)}
                    googleSignIn={this.googleSignIn.bind(this)}
                    facebookSignIn={this.facebookSignIn.bind(this)}
                    currentUser={this.state.currentUser}
                    signOut={this.signOut.bind(this)}
                 />
            </div>
        }else{
            return <LoadingPage />
        }
    }
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setUserDataInState(user);
                console.log(user)
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
                                .then(
                                    console.log('data is set')
                                )
                                .catch((error) => {
                                    alert(error.message);
                                });
                            })
                            .catch((error) => {
                                alert(error.message);
                            });
                    }
                }else if(user.photoURL !== null){
                    db.collection('users').doc(user.uid).get()
                    .then((doc)=>{
                        if(!doc.exists){
                            db.collection('users').doc(user.uid).set({
                                email: user.email,
                                name: user.displayName,
                                photoURL: user.photoURL,
                                uid: user.uid
                            })
                            .then(()=>{
                                console.log('User created successfully');
                            })
                            .catch((error)=>{
                                alert(error.message);
                            });
                        }
                    }).catch((error)=>{
                        alert(error.message);
                    });
                }
            }else{
                this.setUserDataInState(null)
            }
        });  
        
    }
    setUserDataInState(data){
        this.setState({
            currentUser: data
        })
    }
    signUp(email, password, name){
        if(!email){
            alert('You forget to enter Email!')
        }else if(!password){
            alert('You forget to enter Password!')
        }else if(!name){
            alert('You forget to enter your Name!')
        }else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((cred) => {
                this.setState({
                    userCredential: cred,
                    currentUserName: name
                });
                alert('You are logged in!');
            })
            // .catch(error => {
            //     alert('sign up wrong')
            //     alert(error.message);
            //   });
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
        firebase.auth().signInWithPopup(googleProvider)
        .then(function(result) {
            let token = result.credential.accessToken;
            alert('You are logged in!');
        })
        .catch(function(error) {
            alert(error.message);
        });
    }

    facebookSignIn(){
        let fbProvider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(fbProvider)
        .then(function(result) {
            let token = result.credential.accessToken;
            alert('You are logged in!');
        })
        .catch(function(error) {
            alert(error.message);
        });
    }
    signOut(){
        firebase.auth().signOut()
        .then(function() {
            alert("Sign Out!");
        })
        .catch(function(error) {
            alert(error.message);
        });
    }
}

export {App} ;


   