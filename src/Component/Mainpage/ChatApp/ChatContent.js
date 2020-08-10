import React from 'react';
import {justifyNumberToTwoDigits} from '../lib';
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
    formatDate(time){
        let date = new Date(time).getDate();
        date = justifyNumberToTwoDigits(date);
        let month = new Date(time).toLocaleString('en-us', {month: 'long'});
        let year = new Date(time).getFullYear();
        return {date: date, month: month, year: year};
    }
    showDate(showDataarea, time){
        let data = this.formatDate(time);
        showDataarea = <div className="date-separator" key={time}>{`${data.date}  ${data.month}  ${data.year}`}</div>;
        return showDataarea;
    }
    formatTime(time){
        let hour = new Date(time).getHours();
        hour = justifyNumberToTwoDigits(hour);
        let minute = new Date(time).getMinutes();
        minute = justifyNumberToTwoDigits(minute);
        return hour+':'+minute;
    }
    render(){
        let content = [];
        if(this.state.content.length>0){
            let date;
            this.state.content.forEach((message, index)=>{
                let item;
                let dateSeparator;
                if(!date || date !== new Date(message.time).getDate()){
                    content.push(this.showDate.call(this, dateSeparator, message.time))
                }
                date = new Date(message.time).getDate();
                if(this.props.currentUser.uid !== message.user){
                   let photoSrc = message.photo ? message.photo : '/images/user-1.png';
                    item = <div key={index} className="message-item other-user">
                        <div className="user-pic"><img src={photoSrc} /></div>
                        <div className="message-content">
                            <div className="content-name">{message.name}</div>
                            <div className="text-wrap">
                                <div className="content-text">{message.text}</div>
                                <div className="content-time">
                                    <div><img src="/images/clock.png" /></div>
                                    {this.formatTime.call(this, message.time)}
                                </div>
                            </div>
                        </div>
                    </div>;
                }else{
                    item = <div key={index} className="message-item myself">
                        <div className="message-content">
                            <div className="text-wrap">
                                <div className="content-text">{message.text}</div>
                                <div className="content-time">
                                    <div><img src="/images/clock.png" /></div>
                                    {this.formatTime.call(this, message.time)}
                                </div>
                            </div>
                        </div>
                    </div>;
                }
                content.push(item);
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