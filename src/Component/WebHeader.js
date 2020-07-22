import React from 'react';
import '../css/WebHeader.css';

class WebHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nameValue: '',
            onlineUser: null
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
        // let colors = ['red','green','blue','yellow','cyan','black']
        let onlineUserName = [];

        let online = '';
        if(this.state.onlineUser){
            for(let i =0; i<this.state.onlineUser.length; i++){
                if(this.state.onlineUser[i] !== null){
                    let item = <div key={i}><div></div>{this.state.onlineUser[i]}</div>
                    onlineUserName.push(item);
                }
            }
            online = <div className="online-state">
                <div className="online-total">
                    <div><img src="/images/online.png" /></div>
                    {this.state.onlineUser.length+" ONLINE"}
                </div>
                <div className="online-list">
                    {onlineUserName}
                </div>
            </div>
        }
        return <div className='docHeader'>
            <div className="headerleft">
                <div className="logo"><img src="/images/docicon.png" /></div>
                <div className="docname">
                    <input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} />
                    <button onClick={this.submitName.bind(this)}><img src="/images/save.png" /></button>
                </div>
                <div className="store-state">
                    <div id="upload-icon" className="upload-icon"><img src={icon} /></div>
                    <div id="upload-text">{save}</div>
                </div>
                
            </div>
            <div className="headerright">
                <div className="download" ><img src="/images/download.png" onClick={this.download.bind(this)} /></div>
                <div className="share">
                    <a href={"mailto:?subject=I wanted you to see this site&body="+window.location.href} title="Share by Email" >
                        <img src="/images/mail.png" alt="Share by Email" />
                    </a>
                </div>
                {online}
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

        db.collection('status').doc(this.props.docId).collection('online').doc("total")
        .onSnapshot((doc)=>{
            let userContainer = [];
            for(let i =0; i<doc.data().total.length; i++){
                db.collection('users').doc(doc.data().total[i]).get()
                .then((data)=>{
                    userContainer.push(data.data().name)
                    this.setState({
                        onlineUser: userContainer
                    })
                })
                .catch((error)=>{console.log(error)})
            }
            
        })        
    }
}

export {WebHeader};