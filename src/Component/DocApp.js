import React from 'react';
import {DocBtn} from './DocBtn';
import '../css/DocApp.css';

class DocApp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='container'>
            <div className='doc'>
                <DocBtn 
                    db={this.props.db} 
                    docId={this.props.docId}
                    storage={this.props.storage}
                    currentUser={this.props.currentUser}
                    detectUpload={this.props.detectUpload}
                  />
            </div>
        </div>
    }
}
export {DocApp} ;