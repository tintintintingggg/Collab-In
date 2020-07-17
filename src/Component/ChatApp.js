import React from 'react';
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
                    item = <div key={index} className="message-item other-user">
                        <div className="user-pic">{message.name}</div>
                        <div className="message-content">
                            <div className="content-name">{message.name}</div>
                            <div className="content-text">{message.text}</div>
                            <div className="content-time">
                                <div><img src="/images/user.png" /></div>
                                {hour+':'+minute}
                            </div>
                        </div>
                    </div>
                }else{
                    item = <div key={index} className="message-item myself">
                        <div className="message-content">
                            <div className="content-name">{message.name}</div>
                            <div className="content-text">{message.text}</div>
                            <div className="content-time">
                                <div><img src="/images/user.png" /></div>
                                {hour+':'+minute}
                            </div>
                        </div>
                        <div className="user-pic">{message.name}</div>
                    </div>
                }
                content.push(item)
            })
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
    sendInput(){
        let db = this.props.db;
        if(this.props.currentUser){
            if(this.state.input){
                this.input.current.value = null;
                db.collection('chatrooms').doc(this.props.docId).collection('messages').doc().set({
                    user: this.props.currentUser.uid,
                    name: this.props.currentUser.displayName,
                    text: this.state.input,
                    time: Date.now()
                })
                .then(()=>{
                    this.setState({
                        input: null
                    })
                }).catch((error)=>{alert(error)})
            }else{
                alert("you don't type anything")
            }
        }else{
            alert('not log in')
        }
    }
    render(){
        return  <div className="chat-input">
            <div className="flex-left"></div>
            <div className="flex-right">
                <div>+</div>
                {/* <form> */}
                <textarea 
                    type="text" 
                    placeholder="Type something..." 
                    onChange={this.getInput.bind(this)}
                    ref={this.input}
                 />
                
                <div onClick={this.sendInput.bind(this)}>send</div>
            </div> 
        </div>
    }
}

class ChatHeader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let members = '1'
        return <div className="chat-header">
            <div className="flex-left"></div>
            <div className="flex-right">
                {/* <div className="shrink-btn"><img src="/images/collapse.png" /></div> */}
                <div className="group-members">Members ({members})</div>
            </div>
        </div>
    }
    // componentDidMount(){
    //     let db = this.props.db;
    //     db.collection('chatrooms').doc(this.props.docId).collection('members')
    //     .then((doc)=>{
    //         console.log(doc.data())
    //     }).catch((error)=>{console.log(error.message)})
    // }
}

class ChatApp extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div className='chat-app'>
            <ChatHeader
                db={this.props.db}
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
            <div className="chat-main">
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
        </div>
    }
}

export {ChatApp};