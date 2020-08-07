import React from 'react';
import {db} from '../../../utils/firebase';

class ChatContent extends React.Component{
    constructor(props){
        super(props);
        this.chatContent=React.createRef();
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
                let month = new Date(message.time).toLocaleString('en-us', {month: 'long'});
                if(!date || date !== new Date(message.time).getDate()){
                    dateSeparator = <div className="date-separator" key={message.time}>{`${new Date(message.time).getDate()}  ${month}  ${year}`}</div>
                    content.push(dateSeparator)
                }
                date = new Date(message.time).getDate();
                let hour = new Date(message.time).getHours();
                if(hour.toString().length<2){hour = '0'+hour}
                let minute = new Date(message.time).getMinutes()
                if(minute.toString().length<2){minute = '0'+minute}
                if(this.props.currentUser.uid !== message.user){
                    let photoSrc = '/images/user-1.png';
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
        if(this.chatContent.current){
            this.chatContent.current.scrollIntoView(false);
            this.chatContent.current.scrollTop = 9999999999;
        }
        return <div className="chat-content" ref={this.chatContent}>
           {content}
        </div>
    }
    componentDidMount(){
        this.unsubscribe = db.collection('chatrooms').doc(this.props.docId).collection('messages')
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
        let div = this.chatContent.current;
        div.scrollTop = (div.scrollHeight)-(div.clientHeight);
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
}

export {ChatContent};