import React from 'react';
import '../css/LoadingPage.css'

class LoadingPage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className="loading-page">
            <div className="loading-box">
                <div className="loading-text">Loading...</div>
            </div>
            {/* <div className="loading-text">Loading...</div> */}
        </div>
    }
}
export {LoadingPage};