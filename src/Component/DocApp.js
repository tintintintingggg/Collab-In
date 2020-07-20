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
class DocHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nameValue: '',
            onlineUser: null
        }
    }
    getName(e){
        this.setState({
            nameValue: e.target.value
        })
    }
    submitName(){
        let db = this.props.db;
        db.collection('documents').doc(this.props.docId).update({
            name: this.state.nameValue
        })
        .then(console.log('submit success')).catch(() => {console.log(error.message)})
    }
    download(){
        var link = document.createElement('a');
        link.href = document.getElementById('selectable-area');
        link.download = 'file.pdf';
        link.dispatchEvent(new MouseEvent('click'));
    }    
    render(){
        let save; let icon;
        if(!this.props.saved){
            save = "Saving...";
            icon = "/images/sync.png";
        }else{
            save = "Saved!";
            icon = "/images/cloud-computing.png";
        }
        // let colors = ['red','green','blue','yellow','cyan','black']
        let onlineUserName = [];

        let online = '';
        if(this.state.onlineUser){
            for(let i =0; i<this.state.onlineUser.length; i++){
                if(this.state.onlineUser[i] !== null){
                    let item = <div key={i}><div></div>{this.state.onlineUser[i].substring(1,3)}</div>
                    onlineUserName.push(item);
                }
            }
            online = <div className="online-state">
                <div className="online-total">
                    <div><img src="/images/online.png" /></div>
                    {this.state.onlineUser.length+" ONLINE"}
                </div>
                <div className="online-list">
                    {onlineUserName}
                </div>
            </div>
        }
        return <div className='docHeader'>
            <div className="headerleft">
                <div className="logo"><img src="/images/docicon.png" /></div>
                <div className="docname">
                    <input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} />
                    <button onClick={this.submitName.bind(this)}><img src="/images/save.png" /></button>
                </div>
                <div className="store-state">
                    <div id="upload-icon" className="upload-icon"><img src={icon} /></div>
                    <div id="upload-text">{save}</div>
                </div>
                
            </div>
            <div className="headerright">
                <div className="download" ><img src="/images/download.png" onClick={this.download.bind(this)} /></div>
                <div className="share">
                    <a href={"mailto:?subject=I wanted you to see this site&body="+window.location.href} title="Share by Email" >
                        <img src="/images/mail.png" alt="Share by Email" />
                    </a>
                </div>
                {online}
            </div>
        </div>
    }
    componentDidMount(){
        let db = this.props.db;
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            this.setState({
                nameValue: doc.data().name
            })
        }).catch((error) => {console.log(error.message)})

        db.collection('documents').doc(this.props.docId)
        .onSnapshot((doc) => {
            this.setState({
                nameValue: doc.data().name
            })
        });

        db.collection('status').doc(this.props.docId).collection('online').doc("total")
        .onSnapshot((doc)=>{
            let userContainer = [];
            for(let i =0; i<doc.data().total.length; i++){
                db.collection('users').doc(doc.data().total[i]).get()
                .then((data)=>{
                    userContainer.push(data.data().name)
                    this.setState({
                        onlineUser: userContainer
                    })
                })
                .catch((error)=>{console.log(error)})
            }
            
        })        
    }
}

class DocApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false,
            saved: true,
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
    detectUpload(issaved){
        console.log(issaved)
        this.setState({
            saved: issaved
        })
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
                <DocHeader
                    db={this.props.db} 
                    docId={this.props.docId}
                    saved={this.state.saved}
                 />
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    storage={this.props.storage}
                    currentUser={this.props.currentUser}
                    detectUpload={this.detectUpload.bind(this)}
                  />
            </div>
        }else if(this.state.isWaitingEditor){
            doc = <div className='doc'>
                <DocPrevStep 
                    handleEditor={this.handleEditor.bind(this)}
                    currentUser={this.props.currentUser}
                 />
                <DocHeader
                    db={this.props.db} 
                    docId={this.props.docId}
                    saved={this.state.saved}
                 />
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    storage={this.props.storage}
                    currentUser={this.props.currentUser}
                    detectUpload={this.detectUpload.bind(this)}
                  />
            </div>
        }
        return <div className='container'>
            {doc}
            {/* <div className='loading-page'></div> */}
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