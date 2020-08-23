import React from "react";
import {db} from "../../../utils/firebase";
// redux
import {connect} from "react-redux";

class EmojiBtn extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <button onClick={this.props.handleEmojisToShow}>
      <img src="/images/chat-input-add.png" />
    </button>;
  }
}
class EmojiList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      emojiList: [
        "&#128512;", "&#128513;", "&#128514;","&#129315;", "&#128515;", 
        "&#128516;", "&#128517;", "&#128518;", "&#128521;", "&#128522;",	
        "&#128523;", "&#128526;", "&#128525;", "&#128536;",	"&#128535;",	
        "&#128537;", "&#128538;", "&#128578;", "&#129303;",	"&#129300;",	
        "&#128528;", "&#128529;", "&#128566;", "&#128580;", "&#128527;",	
        "&#128547;", "&#128549;", "&#128558;", "&#129296;", "&#128559;",
        "&#128554;", "&#128555;", "&#128564;", "&#128524;", "&#129299;",	
        "&#128539;", "&#128540;", "&#128541;", "&#129316;", "&#128530;",	
        "&#128531;", "&#128532;", "&#128533;", "&#128579;",	"&#129297;",
        "&#128562;", "&#128577;", "&#128534;", "&#128542;",	"&#128543;",	
        "&#128548;", "&#128546;", "&#128557;", "&#128550;",	"&#128551;",	
        "&#128552;", "&#128553;", "&#128556;", "&#128560;",	"&#128561;",	
        "&#128563;", "&#128565;", "&#128545;", "&#128544;", "&#128519;",	
        "&#129312;", "&#129313;", "&#129317;", "&#128567;",	"&#129298;",	
        "&#129301;", "&#129314;", "&#129319;", "&#128520;",	"&#128127;",	
        "&#128121;", "&#128122;", "&#128128;", "&#128123;",	"&#128125;",	
        "&#128126;", "&#129302;", "&#128169;", "&#128570;",	"&#128568;",	
        "&#128569;", "&#128571;", "&#128572;", "&#128573;",	"&#128576;",	
        "&#128575;", "&#128574;", "&#128584;", "&#128585;", "&#128586;",
        "&#128129;", "&#127995;", "&#127996;", "&#127997;", "&#127998;",	
        "&#127999;", "&#128587;", "&#127995;", "&#127996;", "&#127997;",	
        "&#127998;", "&#127999;",		
      ]
    };
  }
  pickEmoji(e){
    this.props.handleInputPlusEmoji(e.target.textContent);
    this.props.handleEmojisToShow();
  }
  render(){
    let emojiList = "";
    if(this.props.showEmojis){
      emojiList = [];
      for(let i = 0; i<this.state.emojiList.length; i++){
        let item = <span 
          dangerouslySetInnerHTML={{__html: this.state.emojiList[i]+" "}} 
          key={i}
          className="my-emoji"
          onClick={this.pickEmoji.bind(this)}
        ></span>;
        emojiList.push(item);
      }
    }
    return <div className="emojis" style={{display: this.props.showEmojis ? "block" : "none"}}>
      {emojiList}
    </div>;
  }
}

class ChatInput extends React.Component{
  constructor(props){
    super(props);
    this.input = React.createRef();
    this.state={
      input: null,
      showEmojis: false
    };
  }
  getInput(e){
    this.setState({
      input: e.target.value
    });
  }
  sendInput(e){
    e.preventDefault();
    if(this.props.user){
      if(this.state.input){
        this.input.current.value = null;
        db.collection("chatrooms").doc(this.props.docId).collection("messages").doc().set({
          user: this.props.user.uid,
          name: this.props.user.displayName,
          photo: this.props.user.photoURL,
          text: this.state.input,
          time: Date.now()
        })
          .then(()=>{
            this.setState({
              input: null
            });
          })
          .catch((error)=>{console.log(error.message);});
      }else{
        alert("Type Something!");
      }
    }
  }
  pickEmoji(e){
    this.input.current.value += e.target.textContent;
    this.setState({
      input: this.input.current.value
    });
    this.handleEmojisToShow();
  }
  handleEmojisToShow(){
    this.setState(prevState=>({
      showEmojis: !prevState.showEmojis
    }));
  }
  handleInputPlusEmoji(emoji){
    this.input.current.value += emoji;
    this.setState({
      input: this.input.current.value
    });
  }
  render(){
    return  <div className="chat-input">
      <EmojiList
        showEmojis={this.state.showEmojis}
        handleEmojisToShow={this.handleEmojisToShow.bind(this)}
        handleInputPlusEmoji={this.handleInputPlusEmoji.bind(this)}
      />
      <EmojiBtn
        handleEmojisToShow={this.handleEmojisToShow.bind(this)}
      />
      <form onSubmit={this.sendInput.bind(this)}>
        <input
          id="chat-input-block"
          type="text" 
          placeholder="Say something..." 
          onChange={this.getInput.bind(this)}
          ref={this.input}
        />
        <button id="chat-input-submit" type="submit"><img src="/images/chat-input-send.png" /></button>
      </form>
    </div>;
  }
}

const mapStateToProps = (store)=>{
  return{user: store.userReducer.user};
};
ChatInput = connect(mapStateToProps)(ChatInput);
export {ChatInput, EmojiList};