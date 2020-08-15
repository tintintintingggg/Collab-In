import React from 'react';
import {Link} from "react-router-dom";
// redux
import {connect} from 'react-redux';

class HomepageBackground extends React.Component{
    constructor(props){
        super(props);
        this.mainpic = React.createRef();
        this.introText = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.handleOnload = this.handleOnload.bind(this);
        this.state={
            orginalStyle:{
                marginTop: '200px',
                opacity: '0'
            },
            animationStyle:{
                marginTop: '0px',
                opacity: '1'
            }
        }
    }
    handleOnload(){
        this.handleTextAnimation();
    }
    handleTextAnimation(){
        let counter = 0;
        let stopCount = this.introText.current.childNodes.length;
        let timer = window.setInterval(()=>{
            if(counter < stopCount){
                this.setAnimationStyleAttribute(this.introText.current.childNodes[counter])
                counter+=1;
            }else{
                clearInterval(timer);
            }
        }, 500)
    }
    setAnimationStyleAttribute(el){
        el.style = this.state.animationStyle;
    }
    addClassOnscroll(el){
        let rect = el.getBoundingClientRect();
        if(rect.top >= 0 && rect.bottom-400 <= (window.innerHeight || document.documentElement.clientHeight)){
            el.classList.add('main-pic-in-viewport');
        }else{
            el.classList.remove('main-pic-in-viewport');
        }
    }
    handleScroll(){
        this.addClassOnscroll(this.mainpic.current)
    }
    render(){
        let memberBtn;
        if(this.props.user){
            memberBtn = <button id="member-btn">
                <Link to={`/account/${this.props.user.uid}`}>See My Documents</Link>
            </button>
        }else{
            memberBtn = <Link to="/authentication">
                <button id="member-btn">Sign In / Up Now</button>
            </Link>
        }
        return <div className="background" style={{backgroundImage: "url('/images/background.png')"}}>
            <div className="homepage section1">
                <main className="introduction">
                    <div className="intro-text" ref={this.introText}>
                        <div className="title" style={this.state.orginalStyle}>Welcome to Collab-In!</div>
                        <div className="intro-lines" style={this.state.orginalStyle}>
                            Resource-sharing, immediate messaging, Downloadable files. <br />All-in-one platform for real-time task solving and completing.
                        </div>
                        <div className="btns" style={this.state.orginalStyle}>
                            <button id="create-doc-btn" onClick={this.props.handleDocCreate}>Create a New Doc</button>
                            {memberBtn}
                        </div>
                    </div>
                </main>
                <section className="main-pic" id="main-pic" ref={this.mainpic} >
                    <video width="100%" autoPlay='autoplay' muted loop>
                        <source src="/images/main-video.MOV" type="video/mp4" />
                    </video>
                </section>
            </div>
        </div>
    }
    componentDidMount(){
        window.addEventListener('load', this.handleOnload())
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount(){
        window.removeEventListener('load', this.handleOnload)
        window.removeEventListener('scroll', this.handleScroll)
    }
}

const mapStateToProps = (store)=>{
    return{user: store.userReducer.user};
}
export default connect(mapStateToProps)(HomepageBackground);