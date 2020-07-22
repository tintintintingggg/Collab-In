import React from 'react';
import {DocBtn} from './DocBtn';
import '../css/DocApp.css';
import { Redirect } from 'react-router-dom';

class DocPrevStep extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='docPrevStep'>
            <div className="container">
                <button onClick={()=>{this.props.handleEditor(this.props.currentUser)}}>Add To Group</button>
            </div>
        </div>
    }
}
class DocApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false,
            isUser: null
            // landingPage: '/document/'+this.props.docId
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
        console.log('uid',uid)
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
                let isOnlineForFirestore = {
                    state: 'online',
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
                                console.log(doc.val())
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
        // if(this.state.isUser===false){
        //     return <Redirect to="/authentication" />
        // }
        if(!this.props.currentUser){
            return <Redirect to="/authentication" />
        }
        this.onlineCheck.bind(this, this.props.currentUser.uid)();
        if(!this.state.isOwner && !this.state.isEditor && !this.state.isWaitingEditor){
            doc = <div className='loading-page'></div>
        }else if(this.state.isOwner || this.state.isEditor){
            doc = <div className='doc'>
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    storage={this.props.storage}
                    currentUser={this.props.currentUser}
                    detectUpload={this.props.detectUpload}
                  />
            </div>
        }else if(this.state.isWaitingEditor){
            doc = <div className='doc'>
                <DocPrevStep 
                    handleEditor={this.handleEditor.bind(this)}
                    currentUser={this.props.currentUser}
                    db={this.props.db} 
                    docId={this.props.docId}
                 />
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    storage={this.props.storage}
                    currentUser={this.props.currentUser}
                    detectUpload={this.props.detectUpload}
                  />
            </div>
        }
        return <div className='container'>
            {doc}
        </div>
    }

    componentDidMount(){
        let db = this.props.db;
        let noname = true;
        // if(!this.props.currentUser){
        //     this.setState({
        //         isUser: false
        //     })
        // }
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

export {DocApp} ;