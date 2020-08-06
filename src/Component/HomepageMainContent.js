import React from 'react';
import { Link } from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
import '../css/Homepage.css';

class HomepageWrapHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mobileSidebarIsOpen: false
        }
    }
    handleSideNav(){
        this.setState(prevState=>({
            mobileSidebarIsOpen: !prevState.mobileSidebarIsOpen
        }))
    }
    render(){
        let mobileSidebarIsOpen = this.state.mobileSidebarIsOpen;
        let memberNav,memberImg;
        if(this.props.currentUser){
            memberImg = <img src="/images/member-hover.png" />
            memberNav = <div className="memberNav" >
                <div><Link to={`/account/${this.props.currentUser.uid}`}>My Account</Link></div>
                <div onClick={this.props.signOut}>Sign Out</div>
            </div>
        }else{
            memberImg = <img src="/images/member.png" />
            memberNav = <div className="memberNav" >
                <div><Link to="/authentication">My Account</Link></div>
                <div><Link to="/authentication">Sign In / Up</Link></div>
            </div>
        }
        return <header className={this.props.isHeaderFixed ? 'sticky' : ''}>
            <header>
                <button onClick={this.handleSideNav.bind(this)}>
                    <img id="sidebar-open" style={mobileSidebarIsOpen ? {display: 'none'} : {display: 'block'}} src="/images/sidebar.png" />
                    <img id="sidebar-close" style={mobileSidebarIsOpen ? {display: 'block'} : {display: 'none'}} src="/images/close-sidebar.png" />
                </button>
                <div className="logo"><a href="/">CollabIn</a></div>
                <div className="nav">
                    <section style={mobileSidebarIsOpen ? {left: '0'} : {left: '-100%'} }>
                        <a onClick={this.handleSideNav.bind(this)} href="#nav-features" >Features</a>
                        <a onClick={this.handleSideNav.bind(this)} href="#nav-about">About</a>
                        <a onClick={this.handleSideNav.bind(this)} href="#">Back to Top</a>
                        <a onClick={this.handleSideNav.bind(this)} href={"mailto:st920090st920090@gmail.com?subject=Contact with CollabIn!"}>Contact Us</a>
                    </section>
                    <div className="member">
                        {memberImg}
                        {memberNav}
                    </div>
                </div>
            </header>
        </header>
    }
}
class HomepageWrapBackground extends React.Component{
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
class HomepageWrapFeature extends React.Component{
    constructor(props){
        super(props);
        this.slideContainer = React.createRef();
        this.handleSlide = this.handleSlide.bind(this);
    }
    handleSlide(){
        let counter = 0;
        let slideContainer = this.slideContainer.current;
        let slider = slideContainer.childNodes[0];
        let slides = slider.childNodes;
        let slideDots = slideContainer.childNodes[1].childNodes;
        let size = slides[0].clientWidth;
        let initSize = size/2;
        slideDots[0].setAttribute('style', 'background-color: #F54F29')
        slideContainer.setAttribute('style', 'max-width: '+size*3+'px');        
        slider.style.transform = 'translateX('+(-initSize)+'px)';
        let plusSlides = (n)=>{
            slideDots.forEach(item=>{item.setAttribute('style', 'background-color: #dddddd')})
            let dotnumber = n+1;
            if(n===3){dotnumber=0}
            if(n===4){dotnumber=1}
            slideDots[dotnumber].setAttribute('style', 'background-color: #F54F29');
            if(n!==4){
                slider.style.transition = 'transform 1s ease-in-out'
                slider.style.transform = 'translateX('+(-(size*(counter+1)+initSize))+'px)';
                counter+=1;
            }else if(n===4){
                slider.style.transition = 'none'
                slider.style.transform = 'translateX('+(-initSize)+'px)';
                window.setTimeout(function(){
                    counter = 0;
                    plusSlides(counter);
                }, 0);
            }
        }
        setInterval(()=>{plusSlides(counter)}, 3000)
    }
    render(){
        return  <div className="section2" id="nav-features">
            <main>
                <div className="title">Features</div>
                <div id="slide-container" ref={this.slideContainer}>
                    <div id="homepage-slide" className="slide">
                        <div><img className='img1' src="/images/collaborate.png" /><div>Collaborative</div></div>
                        <div><img className='img2' src="/images/format.png" /><div>Format Docs</div></div>
                        <div><img className='img3' src="/images/share-docs.png" /><div>Shareable</div></div>
                        <div><img className='img4' src="/images/chat.png" /><div>Live Chat</div></div>
                        {/* clone */}
                        <div className="clone"><img className='img1' src="/images/collaborate.png" /><div>Collaborative</div></div>
                        <div className="clone"><img className='img2' src="/images/format.png" /><div>Format Docs</div></div>
                        <div className="clone"><img className='img3' src="/images/share-docs.png" /><div>Shareable</div></div>
                        <div className="clone"><img className='img4' src="/images/chat.png" /><div>Live Chat</div></div>
                    </div>
                    <div id="slide-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </main>
        </div>
    }
    componentDidMount(){
        window.addEventListener('load', this.handleSlide())
    }
    componentWillUnmount(){
        window.removeEventListener('load', this.handleSlide)
    }
}

class HomepageWrapAbout extends React.Component{
    constructor(props){
        super(props);
        this.aboutContainer = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
    }
    addClassOnscroll(el){
        el.childNodes.forEach((item)=>{
            let rect = item.childNodes[0].getBoundingClientRect();
            if(rect.top >= 0 && rect.bottom-200 <= (window.innerHeight || document.documentElement.clientHeight)){
                item.classList.add('section3-main-in-viewport');
            }
        })
    }
    handleScroll(){
        this.addClassOnscroll(this.aboutContainer.current);
    }
    render(){
        return <div className="section3" id="nav-about" ref={this.aboutContainer}>
            <main className="section3-main">
                <article>
                    <p>Co-working</p>
                    <main>More efficient, more flexible</main>
                    <div>Just click a share button and everything is there! Collab-In provides a shared platform where you could collaborate with team members for projects or assignments in any time and in any places!</div>
                </article>
                <div>
                    <img src="/images/co-working.png" />
                </div>
            </main>
            <main className="section3-main  section3-main-middle">
                <div>
                    <img src="/images/edit-text.jpg" />
                </div>
                <article>
                    <p>Format Documents</p>
                    <main>Decorate with personal style</main>
                    <div>Customize your documents with your own style! You can change the color and format every single letter, also upload pictures to anywhere of the whole page. Just edit as you like!</div>
                </article>
            </main>
            <main className="section3-main">
                <article>
                    <p>Live Chat</p>
                    <main>Chating without border</main>
                    <div>Are you tired of switching between Line and Google docs when doing group projects! Collab-In provides you instant messaging function! Now you can discuss and finish your project in the same page! No more annoying swithcing is needed!</div>
                </article>
                <div>
                    <img src="/images/onlinechat.png" />
                </div>
            </main>
        </div>
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
    }
}

class HomepageMainContent extends React.Component{
    constructor(props){
        super(props);
        this.navAbout = React.createRef();
        this.mainpic = React.createRef();
        this.handleScroll = this.handleScroll.bind(this)
        this.state={
            isHeaderFixed: false
        }
    }
    handleHeaderScroll(){
        this.setState({
            isHeaderFixed: (window.scrollY>0 ? true : false)
        })
    }
    // handleScrollAnimation(state){
    //     this.setState(prevState=>({
    //         [state]: !prevState[state]
    //     }))
    // }
    handleScroll(){
        this.handleHeaderScroll.bind(this)();
    }
    render(){
        return <div className="homepage-wrap">
            <HomepageWrapHeader 
                currentUser={this.props.currentUser}
                signOut={this.props.signOut}
                isHeaderFixed={this.state.isHeaderFixed}
             />
            <HomepageWrapBackground
                currentUser={this.props.currentUser}
                handleDocCreate={this.props.handleDocCreate}
             />
            <HomepageWrapFeature />
            <HomepageWrapAbout />
        </div>
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };
}

export {HomepageMainContent};