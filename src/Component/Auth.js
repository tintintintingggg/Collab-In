import React from 'react';
import "firebase/auth";
import "firebase/firestore";

import '../css/Homepage.css';
import { Redirect } from 'react-router-dom';


class Auth extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            signUpName: null,
            signUpEmail: null,
            signUpPassword: null,
            signInEmail: null,
            signInPassword: null,
            blockState: 'signin'
        }
    }
    
    getSignUpName(e){
        this.setState({
            signUpName: e.target.value
        })
    }
    getSignUpEmail(e){
        this.setState({
            signUpEmail: e.target.value
        })
    }
    getSignUpPassword(e){
        this.setState({
            signUpPassword: e.target.value
        })
    }
    getSignInEmail(e){
        this.setState({
            signInEmail: e.target.value
        })
    }
    getSignInPassword(e){
        this.setState({
            signInPassword: e.target.value
        })
    }

    handleSigninOrup(){
        if(this.state.blockState === 'signin'){
            this.myRef.current.childNodes[0].setAttribute('style', 'display: none');
            this.myRef.current.childNodes[1].setAttribute('style', 'display: block');
            this.setState({
                blockState: 'signup'
            })
        }else if(this.state.blockState === 'signup'){
            this.myRef.current.childNodes[1].setAttribute('style', 'display: none');
            this.myRef.current.childNodes[0].setAttribute('style', 'display: block');
            this.setState({
                blockState: 'signin'
            })
        }
    }

    render(){
        if(this.props.currentUser){
            console.log(this.props.landingPage)
            // return <Redirect to={this.props.landingPage} />
            this.props.routeProps.goBack();
            return true
        }else{
            return <div className="memberBlock" ref={this.myRef} >
                <div className="signInBlock" style={{display: 'block'}}>
                    <div className="google-signin" onClick={this.props.googleSignIn}><div><img src="/images/google.png" /></div>Sign in with Google</div>
                    <div className="facebook-signin" onClick={this.props.facebookSignIn}><div><img src="/images/fb.svg" /></div>Sign in with Facebook</div>
                    <div className="seperator"><div className="seperator-line"></div><div>Or</div><div className="seperator-line"></div></div>
                    <div className="email-signin">
                        <div><input onChange={this.getSignInEmail.bind(this)} placeholder="Email" /></div>
                        <div><input type="password" onChange={this.getSignInPassword.bind(this)} placeholder="Password" /></div>
                        <button onClick={()=>{this.props.signIn(this.state.signInEmail, this.state.signInPassword)}}>Sign In</button>
                    </div>
                    <div className="reminder">No account? <span onClick={this.handleSigninOrup.bind(this)}>Create one!</span></div>
                </div>
                <div className="signUpBlock" style={{display: 'none'}}>
                    <div className="email-signup">
                        <div><input onChange={this.getSignUpName.bind(this)} placeholder="Your Name"  /></div>
                        <div><input onChange={this.getSignUpEmail.bind(this)} placeholder="Email"  /></div>
                        <div><input type="password" onChange={this.getSignUpPassword.bind(this)} placeholder="Password" /></div>
                        <button onClick={()=>{this.props.signUp(this.state.signUpEmail, this.state.signUpPassword, this.state.signUpName)}}>Register</button>
                    </div>
                    <div className="reminder">Already have an account? <span onClick={this.handleSigninOrup.bind(this)}>Sign in!</span></div>
                </div>
            </div>
        }        
    }

}

export {Auth};