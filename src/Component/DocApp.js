import React from 'react';
import {DocBtn} from './DocBtn';
import '../css/DocApp.css';

class DocPrevStep extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return <div className='docPrevStep'>
            <button onClick={this.props.handleEditor}>以訪客登入</button>
            <button onClick={this.props.handleMemberEditor}>以用戶登入</button>
        </div>
    }
}

class DocHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nameValue: ''
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
        return <div className='docHeader'>
            <div className="headerleft">
                <div className="logo"><img src="/images/docicon.png" /></div>
                <div className="docname"><input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} /><button onClick={this.submitName.bind(this)}>Submit</button></div>
                <div className="store-state">
                    <div id="upload-icon" className="upload-icon"><img src={icon} /></div>
                    <div id="upload-text">{save}</div>
                </div>
            </div>
            <div className="headerright">
                <div className="download" ><img src="/images/return.png" onClick={this.download.bind(this)} /></div>
                <div className="online-state"><div><img src="/images/return.png" /></div></div>
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
    }
}


class DocApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false,
            saved: true 
        }
    }
    handleEditor(){
        this.setState({
            isEditor: true
        })  
    }
    handleMemberEditor(){
        let db = this.props.db;
        if(this.props.currentUser){
            alert(this.props.currentUser.uid)
            db.collection('documents').doc(this.props.docId).get()
            .then((doc)=>{
                let editorsList = doc.data().editorsList;
                editorsList.push(this.props.currentUser.uid);
                db.collection('documents').doc(this.props.docId).update({
                    editorsList: editorsList
                })
                this.setState({
                    isEditor: true
                }) 
            }).catch((error)=>{error.message})
        }else{
            alert('Sign in or up first!')
        } 
    }
    detectUpload(issaved){
        console.log(issaved)
        this.setState({
            saved: issaved
        })
    }
    render(){
        let doc;
        if(!this.state.isOwner && !this.state.isEditor && !this.state.isWaitingEditor){
            doc = <div className='doc'></div>
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
                    handleMemberEditor={this.handleMemberEditor.bind(this)}
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
            }else{
                this.setState({
                    isWaitingEditor: true
                })
            }
        }).catch((error)=>{
            console.log(error.message)
        })
    }
}

export {DocApp} ;