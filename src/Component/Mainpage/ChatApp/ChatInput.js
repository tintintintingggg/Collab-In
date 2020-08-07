import React from 'react';
import {db} from '../../../utils/firebase';

class ChatInput extends React.Component{
    constructor(props){
        super(props);
        this.input = React.createRef();
        this.state={
            input: null,
            showEmojis: false,
            emojiList: [
                '&#128512;', '&#128513;', '&#128514;','&#129315;', '&#128515;', 
                '&#128516;', '&#128517;', '&#128518;', '&#128521;', '&#128522;',	
                '&#128523;', '&#128526;', '&#128525;', '&#128536;',	'&#128535;',	
                '&#128537;', '&#128538;', '&#128578;', '&#129303;',	'&#129300;',	
                '&#128528;', '&#128529;', '&#128566;', '&#128580;', '&#128527;',	
                '&#128547;', '&#128549;', '&#128558;', '&#129296;', '&#128559;',
                '&#128554;', '&#128555;', '&#128564;', '&#128524;', '&#129299;',	
                '&#128539;', '&#128540;', '&#128541;', '&#129316;', '&#128530;',	
                '&#128531;', '&#128532;', '&#128533;', '&#128579;',	'&#129297;',
                '&#128562;', '&#128577;', '&#128534;', '&#128542;',	'&#128543;',	
                '&#128548;', '&#128546;', '&#128557;', '&#128550;',	'&#128551;',	
                '&#128552;', '&#128553;', '&#128556;', '&#128560;',	'&#128561;',	
                '&#128563;', '&#128565;', '&#128545;', '&#128544;', '&#128519;',	
                '&#129312;', '&#129313;', '&#129317;', '&#128567;',	'&#129298;',	
                '&#129301;', '&#129314;', '&#129319;', '&#128520;',	'&#128127;',	
                '&#128121;', '&#128122;', '&#128128;', '&#128123;',	'&#128125;',	
                '&#128126;', '&#129302;', '&#128169;', '&#128570;',	'&#128568;',	
                '&#128569;', '&#128571;', '&#128572;', '&#128573;',	'&#128576;',	
                '&#128575;', '&#128574;', '&#128584;', '&#128585;', '&#128586;',
                '&#128129;', '&#127995;', '&#127996;', '&#127997;', '&#127998;',	
                '&#127999;', '&#128587;', '&#127995;', '&#127996;', '&#127997;',	
                '&#127998;', '&#127999;',		
            ]
        }
    }
    getInput(e){
        this.setState({
            input: e.target.value
        })
    }
    sendInput(e){
        e.preventDefault();
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
                })
                .catch((error)=>{console.log(error.message)});
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
    render(){
        let emojiList = '';
        if(this.state.showEmojis){
            emojiList = [];
            for(let i = 0; i<this.state.emojiList.length; i++){
                let item = <span 
                    dangerouslySetInnerHTML={{__html: this.state.emojiList[i]+' '}} 
                    key={i}
                    className="my-emoji"
                    onClick={this.pickEmoji.bind(this)}
                    ></span>;
                emojiList.push(item);
            }
        }
        return  <div className="chat-input">
            <div className="emojis" style={{display: this.state.showEmojis ? 'block' : 'none'}}>
                {emojiList}
            </div>
            <button onClick={this.handleEmojisToShow.bind(this)}><img src="/images/chat-input-add.png" /></button>
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
        </div>
    }
}

export {ChatInput};