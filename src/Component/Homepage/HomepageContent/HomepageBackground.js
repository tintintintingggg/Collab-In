import React from 'react';
import { Link } from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";

class HomepageBackground extends React.Component{
    constructor(props){
        super(props);
        this.mainpic = React.createRef();
        this.introText = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.handleOnload = this.handleOnload.bind(this);
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
        el.setAttribute('style', 'margin-top: 0px');
        el.setAttribute('style', 'opacity: 1');
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
        if(this.props.currentUser){
            memberBtn = <button id="member-btn">
                <Link to={`/account/${this.props.currentUser.uid}`}>See My Documents</Link>
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
                        <div className="title" style={{marginTop: '200px', opacity: '0'}}>Welcome to Collab-In!</div>
                        <div className="intro-lines" style={{marginTop: '200px', opacity: '0'}}>
                            Resource-sharing, immediate messaging, Downloadable files. <br />All-in-one platform for real-time task solving and completing.
                        </div>
                        <div className="btns" style={{marginTop: '200px', opacity: '0'}}>
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

export {HomepageBackground};