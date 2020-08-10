import React from 'react';
import {ChatContent} from './ChatContent';
import {ChatHeader} from './ChatHeader';
import {ChatInput} from './ChatInput';
import '../../../css/ChatApp.css';

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
        }
    }
    getBorder(e){
        let div = this.chatapp.current;
        let rect = div.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let thickness = 5;
        div.style.cursor = x<thickness && x>(-thickness) ? 'col-resize' : 'default';
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
            div.style.width = resizedWidth+'%';
            div.previousSibling.style.width = (100-resizedWidth)+'%';
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
            })
        }
    }
    stopDrag(){
        this.setState({
            startX: null
        })
    }
    render(){
        return <div 
            className='chat-app' 
            id="chat-app" 
            style={{display: this.props.chatAppBlockIsOpen ? 'flex' : 'none'}}
            ref={this.chatapp}
        >
            <ChatHeader
                docId={this.props.docId}
                currentUser={this.props.currentUser}
                handleChatRoom={this.props.handleChatRoom}
             />
             <ChatContent
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
            <ChatInput 
                docId={this.props.docId}
                currentUser={this.props.currentUser}
             />
        </div>
    }
    componentDidMount(){
        window.addEventListener('mousemove', this.handleDragChatRoom)
        window.addEventListener('mousedown', this.startDrag)
        window.addEventListener('mouseup', this.stopDrag)
    }
    componentWillUnmount(){
        window.removeEventListener('mousemove', this.handleDragChatRoom)
        window.removeEventListener('mousedown', this.startDrag)
        window.removeEventListener('mouseup', this.stopDrag)
    }
}

export {ChatApp};





	
	
	
	
	

// 👦	BOY	&#x1F466;	&#128102;	
// 👦🏻	boy, type-1-2	&#x1F466; &#x1F3FB;	&#128102; &#127995;	
// 👦🏼	boy, type-3	&#x1F466; &#x1F3FC;	&#128102; &#127996;	
// 👦🏽	boy, type-4	&#x1F466; &#x1F3FD;	&#128102; &#127997;	
// 👦🏾	boy, type-5	&#x1F466; &#x1F3FE;	&#128102; &#127998;	
// 👦🏿	boy, type-6	&#x1F466; &#x1F3FF;	&#128102; &#127999;	
// 👧	GIRL	&#x1F467;	&#128103;	
// 👧🏻	girl, type-1-2	&#x1F467; &#x1F3FB;	&#128103; &#127995;	
// 👧🏼	girl, type-3	&#x1F467; &#x1F3FC;	&#128103; &#127996;	
// 👧🏽	girl, type-4	&#x1F467; &#x1F3FD;	&#128103; &#127997;	
// 👧🏾	girl, type-5	&#x1F467; &#x1F3FE;	&#128103; &#127998;	
// 👧🏿	girl, type-6	&#x1F467; &#x1F3FF;	&#128103; &#127999;	
// 👨	MAN	&#x1F468;	&#128104;	
// 👨🏻	man, type-1-2	&#x1F468; &#x1F3FB;	&#128104; &#127995;	
// 👨🏼	man, type-3	&#x1F468; &#x1F3FC;	&#128104; &#127996;	
// 👨🏽	man, type-4	&#x1F468; &#x1F3FD;	&#128104; &#127997;	
// 👨🏾	man, type-5	&#x1F468; &#x1F3FE;	&#128104; &#127998;	
// 👨🏿	man, type-6	&#x1F468; &#x1F3FF;	&#128104; &#127999;	
// 👩	WOMAN	&#x1F469;	&#128105;	
// 👩🏻	woman, type-1-2	&#x1F469; &#x1F3FB;	&#128105; &#127995;	
// 👩🏼	woman, type-3	&#x1F469; &#x1F3FC;	&#128105; &#127996;	
// 👩🏽	woman, type-4	&#x1F469; &#x1F3FD;	&#128105; &#127997;	
// 👩🏾	woman, type-5	&#x1F469; &#x1F3FE;	&#128105; &#127998;	
// 👩🏿	woman, type-6	&#x1F469; &#x1F3FF;	&#128105; &#127999;	
// 👴	OLDER MAN ≊ old man	&#x1F474;	&#128116;	
// 👴🏻	old man, type-1-2	&#x1F474; &#x1F3FB;	&#128116; &#127995;	
// 👴🏼	old man, type-3	&#x1F474; &#x1F3FC;	&#128116; &#127996;	
// 👴🏽	old man, type-4	&#x1F474; &#x1F3FD;	&#128116; &#127997;	
// 👴🏾	old man, type-5	&#x1F474; &#x1F3FE;	&#128116; &#127998;	
// 👴🏿	old man, type-6	&#x1F474; &#x1F3FF;	&#128116; &#127999;	
// 👵	OLDER WOMAN ≊ old woman	&#x1F475;	&#128117;	
// 👵🏻	old woman, type-1-2	&#x1F475; &#x1F3FB;	&#128117; &#127995;	
// 👵🏼	old woman, type-3	&#x1F475; &#x1F3FC;	&#128117; &#127996;	
// 👵🏽	old woman, type-4	&#x1F475; &#x1F3FD;	&#128117; &#127997;	
// 👵🏾	old woman, type-5	&#x1F475; &#x1F3FE;	&#128117; &#127998;	
// 👵🏿	old woman, type-6	&#x1F475; &#x1F3FF;	&#128117; &#127999;	
// 👶	BABY	&#x1F476;	&#128118;	
// 👶🏻	baby, type-1-2	&#x1F476; &#x1F3FB;	&#128118; &#127995;	
// 👶🏼	baby, type-3	&#x1F476; &#x1F3FC;	&#128118; &#127996;	
// 👶🏽	baby, type-4	&#x1F476; &#x1F3FD;	&#128118; &#127997;	
// 👶🏾	baby, type-5	&#x1F476; &#x1F3FE;	&#128118; &#127998;	
// 👶🏿	baby, type-6	&#x1F476; &#x1F3FF;	&#128118; &#127999;	
// 👼	BABY ANGEL	&#x1F47C;	&#128124;	
// 👼🏻	baby angel, type-1-2	&#x1F47C; &#x1F3FB;	&#128124; &#127995;	
// 👼🏼	baby angel, type-3	&#x1F47C; &#x1F3FC;	&#128124; &#127996;	
// 👼🏽	baby angel, type-4	&#x1F47C; &#x1F3FD;	&#128124; &#127997;	
// 👼🏾	baby angel, type-5	&#x1F47C; &#x1F3FE;	&#128124; &#127998;	
// 👼🏿	baby angel, type-6	&#x1F47C; &#x1F3FF;	&#128124; &#127999;	
// 👮	POLICE OFFICER	&#x1F46E;	&#128110;	
// 👮🏻	police officer, type-1-2	&#x1F46E; &#x1F3FB;	&#128110; &#127995;	
// 👮🏼	police officer, type-3	&#x1F46E; &#x1F3FC;	&#128110; &#127996;	
// 👮🏽	police officer, type-4	&#x1F46E; &#x1F3FD;	&#128110; &#127997;	
// 👮🏾	police officer, type-5	&#x1F46E; &#x1F3FE;	&#128110; &#127998;	
// 👮🏿	police officer, type-6	&#x1F46E; &#x1F3FF;	&#128110; &#127999;	
// 🕵	SLEUTH OR SPY ≊ detective	&#x1F575;	&#128373;	
// 🕵🏻	detective, type-1-2	&#x1F575; &#x1F3FB;	&#128373; &#127995;	
// 🕵🏼	detective, type-3	&#x1F575; &#x1F3FC;	&#128373; &#127996;	
// 🕵🏽	detective, type-4	&#x1F575; &#x1F3FD;	&#128373; &#127997;	
// 🕵🏾	detective, type-5	&#x1F575; &#x1F3FE;	&#128373; &#127998;	
// 🕵🏿	detective, type-6	&#x1F575; &#x1F3FF;	&#128373; &#127999;	
// 💂	GUARDSMAN	&#x1F482;	&#128130;	
// 💂🏻	guardsman, type-1-2	&#x1F482; &#x1F3FB;	&#128130; &#127995;	
// 💂🏼	guardsman, type-3	&#x1F482; &#x1F3FC;	&#128130; &#127996;	
// 💂🏽	guardsman, type-4	&#x1F482; &#x1F3FD;	&#128130; &#127997;	
// 💂🏾	guardsman, type-5	&#x1F482; &#x1F3FE;	&#128130; &#127998;	
// 💂🏿	guardsman, type-6	&#x1F482; &#x1F3FF;	&#128130; &#127999;	
// 👷	CONSTRUCTION WORKER	&#x1F477;	&#128119;	
// 👷🏻	construction worker, type-1-2	&#x1F477; &#x1F3FB;	&#128119; &#127995;	
// 👷🏼	construction worker, type-3	&#x1F477; &#x1F3FC;	&#128119; &#127996;	
// 👷🏽	construction worker, type-4	&#x1F477; &#x1F3FD;	&#128119; &#127997;	
// 👷🏾	construction worker, type-5	&#x1F477; &#x1F3FE;	&#128119; &#127998;	
// 👷🏿	construction worker, type-6	&#x1F477; &#x1F3FF;	&#128119; &#127999;	
// 👳	MAN WITH TURBAN ≊ person with turban	&#x1F473;	&#128115;	
// 👳🏻	person with turban, type-1-2	&#x1F473; &#x1F3FB;	&#128115; &#127995;	
// 👳🏼	person with turban, type-3	&#x1F473; &#x1F3FC;	&#128115; &#127996;	
// 👳🏽	person with turban, type-4	&#x1F473; &#x1F3FD;	&#128115; &#127997;	
// 👳🏾	person with turban, type-5	&#x1F473; &#x1F3FE;	&#128115; &#127998;	
// 👳🏿	person with turban, type-6	&#x1F473; &#x1F3FF;	&#128115; &#127999;	
// 👱	PERSON WITH BLOND HAIR ≊ blond person	&#x1F471;	&#128113;	
// 👱🏻	blond person, type-1-2	&#x1F471; &#x1F3FB;	&#128113; &#127995;	
// 👱🏼	blond person, type-3	&#x1F471; &#x1F3FC;	&#128113; &#127996;	
// 👱🏽	blond person, type-4	&#x1F471; &#x1F3FD;	&#128113; &#127997;	
// 👱🏾	blond person, type-5	&#x1F471; &#x1F3FE;	&#128113; &#127998;	
// 👱🏿	blond person, type-6	&#x1F471; &#x1F3FF;	&#128113; &#127999;	
// 🎅	FATHER CHRISTMAS ≊ santa claus	&#x1F385;	&#127877;	
// 🎅🏻	santa claus, type-1-2	&#x1F385; &#x1F3FB;	&#127877; &#127995;	
// 🎅🏼	santa claus, type-3	&#x1F385; &#x1F3FC;	&#127877; &#127996;	
// 🎅🏽	santa claus, type-4	&#x1F385; &#x1F3FD;	&#127877; &#127997;	
// 🎅🏾	santa claus, type-5	&#x1F385; &#x1F3FE;	&#127877; &#127998;	
// 🎅🏿	santa claus, type-6	&#x1F385; &#x1F3FF;	&#127877; &#127999;	
// 🤶	MOTHER CHRISTMAS	&#x1F936;	&#129334;	
// 🤶🏻	mother christmas, type-1-2	&#x1F936; &#x1F3FB;	&#129334; &#127995;	
// 🤶🏼	mother christmas, type-3	&#x1F936; &#x1F3FC;	&#129334; &#127996;	
// 🤶🏽	mother christmas, type-4	&#x1F936; &#x1F3FD;	&#129334; &#127997;	
// 🤶🏾	mother christmas, type-5	&#x1F936; &#x1F3FE;	&#129334; &#127998;	
// 🤶🏿	mother christmas, type-6	&#x1F936; &#x1F3FF;	&#129334; &#127999;	
// 👸	PRINCESS	&#x1F478;	&#128120;	
// 👸🏻	princess, type-1-2	&#x1F478; &#x1F3FB;	&#128120; &#127995;	
// 👸🏼	princess, type-3	&#x1F478; &#x1F3FC;	&#128120; &#127996;	
// 👸🏽	princess, type-4	&#x1F478; &#x1F3FD;	&#128120; &#127997;	
// 👸🏾	princess, type-5	&#x1F478; &#x1F3FE;	&#128120; &#127998;	
// 👸🏿	princess, type-6	&#x1F478; &#x1F3FF;	&#128120; &#127999;	
// 🤴	PRINCE	&#x1F934;	&#129332;	
// 🤴🏻	prince, type-1-2	&#x1F934; &#x1F3FB;	&#129332; &#127995;	
// 🤴🏼	prince, type-3	&#x1F934; &#x1F3FC;	&#129332; &#127996;	
// 🤴🏽	prince, type-4	&#x1F934; &#x1F3FD;	&#129332; &#127997;	
// 🤴🏾	prince, type-5	&#x1F934; &#x1F3FE;	&#129332; &#127998;	
// 🤴🏿	prince, type-6	&#x1F934; &#x1F3FF;	&#129332; &#127999;	
// 👰	BRIDE WITH VEIL	&#x1F470;	&#128112;	
// 👰🏻	bride with veil, type-1-2	&#x1F470; &#x1F3FB;	&#128112; &#127995;	
// 👰🏼	bride with veil, type-3	&#x1F470; &#x1F3FC;	&#128112; &#127996;	
// 👰🏽	bride with veil, type-4	&#x1F470; &#x1F3FD;	&#128112; &#127997;	
// 👰🏾	bride with veil, type-5	&#x1F470; &#x1F3FE;	&#128112; &#127998;	
// 👰🏿	bride with veil, type-6	&#x1F470; &#x1F3FF;	&#128112; &#127999;	
// 🤵	MAN IN TUXEDO	&#x1F935;	&#129333;	
// 🤵🏻	man in tuxedo, type-1-2	&#x1F935; &#x1F3FB;	&#129333; &#127995;	
// 🤵🏼	man in tuxedo, type-3	&#x1F935; &#x1F3FC;	&#129333; &#127996;	
// 🤵🏽	man in tuxedo, type-4	&#x1F935; &#x1F3FD;	&#129333; &#127997;	
// 🤵🏾	man in tuxedo, type-5	&#x1F935; &#x1F3FE;	&#129333; &#127998;	
// 🤵🏿	man in tuxedo, type-6	&#x1F935; &#x1F3FF;	&#129333; &#127999;	
// 🤰	PREGNANT WOMAN	&#x1F930;	&#129328;	
// 🤰🏻	pregnant woman, type-1-2	&#x1F930; &#x1F3FB;	&#129328; &#127995;	
// 🤰🏼	pregnant woman, type-3	&#x1F930; &#x1F3FC;	&#129328; &#127996;	
// 🤰🏽	pregnant woman, type-4	&#x1F930; &#x1F3FD;	&#129328; &#127997;	
// 🤰🏾	pregnant woman, type-5	&#x1F930; &#x1F3FE;	&#129328; &#127998;	
// 🤰🏿	pregnant woman, type-6	&#x1F930; &#x1F3FF;	&#129328; &#127999;	
// 👲	MAN WITH GUA PI MAO ≊ man with chinese cap	&#x1F472;	&#128114;	
// 👲🏻	man with chinese cap, type-1-2	&#x1F472; &#x1F3FB;	&#128114; &#127995;	
// 👲🏼	man with chinese cap, type-3	&#x1F472; &#x1F3FC;	&#128114; &#127996;	
// 👲🏽	man with chinese cap, type-4	&#x1F472; &#x1F3FD;	&#128114; &#127997;	
// 👲🏾	man with chinese cap, type-5	&#x1F472; &#x1F3FE;	&#128114; &#127998;	
// 👲🏿	man with chinese cap, type-6	&#x1F472; &#x1F3FF;	&#128114; &#127999;	
// 🙍	PERSON FROWNING	&#x1F64D;	&#128589;	
// 🙍🏻	person frowning, type-1-2	&#x1F64D; &#x1F3FB;	&#128589; &#127995;	
// 🙍🏼	person frowning, type-3	&#x1F64D; &#x1F3FC;	&#128589; &#127996;	
// 🙍🏽	person frowning, type-4	&#x1F64D; &#x1F3FD;	&#128589; &#127997;	
// 🙍🏾	person frowning, type-5	&#x1F64D; &#x1F3FE;	&#128589; &#127998;	
// 🙍🏿	person frowning, type-6	&#x1F64D; &#x1F3FF;	&#128589; &#127999;	
// 🙎	PERSON WITH POUTING FACE ≊ person pouting	&#x1F64E;	&#128590;	
// 🙎🏻	person pouting, type-1-2	&#x1F64E; &#x1F3FB;	&#128590; &#127995;	
// 🙎🏼	person pouting, type-3	&#x1F64E; &#x1F3FC;	&#128590; &#127996;	
// 🙎🏽	person pouting, type-4	&#x1F64E; &#x1F3FD;	&#128590; &#127997;	
// 🙎🏾	person pouting, type-5	&#x1F64E; &#x1F3FE;	&#128590; &#127998;	
// 🙎🏿	person pouting, type-6	&#x1F64E; &#x1F3FF;	&#128590; &#127999;	
// 🙅	FACE WITH NO GOOD GESTURE ≊ person gesturing not ok	&#x1F645;	&#128581;	
// 🙅🏻	person gesturing not ok, type-1-2	&#x1F645; &#x1F3FB;	&#128581; &#127995;	
// 🙅🏼	person gesturing not ok, type-3	&#x1F645; &#x1F3FC;	&#128581; &#127996;	
// 🙅🏽	person gesturing not ok, type-4	&#x1F645; &#x1F3FD;	&#128581; &#127997;	
// 🙅🏾	person gesturing not ok, type-5	&#x1F645; &#x1F3FE;	&#128581; &#127998;	
// 🙅🏿	person gesturing not ok, type-6	&#x1F645; &#x1F3FF;	&#128581; &#127999;	
// 🙆	FACE WITH OK GESTURE ≊ person gesturing ok	&#x1F646;	&#128582;	
// 🙆🏻	person gesturing ok, type-1-2	&#x1F646; &#x1F3FB;	&#128582; &#127995;	
// 🙆🏼	person gesturing ok, type-3	&#x1F646; &#x1F3FC;	&#128582; &#127996;	
// 🙆🏽	person gesturing ok, type-4	&#x1F646; &#x1F3FD;	&#128582; &#127997;	
// 🙆🏾	person gesturing ok, type-5	&#x1F646; &#x1F3FE;	&#128582; &#127998;	
// 🙆🏿	person gesturing ok, type-6	&#x1F646; &#x1F3FF;	&#128582; &#127999;	

// 🙇	PERSON BOWING DEEPLY ≊ person bowing	&#x1F647;	&#128583;	
// 🙇🏻	person bowing, type-1-2	&#x1F647; &#x1F3FB;	&#128583; &#127995;	
// 🙇🏼	person bowing, type-3	&#x1F647; &#x1F3FC;	&#128583; &#127996;	
// 🙇🏽	person bowing, type-4	&#x1F647; &#x1F3FD;	&#128583; &#127997;	
// 🙇🏾	person bowing, type-5	&#x1F647; &#x1F3FE;	&#128583; &#127998;	
// 🙇🏿	person bowing, type-6	&#x1F647; &#x1F3FF;	&#128583; &#127999;	
// 🤦	FACE PALM ≊ person facepalming	&#x1F926;	&#129318;	
// 🤦🏻	person facepalming, type-1-2	&#x1F926; &#x1F3FB;	&#129318; &#127995;	
// 🤦🏼	person facepalming, type-3	&#x1F926; &#x1F3FC;	&#129318; &#127996;	
// 🤦🏽	person facepalming, type-4	&#x1F926; &#x1F3FD;	&#129318; &#127997;	
// 🤦🏾	person facepalming, type-5	&#x1F926; &#x1F3FE;	&#129318; &#127998;	
// 🤦🏿	person facepalming, type-6	&#x1F926; &#x1F3FF;	&#129318; &#127999;	
// 🤷	SHRUG ≊ person shrugging	&#x1F937;	&#129335;	
// 🤷🏻	person shrugging, type-1-2	&#x1F937; &#x1F3FB;	&#129335; &#127995;	
// 🤷🏼	person shrugging, type-3	&#x1F937; &#x1F3FC;	&#129335; &#127996;	
// 🤷🏽	person shrugging, type-4	&#x1F937; &#x1F3FD;	&#129335; &#127997;	
// 🤷🏾	person shrugging, type-5	&#x1F937; &#x1F3FE;	&#129335; &#127998;	
// 🤷🏿	person shrugging, type-6	&#x1F937; &#x1F3FF;	&#129335; &#127999;	
// 💆	FACE MASSAGE ≊ person getting massage	&#x1F486;	&#128134;	
// 💆🏻	person getting massage, type-1-2	&#x1F486; &#x1F3FB;	&#128134; &#127995;	
// 💆🏼	person getting massage, type-3	&#x1F486; &#x1F3FC;	&#128134; &#127996;	
// 💆🏽	person getting massage, type-4	&#x1F486; &#x1F3FD;	&#128134; &#127997;	
// 💆🏾	person getting massage, type-5	&#x1F486; &#x1F3FE;	&#128134; &#127998;	
// 💆🏿	person getting massage, type-6	&#x1F486; &#x1F3FF;	&#128134; &#127999;	
// 💇	HAIRCUT ≊ person getting haircut	&#x1F487;	&#128135;	
// 💇🏻	person getting haircut, type-1-2	&#x1F487; &#x1F3FB;	&#128135; &#127995;	
// 💇🏼	person getting haircut, type-3	&#x1F487; &#x1F3FC;	&#128135; &#127996;	
// 💇🏽	person getting haircut, type-4	&#x1F487; &#x1F3FD;	&#128135; &#127997;	
// 💇🏾	person getting haircut, type-5	&#x1F487; &#x1F3FE;	&#128135; &#127998;	
// 💇🏿	person getting haircut, type-6	&#x1F487; &#x1F3FF;	&#128135; &#127999;	
// 🚶	PEDESTRIAN ≊ person walking	&#x1F6B6;	&#128694;	
// 🚶🏻	person walking, type-1-2	&#x1F6B6; &#x1F3FB;	&#128694; &#127995;	
// 🚶🏼	person walking, type-3	&#x1F6B6; &#x1F3FC;	&#128694; &#127996;	
// 🚶🏽	person walking, type-4	&#x1F6B6; &#x1F3FD;	&#128694; &#127997;	
// 🚶🏾	person walking, type-5	&#x1F6B6; &#x1F3FE;	&#128694; &#127998;	
// 🚶🏿	person walking, type-6	&#x1F6B6; &#x1F3FF;	&#128694; &#127999;	
// 🏃	RUNNER ≊ person running	&#x1F3C3;	&#127939;	
// 🏃🏻	person running, type-1-2	&#x1F3C3; &#x1F3FB;	&#127939; &#127995;	
// 🏃🏼	person running, type-3	&#x1F3C3; &#x1F3FC;	&#127939; &#127996;	
// 🏃🏽	person running, type-4	&#x1F3C3; &#x1F3FD;	&#127939; &#127997;	
// 🏃🏾	person running, type-5	&#x1F3C3; &#x1F3FE;	&#127939; &#127998;	
// 🏃🏿	person running, type-6	&#x1F3C3; &#x1F3FF;	&#127939; &#127999;	
// 💃	DANCER ≊ woman dancing	&#x1F483;	&#128131;	
// 💃🏻	woman dancing, type-1-2	&#x1F483; &#x1F3FB;	&#128131; &#127995;	
// 💃🏼	woman dancing, type-3	&#x1F483; &#x1F3FC;	&#128131; &#127996;	
// 💃🏽	woman dancing, type-4	&#x1F483; &#x1F3FD;	&#128131; &#127997;	
// 💃🏾	woman dancing, type-5	&#x1F483; &#x1F3FE;	&#128131; &#127998;	
// 💃🏿	woman dancing, type-6	&#x1F483; &#x1F3FF;	&#128131; &#127999;	
// 🕺	MAN DANCING	&#x1F57A;	&#128378;	
// 🕺🏻	man dancing, type-1-2	&#x1F57A; &#x1F3FB;	&#128378; &#127995;	
// 🕺🏼	man dancing, type-3	&#x1F57A; &#x1F3FC;	&#128378; &#127996;	
// 🕺🏽	man dancing, type-4	&#x1F57A; &#x1F3FD;	&#128378; &#127997;	
// 🕺🏾	man dancing, type-5	&#x1F57A; &#x1F3FE;	&#128378; &#127998;	
// 🕺🏿	man dancing, type-6	&#x1F57A; &#x1F3FF;	&#128378; &#127999;	
// 👯	WOMAN WITH BUNNY EARS ≊ people partying	&#x1F46F;	&#128111;	
// 🕴	MAN IN BUSINESS SUIT LEVITATING	&#x1F574;	&#128372