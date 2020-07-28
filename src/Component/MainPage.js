import React from 'react';
import {DocApp} from './DocApp';
import {Auth} from './Auth';
import {ChatApp} from './ChatApp';
import {WebHeader} from './WebHeader';
import '../css/WebHeader.css';

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            saved: true
        }
    }
    detectUpload(issaved){
        console.log(issaved)
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
    render(){
        return <div className="web-header">
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
    }
}
export {MainPage};