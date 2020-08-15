import React from 'react';
import "firebase/auth";
import Homepage from './Homepage';
import {LoadingPage} from './LoadingPage';
import {db, firebase} from '../utils/firebase';
// redux
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import * as actionCreators from '../Redux/actions/action';

class App extends React.Component{
    constructor(props){
        super(props);
        this.setUserDataInState = this.setUserDataInState.bind(this);
    }
    render(){
        if(this.props.user !== undefined){
            return <div className="app">
                <Homepage 
                    signUp={this.signUp.bind(this)}
                    signIn={this.signIn.bind(this)}
                    googleSignIn={this.googleSignIn.bind(this)}
                    facebookSignIn={this.facebookSignIn.bind(this)}
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
                let userCredential = this.props.userCredential;
                if(userCredential !== null){
                    if(userCredential.additionalUserInfo.isNewUser){
                        user.updateProfile({
                            displayName: this.props.newUserName
                        }).then(()=>{
                            this.setUserDataInDB.call(this, user);
                        }).then(()=>{
                            this.props.setUserName(undefined);
                        }).catch((error)=>{alert(error.message)});
                    }
                }else if(user.photoURL !== null){
                    db.collection('users').doc(user.uid).get()
                    .then((doc)=>{
                        if(!doc.exists){
                            this.setUserDataInDB.call(this, user);
                        }
                    }).catch((error)=>{alert(error.message)});
                }
            }else{
                this.setUserDataInState(null);
            }
        });     
    }
    setUserDataInDB(data){
        db.collection('users').doc(data.uid).set({
            email: data.email,
            uid: data.uid,
            name: data.displayName,
            photoURL: data.photoURL ? data.photoURL : null
        })
    }
    setUserDataInState(data){
        this.props.changeUser(data);
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
                this.props.setUserName(name);
                this.props.setUserCredential(cred);
                alert('You are logged in!');
            })
            .catch(error => {
                alert('sign up wrong')
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
                this.props.setUserCredential(cred);
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
        .then((result)=>{
            alert('You are logged in!');
        })
        .catch((error)=>{
            alert(error.message);
        });
    }

    facebookSignIn(){
        let fbProvider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(fbProvider)
        .then((result)=>{
            alert('You are logged in!');
        })
        .catch((error)=>{
            alert(error.message);
        });
    }
    signOut(){
        firebase.auth().signOut()
        .then(()=>{
            alert("Sign Out!");
        })
        .catch((error)=>{
            alert(error.message);
        });
    }
}

const mapStateToProps = (store)=>{
    return{
        user: store.userReducer.user,
        newUserName: store.setNewUserNameReducer.newUserName,
        userCredential: store.setUserCredentialReducer.userCredential
    };
};

export default connect(mapStateToProps, actionCreators)(App);

   