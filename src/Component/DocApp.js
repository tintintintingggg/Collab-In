import React from 'react';
import {DocBtn} from './DocBtn';
import {Auth} from './Auth';
import '../css/DocApp.css';
import { Redirect } from 'react-router-dom';

class DocPrevStep extends React.Component{
    constructor(props){
        super(props);
        // this.state = {
        //     identity: 'none',
        //     guestName: '' 
        // }
    }
    // handleIdentity(identity){
    //     this.setState({
    //         identity: identity,
    //         showMemberBlock: true
    //     })
    // }
    // handleIdentity(identity){
    //     this.setState({
    //         identity: identity
    //     })
    // }
    // getName(e){
    //     this.setState({
    //         guestName: e.target.value
    //     })
    // }
    // handleMemberBlock(){
    //     this.setState({
    //         showMemberBlock: false,
    //         identity: 'none'
    //     })
    // }
    render(){
        // let content;
        // if(this.state.identity === 'none'){
        //    content = <div className="container">
        //         {/* <button onClick={this.props.handleEditor}>以訪客登入</button>
        //             <div></div>
        //         <button onClick={this.props.handleMemberEditor}>以用戶登入</button> */}
        //         {/* <button onClick={()=>{this.handleIdentity('guest')}}>以訪客登入</button>
        //             <div></div>
        //         <button onClick={()=>{this.handleIdentity('user')}}>以用戶登入</button> */}
        //         <button onClick={()=>{this.handleIdentity('user')}}>Add To Group</button>
        //     </div>
        // }else if(this.state.identity === 'guest'){
        //     content = <div className="container">
        //         <label>create a guest name: </label>
        //         <input type="text" onChange={this.getName.bind(this)}  />
        //         <button onClick={()=>{this.props.handleEditor(this.state.guestName)}}>Submit</button>
        //     </div>
        // }else if(this.state.identity === 'user'){
        //     if(!this.props.currentUser){
        //         content = <Auth 
        //         showMemberBlock={this.state.showMemberBlock}
        //         signUp={this.props.signUp}
        //         signIn={this.props.signIn}
        //         googleSignIn={this.props.googleSignIn}
        //         facebookSignIn={this.props.facebookSignIn}
        //         handleMemberBlock={this.handleMemberBlock.bind(this)}
        //      />
        //     }
        // }
        
        return <div className='docPrevStep'>
            <div className="container">
                <button onClick={()=>{this.props.handleEditor(this.props.currentUser)}}>Add To Group</button>
            </div>
            {/* <div>
                <button onClick={this.props.handleEditor}>以訪客登入</button>
                <div></div>
                <button onClick={this.props.handleMemberEditor}>以用戶登入</button>
            </div> */}
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
        if(this.state.onlineUser){
            for(let i =0; i<this.state.onlineUser.length; i++){
                let item = <div className="online-user" key={i}>{this.state.onlineUser[i].substring(1,3)}</div>
                onlineUserName.push(item);
            }
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
                {/* <div className="download" ><img src="/images/return.png" onClick={this.download.bind(this)} /></div> */}
                <div className="online-state">{onlineUserName}</div>
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
            // console.log(doc.data().total)
            let userContainer = [];
            for(let i =0; i<doc.data().total.length; i++){
                db.collection('users').doc(doc.data().total[i]).get()
                .then((data)=>{
                    // console.log(data.data().name)
                    userContainer.push(data.data().name)
                    // console.log(userContainer)
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
            landingPage: '/document/'+this.props.docId
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
            time: Date.now()
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

    render(){
        console.log(this.state.landingPage)
        let doc;
        if(!this.props.currentUser){
            return <Redirect to="/authentication" />
        }
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
                    currentUser={this.props.currentUser}
                    detectUpload={this.detectUpload.bind(this)}
                  />
            </div>
        }else if(this.state.isWaitingEditor){
            doc = <div className='doc'>
                <DocPrevStep 
                    handleEditor={this.handleEditor.bind(this)}
                    currentUser={this.props.currentUser}

                    // signUp={this.props.signUp}
                    // signIn={this.props.signIn}
                    // googleSignIn={this.props.googleSignIn}
                    // facebookSignIn={this.props.facebookSignIn}
                 />
                <DocHeader
                    db={this.props.db} 
                    docId={this.props.docId}
                    saved={this.state.saved}
                 />
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    currentUser={this.props.currentUser}
                    detectUpload={this.detectUpload.bind(this)}
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
        })
    }
}

export {DocApp} ;