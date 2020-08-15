import React from 'react';
import "firebase/auth";
import "firebase/firestore";
import '../../css/Homepage.css';
import '../../css/Auth.css';
// redux
import {connect} from 'react-redux';

class EmailSignInAndUp extends React.Component{
    constructor(props){
        super(props);
        this.state={
            testAccount: {
                email: 'test@test.com',
                password: '111111'
            }
        }
    }
    changeState(emailValue, passwordValue){
        this.props.getInputValue(emailValue, 'email');
        this.props.getInputValue(passwordValue, 'password');  
    }
    setTestAccount(e){
        let testAccount = this.state.testAccount;
        if(e.target.checked){
            this.changeState(testAccount.email, testAccount.password);
        }else{
            this.changeState('', '');
        }
    }
    render(){
        let signState = this.props.signState;
        let nameInput, btn;
        if(signState === 'signup'){
            nameInput = <div>
                <input 
                    onChange={(e)=>{this.props.getInputValue(e.target.value, 'name')}} 
                    placeholder="Your Name" 
                    value={this.props.name}
                 />
            </div>;
            btn = <button 
                onClick={()=>{this.props.submit(this.props.email, this.props.password, this.props.name)}}
            >
                Register
            </button>
        }else{
            nameInput = '';
            btn = <button 
                onClick={()=>{this.props.submit(this.props.email, this.props.password)}}
            >
                Sign In
            </button>
        }
        
        return <div className={`email-${signState}`}>
            {nameInput}
            <div>
                <input 
                    onChange={(e)=>{this.props.getInputValue(e.target.value, 'email')}} 
                    placeholder="Email" value={this.props.email}
                 />
            </div>
            <div>
                <input 
                    type="password" 
                    onChange={(e)=>{this.props.getInputValue(e.target.value, 'password')}} 
                    placeholder="Password" 
                    value={this.props.password}
                 />
            </div>
            {signState==='signin' ? <label>
                <input 
                    type="checkbox" 
                    onChange={this.setTestAccount.bind(this)}
                 />
                <label>
                    &nbsp;Sign in with test account
                </label>
            </label> : null}
            {btn}
        </div>
    }
}

class Auth extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            memberBlockisSignIn: true,
            name: '',
            email: '',
            password: ''
        }
    }
    getInputValue(value, inputName){
        this.setState({
            [inputName]: value
        });
    }
    handleSigninOrup(){
        this.setState(prevState=>({
            memberBlockisSignIn: !prevState.memberBlockisSignIn
        }), this.clearInputState);
    }
    clearInputState(){
        this.setState({
            name: '',
            email: '',
            password: ''
        })
    }

    render(){
        if(this.props.user){
            this.props.routeProps.goBack();
            return true
        }else{
            return <div className="memberBlock" >
                <div className="signInBlock" style={{display: this.state.memberBlockisSignIn ? 'block' : 'none'}}>
                    <div className="google-signin" onClick={this.props.googleSignIn}>
                        <div><img src="/images/google.png" /></div>
                        Sign in with Google
                    </div>
                    <div className="facebook-signin" onClick={this.props.facebookSignIn}>
                        <div><img src="/images/fb.svg" /></div>
                        Sign in with Facebook
                    </div>
                    <div className="seperator">
                        <div className="seperator-line"></div>
                        <div>Or</div>
                        <div className="seperator-line"></div>
                    </div>
                    <EmailSignInAndUp
                        signState="signin"
                        getInputValue={this.getInputValue.bind(this)}
                        submit={this.props.signIn}
                        email={this.state.email}
                        password={this.state.password}
                     />
                    <div className="reminder">No account? 
                        <span onClick={this.handleSigninOrup.bind(this)}>&nbsp;&nbsp;Create one!</span>
                    </div>
                </div>
                <div className="signUpBlock" style={{display: this.state.memberBlockisSignIn ? 'none' : 'block'}}>
                    <EmailSignInAndUp
                        signState="signup"
                        getInputValue={this.getInputValue.bind(this)}
                        submit={this.props.signUp}
                        email={this.state.email}
                        password={this.state.password}
                        name={this.state.name}
                     />
                    <div className="reminder">Already have an account? 
                        <span onClick={this.handleSigninOrup.bind(this)}>&nbsp;&nbsp;Sign in!</span>
                    </div>
                </div>
            </div>;
        }        
    }

}

const mapStateToProps = (store)=>{
    return{user: store.userReducer.user};
};
Auth = connect(mapStateToProps)(Auth);
export {Auth};