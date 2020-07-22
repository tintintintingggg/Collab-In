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
                 />
            </div>
        </div>
    }
}
export {MainPage};