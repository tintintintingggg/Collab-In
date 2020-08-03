import React from 'react';
import { Redirect } from 'react-router-dom';
import {DocApp} from './DocApp';
import {ChatApp} from './ChatApp';
import {WebHeader} from './WebHeader';
import {LoadingPage} from './LoadingPage';
import '../css/WebHeader.css';

class PrevStep extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='docPrevStep'>
            <div className="container">
                <button 
                    onClick={()=>{this.props.handleEditor(this.props.currentUser)}}
                >Add To Group</button>
            </div>
        </div>
    }
}
class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            saved: true,
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false,
            isUser: null
        }
    }
    detectUpload(issaved){
        this.setState({
            saved: issaved
        })
    }
    handleChatRoom(){
        let chatAppBlock = document.getElementById('chat-app');
        let mobileChatroomIcon = document.getElementById('mobile-chatroom-icon');
        if(chatAppBlock.style.display === 'flex' && mobileChatroomIcon.style.display === 'none'){
            chatAppBlock.style.display = 'none';
            mobileChatroomIcon.style.display = 'block';
        }else if(chatAppBlock.style.display === 'none' && mobileChatroomIcon.style.display === 'block'){
            chatAppBlock.style.display = 'flex';
            mobileChatroomIcon.style.display = 'none'
        }
    }
    handleEditor(currentUser){
        alert('Hi, '+currentUser.displayName)
        let db = this.props.db;
        db.collection('documents').doc(this.props.docId).get()
        .then((doc)=>{
            let editorsList = doc.data().editorsList;
            editorsList.push(currentUser.uid);
            db.collection('documents').doc(this.props.docId).update({
                editorsList: editorsList
            })
        })
        .catch((error)=>{error.message})
        db.collection('users').doc(currentUser.uid).collection('editordocs').doc(this.props.docId).set({
            id: this.props.docId,
            time: Date.now()
        })
        .then(console.log('editors set!'))
        .catch((error)=>{error.message})
        db.collection('chatrooms').doc(this.props.docId).collection('members').doc(currentUser.uid).set({
            time: Date.now(),
            id: currentUser.uid
        })
        .then(()=>{
            console.log('chatroom members set!')
            this.setState({
                isEditor: true
            }) 
        })
        .catch((error)=>{error.message})   
    }
    onlineCheck(uid){
        let url = location.href.toString();
        let docId = url.split('document/')[1];
        // console.log('uid',uid)
        if(docId !== undefined){
            let userStatusDatabaseRef = this.props.realtimeDb.ref(docId+ '/status/' + uid);
            let docStatusDatabaseRef = this.props.realtimeDb.ref(docId+ '/status/')
            let isOfflineForDatabase = {
                state: 'offline',
            };
            let isOnlineForDatabase = {
                state: 'online',
            };
            this.props.realtimeDb.ref('.info/connected').on('value', function(snapshot) {
                if (snapshot.val() == false) {
                    return;
                };
                userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase)
                .then(function() {
                    userStatusDatabaseRef.set(isOnlineForDatabase);
                });
            });

            //////
            if(uid !== null){
                let userStatusFirestoreRef = this.props.db.collection("status").doc(docId).collection('online').doc(uid);
                let docStatusFirestoreRef = this.props.db.collection("status").doc(docId).collection('online').doc("total");
                let isOfflineForFirestore = {
                    state: 'offline',
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
                                // console.log(doc.val())
                                let data = doc.val();
                                let arr = []
                                for(let prop in data){
                                    if(data[prop]["state"] === 'online'){
                                        arr.push(prop)
                                    }
                                }
                                docStatusFirestoreRef.set({
                                    total: arr
                                })
                                userStatusDatabaseRef.set(isOnlineForDatabase);
                            })
                        });
                });
            }
        }
    }
    render(){
        let doc;
        if(!this.props.currentUser){
            return <Redirect 
                push to={{pathname:"/authentication"}}
                 />
        }else{
            this.onlineCheck.bind(this, this.props.currentUser.uid)();
            if(!this.state.isOwner && !this.state.isEditor && !this.state.isWaitingEditor){
                doc = <LoadingPage />
            }else if(this.state.isOwner || this.state.isEditor){
                doc = <div className="web-header">
                        <WebHeader
                            db={this.props.db}
                            realtimeDb={this.props.realtimeDb}
                            docId={this.props.docId}
                            currentUser={this.props.currentUser}
                            saved={this.state.saved}
                         />
                        <div className="document-layout">
                            <DocApp
                                db={this.props.db}
                                realtimeDb={this.props.realtimeDb}
                                storage={this.props.storage}
                                docId={this.props.docId}
                                currentUser={this.props.currentUser}
                                detectUpload={this.detectUpload.bind(this)}

                                signUp={this.props.signUp}
                                signIn={this.props.signIn}
                                googleSignIn={this.props.googleSignIn}
                                facebookSignIn={this.props.facebookSignIn}
                             />
                            <ChatApp
                                db={this.props.db}
                                realtimeDb={this.props.realtimeDb}
                                storage={this.props.storage}
                                docId={this.props.docId}
                                currentUser={this.props.currentUser}
                                handleChatRoom={this.handleChatRoom.bind(this)}
                             />
                            <div 
                                id="mobile-chatroom-icon" 
                                style={{display: 'none'}} 
                                onClick={this.handleChatRoom.bind(this)}
                             ><img src="/images/mobile-chat.png" /></div>
                        </div>
                    </div>
            }else if(this.state.isWaitingEditor){
                doc = <div className='doc'>
                    <PrevStep
                        handleEditor={this.handleEditor.bind(this)}
                        currentUser={this.props.currentUser}
                        db={this.props.db} 
                        docId={this.props.docId}
                     />
                </div>
            }
            return <div>{doc}</div>
        }
    }
    componentDidMount(){
        let db = this.props.db;
        let noname = true;
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            if(this.props.currentUser){
                if(doc.data().owner === this.props.currentUser.uid){
                    this.setState({
                        isOwner: true
                    })
                }
                else{
                    for(let i = 0; i<doc.data().editorsList.length; i++){
                        if(doc.data().editorsList[i] === this.props.currentUser.uid){
                            this.setState({
                                isEditor: true
                            })
                            noname = false;
                            break;
                        }
                    }
                    if(noname){
                        this.setState({
                            isWaitingEditor: true
                        })
                    }
                }
            }
        })
        .catch((error)=>{
            alert("Your URL is Wrong! Go Check Again")
            console.log(error.message)
        })
    }
}
export {MainPage};