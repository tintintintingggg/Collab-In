import React from 'react';
import {DocApp} from './DocApp';
import {Auth} from './Auth';
import {ChatApp} from './ChatApp';
import { BrowserRouter, Route, Link ,Redirect} from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
import '../css/Homepage.css';


class Main extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let helloMessage = '';
        if(this.props.currentUser && this.props.currentUser.displayName){
            helloMessage = 'Hi! '+this.props.currentUser.displayName;
        }

        let memberNav;let memberBtn;
        if(this.props.currentUser){
            memberNav = <div className="memberNav" >
                <div>My Account</div>
                <div onClick={this.props.signOut}>Sign Out</div>
            </div>
            memberBtn = <button id="member-btn">
                See My Documents</button>
        }else{
            memberNav = <div className="memberNav" >
                <div>My Account</div>
                <div><Link to="/authentication">Sign In / Up</Link></div>
            </div>
            memberBtn = <Link to="/authentication">
                <button id="member-btn">Sign In / Up Now</button>
            </Link>
        }

        return <div className="background">
            <div className="background-imgs">
                <div id="img-left"><img src="/images/2929004.jpg" /></div>
                <div id="img-right"><img src="/images/pen.png" /></div>
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
                            <button id="create-doc-btn" onClick={this.props.handleDocCreate}>Create a New Doc</button>
                            {memberBtn}
                        </div>
                    </div>
                </main>
                <main className="features"></main>
            </div>
        </div>
    }
}

class DocCreate extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className="document-layout">
            <DocApp 
                db={this.props.db}
                storage={this.props.storage}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
        
                signUp={this.props.signUp}
                signIn={this.props.signIn}
                googleSignIn={this.props.googleSignIn}
                facebookSignIn={this.props.facebookSignIn}
             />
            <ChatApp 
                db={this.props.db}
                storage={this.props.storage}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
        </div>
    }
}

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
            currentUser: null,
            landingPage: '/'
        }
    }
    handleDocCreate(){
        if(this.props.currentUser){
            let db = this.props.db;
            // 建立文件基本資料
            let newDoc = db.collection("documents").doc();
            console.log(newDoc.id);
            newDoc.set({
                name: 'Untitled document',
                owner: this.props.currentUser.uid,
                time: Date.now(),
                text: '',
                version: 0,
                editorsList: []
            })
            .then(()=>{
                // 建立user擁有的文件
                let userDoc = db.collection('users').doc(this.props.currentUser.uid)
                userDoc.collection("userdocs").doc(newDoc.id).set({
                    time: Date.now()
                })
                .then(()=>{
                    console.log('userdoc is set')
                    // 建立chatroom成員（擁有者本人）
                    let chatroomMembers = db.collection('chatrooms').doc(newDoc.id)
                    .collection('members').doc(this.props.currentUser.uid)
                    chatroomMembers.set({
                        time: Date.now()
                    })
                    .then(()=>{
                        console.log('chatroom member is set')
                        // 建立status空array
                        db.collection('status').doc(newDoc.id).collection('online').doc("total").set({
                            total: []
                        })
                        .then(()=>{
                            console.log('status total is set')
                            this.setState({docId: newDoc.id})
                        })
                        .catch((error)=>{error.message})
                    })
                    .catch((error)=>{error.message})
                })
                .catch(console.log('userdoc is fail'))
            })
            .catch(console.log('data set fail!'))
        }else{
            alert("Sign in first!");
        }
        
    }
    render(){
        let path = '/document/';
        let docId;
        let url = location.href.toString();
        let id = url.split('document/')[1];
        if(id){
            docId = id
            path = path+docId
        }else{
            if(this.state.docId){
                docId = this.state.docId;
                path = path+docId
            }
        }
        
        return <BrowserRouter>
                <Route exact path='/' >
                    {docId ? <Redirect to={path} /> : <Main
                        currentUser={this.props.currentUser}
                        signOut={this.props.signOut}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />}
                </Route>
                <Route path="/authentication" render={(props)=>{
                    console.log("Route Props", props);
                    console.log('route props', props.history.location)
                    let routeProps = props.history;
                    // console.log('goback', props.history.goBack)
                    return <Auth 
                        showMemberBlock={this.state.showMemberBlock}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                        landingPage={this.state.landingPage}
                        routeProps={routeProps}
                        // docId={docId}
                    />;
                }} />
                {/*}
                <Route path="/authentication">
                    <Auth 
                        showMemberBlock={this.state.showMemberBlock}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                        landingPage={this.state.landingPage}
                     />
                </Route>
                {*/}
                <Route exact path={path} >
                    <DocCreate 
                        db={this.props.db}
                        storage={this.props.storage}
                        docId={docId}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                     />
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