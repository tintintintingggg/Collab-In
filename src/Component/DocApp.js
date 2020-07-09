import React from 'react';
import {DocBtn} from './DocBtn';

class DocPrevStep extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return <div className='docPrevStep'>
            <button onClick={this.props.handleEditor}>以訪客登入</button>
            <button onClick={this.props.handleMemberEditor}>以用戶登入</button>
            {/* <button></button> */}
        </div>
    }
}

class DocApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOwner: false,
            isWaitingEditor: false,
            isEditor: false
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
            db.collection('documents').doc(this.props.docId).collection('editors').doc(this.props.currentUser.uid).set({
                name: this.props.currentUser.displayName
            })
        }
        this.setState({
            isEditor: true
        })  
    }
    render(){
        let doc;
        if(!this.state.isOwner && !this.state.isEditor && !this.state.isWaitingEditor){
            doc = <div className='doc'></div>
        }else if(this.state.isOwner || this.state.isEditor){
            doc = <div className='doc'>
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    currentUser={this.props.currentUser}
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
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            if(this.props.currentUser){
                if(doc.data().owner === this.props.currentUser.uid){
                    this.setState({
                        isOwner: true
                    })
                }
                // else if(doc.collection('editors').doc(this.props.currentUser.uid){}
                else{
                    this.setState({
                        isWaitingEditor: true
                    })
                }
            }else{
                console.log('hope here')
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