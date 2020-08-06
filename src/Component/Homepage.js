import React from 'react';
import {Auth} from './Auth';
import {MainPage} from './MainPage';
import {Account} from './Account';
import {HomepageMainContent} from './HomepageMainContent';
import { BrowserRouter, Route, Link ,Redirect} from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
import '../css/Homepage.css';

class DocCreate extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <MainPage
                db={this.props.db}
                realtimeDb={this.props.realtimeDb}
                storage={this.props.storage}
                docId={this.props.docId}
                currentUser={this.props.currentUser}

                signUp={this.props.signUp}
                signIn={this.props.signIn}
                googleSignIn={this.props.googleSignIn}
                facebookSignIn={this.props.facebookSignIn}
             />
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
            currentUser: null
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
                        time: Date.now(),
                        id: this.props.currentUser.uid
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
            alert("Sign-In First!");
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
        let accountPath = '/account/'
        if(this.props.currentUser){
            accountPath = '/account/'+this.props.currentUser.uid
        }
        return <BrowserRouter>
                <Route exact path='/' >
                    {docId ? <Redirect to={path} /> : <HomepageMainContent
                        currentUser={this.props.currentUser}
                        signOut={this.props.signOut}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />}
                </Route>
                <Route path="/authentication" render={(props)=>{
                    let routeProps = props.history;
                    return <Auth 
                        showMemberBlock={this.state.showMemberBlock}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                        routeProps={routeProps}
                    />;
                }} />
                <Route exact path={path} >
                    <DocCreate 
                        db={this.props.db}
                        realtimeDb={this.props.realtimeDb}
                        storage={this.props.storage}
                        docId={docId}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                     />
                </Route>
                <Route exact path={accountPath} >
                    <Account
                        db={this.props.db}
                        docId={docId}
                        currentUser={this.props.currentUser}
                        storage={this.props.storage}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />
                </Route>
        </BrowserRouter>     
    }
}
export {Homepage};