import React from 'react';
import {DocBtn} from './DocBtn';
import '../../../css/DocApp.css';

class DocApp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='container'>
            <div className='doc'>
                <DocBtn 
                    docId={this.props.docId}
                    detectUpload={this.props.detectUpload}
                  />
            </div>
        </div>
    }
}
export default DocApp ;