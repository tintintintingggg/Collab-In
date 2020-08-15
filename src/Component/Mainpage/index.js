import React from 'react';
import {Redirect} from 'react-router-dom';
import DocApp from './DocApp';
import ChatApp from './ChatApp';
import PrevStep from './PrevStep';
import WebHeader from './WebHeader';
import {LoadingPage} from '../LoadingPage';
import {db, realtimeDb} from '../../utils/firebase';
import '../../css/WebHeader.css';
// redux
import {connect} from 'react-redux';
import * as actionCreators from '../../Redux/actions/action';

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            chatAppBlockIsOpen: true,
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false,
            isUser: null
        }
    }
    detectUpload(isSaved){
        this.props.setDocumentTextSaveSign(isSaved);
    }
    setIdentifyStateOnUser(identify){
        this.setState({
            [identify]: true
        })
    }
    handleChatRoom(){
        this.setState(prevState=>({
            chatAppBlockIsOpen: !prevState.chatAppBlockIsOpen
        }));
    }
    handleEditor(currentUser){
        alert('Hi, '+currentUser.displayName);
        db.collection('documents').doc(this.props.docId).get().then(doc=>{
            let editorsList = doc.data().editorsList;
            editorsList.push(currentUser.uid);
            return db.collection('documents').doc(this.props.docId).update({
                editorsList: editorsList
            })
        }).then(()=>{
            return db.collection('users').doc(currentUser.uid).collection('editordocs').doc(this.props.docId).set({
                id: this.props.docId,
                time: Date.now()
            })
        }).then(()=>{
            return db.collection('chatrooms').doc(this.props.docId).collection('members').doc(currentUser.uid).set({
                time: Date.now(),
                id: currentUser.uid
            })
        }).then(()=>{
            this.setIdentifyStateOnUser('isEditor');
        }).catch((error)=>{console.log(error.message)});
    }
    onlineCheck(uid){
        let url = location.href.toString();
        let docId = url.split('document/')[1];
        if(docId !== undefined){
            let userStatusDatabaseRef = realtimeDb.ref(docId+ '/status/' + uid);
            let docStatusDatabaseRef = realtimeDb.ref(docId+ '/status/')
            let isOfflineForDatabase = {
                state: 'offline',
            };
            let isOnlineForDatabase = {
                state: 'online',
            };
            realtimeDb.ref('.info/connected').on('value', function(snapshot) {
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
                let userStatusFirestoreRef = db.collection("status").doc(docId).collection('online').doc(uid);
                let docStatusFirestoreRef = db.collection("status").doc(docId).collection('online').doc("total");
                let isOfflineForFirestore = {
                    state: 'offline',
                };
                realtimeDb.ref('.info/connected').on('value', function(snapshot) {
                    if (snapshot.val() == false) {
                        userStatusFirestoreRef.set(isOfflineForFirestore);
                        return;
                    };           
                    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(()=>{
                            docStatusDatabaseRef.once("value").then(doc=>{
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
        if(!this.props.user){
            return <Redirect 
                push to={{pathname:"/authentication"}}
             />
        }else{
            this.onlineCheck.bind(this, this.props.user.uid)();
            if(!this.state.isOwner && !this.state.isEditor && !this.state.isWaitingEditor){
                doc = <LoadingPage />
            }else if(this.state.isOwner || this.state.isEditor){
                doc = <div className="web-header">
                        <WebHeader
                            docId={this.props.docId}
                         />
                        <div className="document-layout">
                            <DocApp
                                docId={this.props.docId}
                                detectUpload={this.detectUpload.bind(this)}
                             />
                            <ChatApp
                                chatAppBlockIsOpen={this.state.chatAppBlockIsOpen}
                                docId={this.props.docId}
                                handleChatRoom={this.handleChatRoom.bind(this)}
                             />
                            <div 
                                id="mobile-chatroom-icon" 
                                style={{display: this.state.chatAppBlockIsOpen ? 'none' : 'block'}}
                                onClick={this.handleChatRoom.bind(this)}
                             ><img src="/images/mobile-chat.png" /></div>
                        </div>
                    </div>
            }else if(this.state.isWaitingEditor){
                doc = <div className='doc'>
                    <PrevStep
                        handleEditor={this.handleEditor.bind(this)}
                        docId={this.props.docId}
                     />
                </div>
            }
            return <div>{doc}</div>;
        }
    }
    componentDidMount(){
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            if(this.props.user){
                if(doc.data().owner === this.props.user.uid){
                    this.setIdentifyStateOnUser.call(this, 'isOwner')
                }
                else{
                    let currentEditor = doc.data().editorsList.filter(editor=>(
                        editor === this.props.user.uid
                    ))
                    this.setIdentifyStateOnUser.call(this, currentEditor.length>0 ? 'isEditor' : 'isWaitingEditor')
                }
            }
        })
        .catch((error)=>{
            alert("Your URL is Wrong! Go Check Again")
            console.log(error.message)
        })
    }
}

const mapStateToProps = (store)=>{
    return{
        user: store.userReducer.user,
        saved: store.saveSignReducer.saved
    };
};
export default connect(mapStateToProps, actionCreators)(MainPage);