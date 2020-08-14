import React from 'react';
import {LoadingPage} from '../LoadingPage';
// redux
import {connect} from 'react-redux';

class MyDocuments extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(!this.props.docDataFromDb){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap my-documents">
                <header>My Documents</header>
                <div className="separator-line"></div>
                <main>{this.props.docDataFromDb}</main>
            </div>
        }
    }
    componentDidMount(){
        this.props.getAllDocumensFromDb('userdocs');
    }
}

export default MyDocuments;