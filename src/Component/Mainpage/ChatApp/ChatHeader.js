import React from 'react';
import {db} from '../../../utils/firebase';

class ChatHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            members: [],
            showMembers: false
        }
    }
    showMembers(){
        this.setState(prevState=>({
            showMembers: !prevState.showMembers
        }));
    }
    render(){
        let list = '';
        let membersCount = ' ... ';
        if(this.state.members.length>0){
            let arr=[];
            this.state.members.map(doc=>{
                let item = <div key={doc}>{doc}</div>
                arr.push(item);
            })
            list = arr;
            membersCount = this.state.members.length;
        }
        return <div className="chat-header">
                <div>
                    <div className="shrink-btn" onClick={this.props.handleChatRoom}><img src="/images/minimize.png" /></div>
                    <div className="group-members" onClick={this.showMembers.bind(this)}>Members ({membersCount})</div>
                </div>
                <div className="members-list" style={{display: this.state.showMembers ? 'flex' : 'none'}}
                >{list}</div>
        </div>;
    }
    componentDidMount(){
        this.unsubscribe = db.collection('chatrooms').doc(this.props.docId).collection('members')
        .onSnapshot((snap)=>{
            snap.docChanges().forEach(doc=>{
                if(doc.type === 'added'){
                    db.collection('users').doc(doc.doc.data().id).get()
                    .then(data=>{
                        this.setState(prevState=>({
                            members: prevState.members.concat([data.data().name])
                        }))
                    })
                    .catch((error)=>{console.log(error.message)})
                }
            })
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
}

export default ChatHeader;