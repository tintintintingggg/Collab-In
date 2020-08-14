import React from 'react';
import {Auth} from '../Auth';
import MainPage from '../Mainpage';
import Account from '../Account';
import HomepageContent from './HomepageContent/HomepageContent';
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import {db} from '../../utils/firebase';
import '../../css/Homepage.css';
// redux
import {connect} from 'react-redux';
import store from '../../Redux/userData/store';

class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.setDocId = this.setDocId.bind(this);
        this.setAccountUid = this.setAccountUid.bind(this);
        this.state = {
            docId: null
        }
    }
    handleDocCreate(){
        if(this.props.user){
            let uid = this.props.user.uid;
            let newDoc = db.collection("documents").doc();
            newDoc.set({
                name: 'Untitled document',
                owner: uid,
                time: Date.now(),
                text: ' ',
                version: 0,
                editorsList: []
            }).then(()=>{
                return db.collection('users').doc(uid).collection("userdocs").doc(newDoc.id).set({
                    time: Date.now()
                })
            }).then(()=>{
                console.log('userdoc is set')
                return db.collection('chatrooms').doc(newDoc.id).collection('members').doc(uid).set({
                    time: Date.now(),
                    id: uid
                })
            }).then(()=>{
                console.log('chatroom member is set');
                return db.collection('status').doc(newDoc.id).collection('online').doc("total").set({
                    total: []
                })
            }).then(()=>{
                console.log('status total is set')
                this.setState({docId: newDoc.id});
            }).catch((error)=>{console.log(error.message)})
        }else{
            alert("Sign In First!");
        }
    }
    setDocId(currentId, newId){
        if(currentId){
            return currentId;
        }else if(newId){
            return newId;
        }else{
            return null;
        }
    }
    setAccountUid(currentUser){
        let uid = currentUser ? currentUser.uid : '';
        return uid;
    }
    render(){
        let id = location.href.toString().split('document/')[1];
        let docId = this.setDocId(id, this.state.docId);
        let path = '/document/'+this.setDocId(id, this.state.docId);
        let accountPath = '/account/'+this.setAccountUid(this.props.user);
        return <BrowserRouter>
                <Route exact path='/' >
                    {docId ? <Redirect to={path} /> : 
                    <HomepageContent
                        signOut={this.props.signOut}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />}
                </Route>
                <Route path="/authentication" render={(props)=>{
                    let routeProps = props.history;
                    return <Auth 
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                        routeProps={routeProps}
                    />;
                }} />
                <Route exact path={path} >
                    <MainPage
                        docId={docId}
                     />
                </Route>
                <Route exact path={accountPath} >
                    <Account
                        docId={docId}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />
                </Route>
            </BrowserRouter>     
    }
}

const mapStateToProps = (store)=>{
    return{user: store.user};
};
export default connect(mapStateToProps)(Homepage)