import React from 'react';
import {DocApp} from './DocApp';
import {Auth} from './Auth';
import {ChatApp} from './ChatApp';
import { BrowserRouter, Route, Link ,Redirect} from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";

import '../css/Homepage.css';


class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            docName: null,
            docId: null,
            showMemberBlock: false,
            showCreateDoc: false,
            username: null,
            currentUser: null
        }
    }

    submitDocName(){
        let db = this.props.db;
        if(this.state.docName !== null){
            let newDoc = db.collection("documents").doc();
            console.log(newDoc.id)
            newDoc.set({
                name: this.state.docName,
                owner: this.props.currentUser.uid,
                text: '',
                version: 0,
                editorsList: []
            })
            .then(this.setState({docId: newDoc.id}))
            .catch(console.log('data set fail!'))
            let userDoc = db.collection('users').doc(this.props.currentUser.uid)
            userDoc.collection("userdocs").doc(newDoc.id)
            .set({name: this.state.docName})
            .then(console.log('userdoc is set'))
            .catch(console.log('userdoc is fail'))
        }else{
            alert('Please Enter Your Document Name')
        }
    }
    getDocName(e){
        this.setState({
            docName: e.target.value
        })
    }
    handleMemberBlock(){
        console.log('hi');
        this.setState((prevState) => ({
            showMemberBlock: !prevState.showMemberBlock
        }))
    }
    handleCreateDocBlock(){
        if(this.props.currentUser){
            this.setState((prevState) => ({
                showCreateDoc: !prevState.showCreateDoc
            }))

        }else{
            alert("Sign in first!");
            this.setState({
                showMemberBlock: true
            })
        }
        
    }

    render(){
        let link;
        let path;
        let docId;
        let url = location.href.toString();
        let id = url.split('document/')[1];
        if(id){
            if(this.props.db.collection('documents').doc(id)){
                console.log(id)
                docId = id;
                path = '/document/'+id;
                link = <Link to={'/document/'+id} key={'/document/'+id} >點我去文件</Link>; 
            }
        }else if(id === undefined || null){
            console.log('no current id')
            docId = this.state.docId;
            path = '/document/'+this.state.docId;
            if(this.state.docId){
                link = <Link to={'/document/'+this.state.docId} key={'/document/'+this.state.docId} >點我去文件</Link>;
            }else{
                link = null
            }
            
        }
        let createDoc;
        if(this.state.showCreateDoc){
            if(this.props.currentUser){
                    createDoc = <div className="createDoc">
                    <div className="doc-name-div">
                        <input id="doc-name" type="text" name="doc-name" 
                            placeholder="Enter a New Document Name" 
                            onChange={this.getDocName.bind(this)}
                         />
                    </div>
                    <div className="submit-btn-div">
                        <button id="submit-doc-name-btn" onClick={this.submitDocName.bind(this)}>Submit</button>
                    </div>
                    {link}
                </div>
            }else{
                <div className="createDoc"></div>
            }
        }else{
            <div className="createDoc"></div>
        }

        let memberNav;
        if(this.props.currentUser){
            memberNav = <div className="memberNav" >
                <div>My Account</div>
                <div onClick={this.props.signOut}>Sign Out</div>
            </div>
        }else{
            memberNav = <div className="memberNav" >
                <div>My Account</div>
                <div onClick={this.handleMemberBlock.bind(this)}>Sign In / Up</div>
            </div>
        }

        let helloMessage;
        if(!this.props.currentUserName){
            helloMessage = 'Welcome!';
        }else{
            helloMessage = 'Hi! '+this.props.currentUserName;
        }
        
        return <BrowserRouter>
                <Route exact path='/' >
                    <div className="background">
                        <div className="background-imgs">
                            <div id="img-left"><img src="/images/2929004.jpg" /></div>
                            <div id="img-right"><img src="/images/pen.png" /></div>
                            {/* <img src="/images/3173494.jpg" /> */}
                        </div>
                        <div className="homepage">
                            <header>
                            <div className="logo">CollabIn</div>
                            <div className="nav">{helloMessage}</div>
                            <div className="member"><img src="/images/user.png" />
                                {memberNav}
                            </div>
                            </header>
                            <main className="introduction">
                                <div className="intro-text">
                                    <div className="title">Welcome to Collab-In!</div>
                                    <div className="intro-lines">Let's start to create a new document, Let's start to create a new document, Let's start to create a new document, Let's start to create</div>
                                    <div className="btns">
                                        <button id="create-doc-btn" onClick={this.handleCreateDocBlock.bind(this)}>Create a New Doc</button>
                                        <button id="member-btn" onClick={this.handleMemberBlock.bind(this)}>Sign In / Up Now</button>
                                    </div>
                                    <Auth 
                                        showMemberBlock={this.state.showMemberBlock}
                                        signUp={this.props.signUp}
                                        signIn={this.props.signIn}
                                        googleSignIn={this.props.googleSignIn}
                                        facebookSignIn={this.props.facebookSignIn}
                                        handleMemberBlock={this.handleMemberBlock.bind(this)}
                                     />
                                    {createDoc}
                                </div>

                            </main>
                            <main className="features"></main>
                        </div>
                    </div>
                </Route>
                <Route path={path} >
                    <div className="document-layout">
                        <DocApp 
                            db={this.props.db}
                            docId={docId}
                            currentUser={this.props.currentUser}

                            signUp={this.props.signUp}
                            signIn={this.props.signIn}
                            googleSignIn={this.props.googleSignIn}
                            facebookSignIn={this.props.facebookSignIn}
                            handleMemberBlock={this.handleMemberBlock.bind(this)}
                         />
                        <ChatApp />
                    </div>
                </Route>
        </BrowserRouter>
    }

    componentDidMount(){
        if(document.getElementById('img-left') && document.getElementById('img-right')){
            setTimeout(() => {
                document.getElementById('img-left').style.bottom = '10px';
                document.getElementById('img-right').style.bottom = '200px';
            }, 1000)
        }
    }
}
export {Homepage};