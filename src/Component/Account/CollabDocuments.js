import React from 'react';
import {LoadingPage} from '../LoadingPage';
// redux
import {connect} from 'react-redux';

class CollabDocuments extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(!this.props.docDataFromDb){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap collab-documents">
                <header>Collaborate with Me</header>
                <div className="separator-line"></div>
                <main>{this.props.docDataFromDb}</main>
            </div>
        }
    }
    componentDidMount(){
        this.props.getAllDocumensFromDb('editordocs');
    }
}

export default CollabDocuments;