import React from "react";
import ChatContent from "./ChatContent";
import ChatHeader from "./ChatHeader";
import {ChatInput} from "./ChatInput";
import "../../../css/ChatApp.css";

class ChatApp extends React.Component{
  constructor(props){
    super(props);
    this.chatapp = React.createRef();
    this.handleDragChatRoom = this.handleDragChatRoom.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.state={
      startX: null,
      startWidth: null
    };
  }
  getBorder(e){
    let div = this.chatapp.current;
    let rect = div.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let thickness = 5;
    div.style.cursor = x<thickness && x>(-thickness) ? "col-resize" : "default";
  }
  dragging(e){
    let startX = this.state.startX;
    let startWidth = this.state.startWidth;
    let div = this.chatapp.current;
    let parentDivRect = div.parentNode.getBoundingClientRect();
    let parentDivWidth = parentDivRect.right-parentDivRect.left;
    let changingWidth = startX-e.clientX;
    let resizedWidth = (startWidth+changingWidth)*100/parentDivWidth;
    if(resizedWidth<70 && resizedWidth>20){
      div.style.width = resizedWidth+"%";
      div.previousSibling.style.width = (100-resizedWidth)+"%";
    }
  }
  handleDragChatRoom(e){
    this.getBorder(e);
    if(this.state.startX){
      this.dragging(e);
    }
  }
  startDrag(e){
    let div = this.chatapp.current;
    let rect = div.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let thickness = 5;
    if(x<thickness && x>(-thickness)){
      this.setState({
        startX: e.clientX,
        startWidth: rect.right-rect.left
      });
    }
  }
  stopDrag(){
    this.setState({
      startX: null
    });
  }
  render(){
    return <div 
      className='chat-app' 
      id="chat-app" 
      style={{display: this.props.chatAppBlockIsOpen ? "flex" : "none"}}
      ref={this.chatapp}
    >
      <ChatHeader
        docId={this.props.docId}
        handleChatRoom={this.props.handleChatRoom}
      />
      <ChatContent
        docId={this.props.docId}
      />
      <ChatInput 
        docId={this.props.docId}
      />
    </div>;
  }
  componentDidMount(){
    window.addEventListener("mousemove", this.handleDragChatRoom);
    window.addEventListener("mousedown", this.startDrag);
    window.addEventListener("mouseup", this.stopDrag);
  }
  componentWillUnmount(){
    window.removeEventListener("mousemove", this.handleDragChatRoom);
    window.removeEventListener("mousedown", this.startDrag);
    window.removeEventListener("mouseup", this.stopDrag);
  }
}

export default ChatApp;