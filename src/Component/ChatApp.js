import React, { createRef } from 'react';
import '../css/ChatApp.css'

class ChatContent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            content: [],
            isLoading: false
        }
    }
    
    render(){
        let content = [];
        let date;
        if(this.state.content.length>0){
            this.state.content.forEach((message, index)=>{
                let item;
                let dateSeparator;
                let year = new Date(message.time).getFullYear();
                let month = new Date(message.time).getMonth()+1;
                if(!date){
                    dateSeparator = <div className="date-separator" key={message.time}>{`${year} / ${month} / ${new Date(message.time).getDate()}`}</div>
                }else{
                    if(date !== new Date(message.time).getDate()){
                        dateSeparator = <div className="date-separator" key={message.time}>{`${year} / ${month} / ${new Date(message.time).getDate()}`}</div>
                    }
                }
                if(dateSeparator){
                    content.push(dateSeparator)
                }
                date = new Date(message.time).getDate();
                let hour = new Date(message.time).getHours();
                if(hour.toString().length<2){hour = '0'+hour}
                let minute = new Date(message.time).getMinutes()
                if(minute.toString().length<2){minute = '0'+minute}
                if(this.props.currentUser.uid !== message.user){
                    let photoSrc = '/images/chat-user.png';
                    if(message.photo){ photoSrc = message.photo; }
                    
                    item = <div key={index} className="message-item other-user">
                        <div className="user-pic"><img src={photoSrc} /></div>
                        <div className="message-content">
                            <div className="content-name">{message.name}</div>
                            <div className="text-wrap">
                                <div className="content-text">{message.text}</div>
                                <div className="content-time">
                                    <div><img src="/images/clock.png" /></div>
                                    {hour+':'+minute}
                                </div>
                            </div>
                        </div>
                    </div>
                }else{
                    item = <div key={index} className="message-item myself">
                        <div className="message-content">
                            {/* <div className="content-name">{message.name}</div> */}
                            <div className="text-wrap">
                                <div className="content-text">{message.text}</div>
                                <div className="content-time">
                                    <div><img src="/images/clock.png" /></div>
                                    {hour+':'+minute}
                                </div>
                            </div>
                        </div>
                    </div>
                }
                content.push(item)
            })
        }
        if(document.getElementById('chat-app')){
            let div = document.getElementById('chat-app')
            div.scrollIntoView(false)
            // console.log('height',div.scrollTop);
            // console.log('height',div.scrollHeight);
            // console.log('height',div.clientHeight);
            // div.scrollTop = (div.scrollHeight)-(div.clientHeight);
            // div.scrollTop = (div.scrollHeight-82)
            div.scrollTop = 999999999
        }
        return <div className="chat-content">
           {content}
        </div>
    }
    componentDidMount(){
        let db = this.props.db;
        db.collection('chatrooms').doc(this.props.docId).collection('messages')
        .orderBy("time")
        .onSnapshot((snap)=>{
            let arr = [];
            snap.docChanges().forEach(doc=>{
                if(doc.type === 'added'){
                    arr.push(doc.doc.data())
                }
            })
            this.setState(prevState => ({
                isLoading: true,
                content: prevState.content.concat(arr)
            }))
        })
        let div = document.getElementById('chat-app')
        console.log('height',div.scrollTop);
        console.log('height',div.scrollHeight);
        div.scrollTop = (div.scrollHeight)-(div.clientHeight);
    }
}

class ChatInput extends React.Component{
    constructor(props){
        super(props);
        this.input = React.createRef();
        this.state={
            input: null
        }
    }
    getInput(e){
        this.setState({
            input: e.target.value
        })
    }
    sendInput(e){
        e.preventDefault();
        let db = this.props.db;
        if(this.props.currentUser){
            if(this.state.input){
                this.input.current.value = null;
                db.collection('chatrooms').doc(this.props.docId).collection('messages').doc().set({
                    user: this.props.currentUser.uid,
                    name: this.props.currentUser.displayName,
                    photo: this.props.currentUser.photoURL,
                    text: this.state.input,
                    time: Date.now()
                })
                .then(()=>{
                    this.setState({
                        input: null
                    })
                }).catch((error)=>{alert(error)})
            }else{
                alert("You didn't type anything")
            }
        }else{
            alert('not log in')
        }
    }
    render(){
        return  <div className="chat-input">
                <form onSubmit={this.sendInput.bind(this)}>
                    <button><img src="/images/chat-input-add.png" /></button>
                    {/* <div></div> */}
                    <input
                        id="chat-input-block"
                        type="text" 
                        placeholder="Say something..." 
                        onChange={this.getInput.bind(this)}
                        ref={this.input}
                      />
                    {/* <div></div> */}
                    <button id="chat-input-submit" type="submit"><img src="/images/chat-input-send.png" /></button>
                </form>
        </div>
    }
}

class ChatHeader extends React.Component{
    constructor(props){
        super(props);
        this.membersList = React.createRef();
        this.state={
            members: [],
            isLoading: false,
            membersList: []
        }
    }
    showMembers(){
        let db = this.props.db;
        if(this.membersList.current.style.display === 'none'){
            this.membersList.current.style.display = 'flex';
            this.state.members.map(doc=>{
                db.collection('users').doc(doc.id).get()
                .then(data=>{
                    this.setState((prevState)=>({
                        membersList: prevState.membersList.concat([data.data().name])
                    }))
                })
                .catch(error=>{console.log(error.message)})
            })
        }else{
            this.membersList.current.style.display = 'none';
            this.setState({
                membersList: []
            })
        }
        
        
    }
    render(){
        let members = ''
        if(this.state.isLoading){
            members = this.state.members.length
        }
        let list = ''
        if(this.state.membersList.length>0){
            let arr=[];
            this.state.membersList.map(doc=>{
                let item = <div key={doc}>{doc}</div>
                arr.push(item);
            })
            list = arr
        }
        return <div className="chat-header">
                <div>
                    {/* <div className="shrink-btn"><img src="/images/collapse.png" /></div> */}
                    <div className="group-members" onClick={this.showMembers.bind(this)}>Members ({members})</div>
                </div>
                <div className="members-list" ref={this.membersList}
                    style={{display: 'none'}}
                >{list}</div>
        </div>
    }
    componentDidMount(){
        let db = this.props.db;
        db.collection('chatrooms').doc(this.props.docId).collection('members')
        .onSnapshot((snap)=>{
            let arr = [];
            snap.docChanges().forEach(doc=>{
                if(doc.type === 'added'){
                    arr.push(doc.doc.data())
                }
            })
            console.log('members', arr)
            this.setState((prevState)=>({
                isLoading: true,
                members: prevState.members.concat(arr)
            }))
        })
    }
}

class ChatApp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='chat-app' id="chat-app">
            <ChatHeader
                db={this.props.db}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
             <ChatContent
                db={this.props.db}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
            <ChatInput 
                db={this.props.db}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
        </div>
    }
}

export {ChatApp};