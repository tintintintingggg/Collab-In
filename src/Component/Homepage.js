import React from 'react';
import {Auth} from './Auth';
import {MainPage} from './MainPage';
import {Account} from './Account';
import { BrowserRouter, Route, Link ,Redirect} from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";
import '../css/Homepage.css';

class Main extends React.Component{
    constructor(props){
        super(props);
        this.header = React.createRef();
        this.slide = React.createRef();
        this.state={
            scrollTop: 0
        }
    }
    addClassOnscroll(el){
        let rect = el.getBoundingClientRect();
        if(rect.top >= 0 && rect.bottom-420 <= (window.innerHeight || document.documentElement.clientHeight)){
            el.classList.add('main-pic-in-viewport');
        }else{
            el.classList.remove('main-pic-in-viewport');
        }
    }
    handleScroll(e){
        if(this.header.current){
            if(window.scrollY>0){
                this.header.current.classList.add('sticky');
            }else{
                this.header.current.classList.remove('sticky');
            }
        }
        if(document.getElementById('main-pic')){
            let mainPic = document.getElementById('main-pic');
            this.addClassOnscroll(mainPic);
        }
    }
    handleSlide(){
        let counter = 0;
        let slideContainer = document.getElementById('slide-container');
        let slider = document.getElementById('homepage-slide');
        let slides = document.getElementById('homepage-slide').childNodes;
        let slideDots = document.getElementById('slide-dots').childNodes;
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
        setInterval(()=>{plusSlides(counter)}, 4000)
        // intro text animation
        window.setTimeout(()=>{
            document.getElementById('animation1').setAttribute('style', 'margin-top: 0px');
            document.getElementById('animation1').setAttribute('style', 'opacity: 1');
            window.setTimeout(()=>{
                document.getElementById('animation2').setAttribute('style', 'margin-top: 0px');
                document.getElementById('animation2').setAttribute('style', 'opacity: 1');  
                window.setTimeout(()=>{
                    document.getElementById('animation3').setAttribute('style', 'margin-top: 0px');
                    document.getElementById('animation3').setAttribute('style', 'opacity: 1');   
                }, 500)
            }, 500)
        }, 500)
    }

    render(){
        let helloMessage = '';
        if(this.props.currentUser && this.props.currentUser.displayName){
            helloMessage = 'Hi! '+this.props.currentUser.displayName;
        }

        let memberNav;let memberBtn;let memberImg;
        if(this.props.currentUser){
            memberNav = <div className="memberNav" >
                <div><Link to={`/account/${this.props.currentUser.uid}`}>My Account</Link></div>
                <div onClick={this.props.signOut}>Sign Out</div>
            </div>
            memberBtn = <button id="member-btn"><Link to={`/account/${this.props.currentUser.uid}`}>
                See My Documents</Link></button>
            memberImg = <img src="/images/member-hover.png" />
        }else{
            memberNav = <div className="memberNav" >
                <div><Link to="/authentication">My Account</Link></div>
                <div><Link to="/authentication">Sign In / Up</Link></div>
            </div>
            memberBtn = <Link to="/authentication">
                <button id="member-btn">Sign In / Up Now</button>
            </Link>
            memberImg = <img src="/images/member.png" />
        }

        return <div className="homepage-wrap">
                <header ref={this.header}>
                    <header>
                        <div className="logo"><a href="/">CollabIn</a></div>
                        <div className="nav">
                            <a href="#nav-features" >Features</a>
                            <a href="#nav-about">About</a>
                            <a href="#">Back to Top</a>
                            <a href={"mailto:st920090st920090@gmail.com?subject=Contact with CollabIn!"}>Contact Us</a>
                            {/* {helloMessage} */}
                            <div className="member">
                                {memberImg}
                                {memberNav}
                            </div>
                        </div>
                    </header>
                </header>
            <div className="background" style={{backgroundImage: "url('/images/background.png')"}}>
                <div className="homepage section1">
                    <main className="introduction">
                        <div className="intro-text">
                            <div id="animation1" className="title" style={{marginTop: '200px', opacity: '0'}}>Welcome to Collab-In!</div>
                            <div id="animation2" className="intro-lines" style={{marginTop: '200px', opacity: '0'}}>Let's start to create a new document, Let's start to create a new document, Let's start to create a new document, Let's start to create</div>
                            <div id="animation3" className="btns" style={{marginTop: '200px', opacity: '0'}}>
                                <button id="create-doc-btn" onClick={this.props.handleDocCreate}>Create a New Doc</button>
                                {memberBtn}
                            </div>
                        </div>
                    </main>
                    <section className="main-pic" id="main-pic"><img src="/images/main.png" /></section>
                </div>
            </div>
            <div className="section2" id="nav-features">
                <main>
                    <div className="title">Features</div>
                    <div id="slide-container">
                        <div id="homepage-slide" className="slide" ref={this.slide}>
                            <div><img className='img1' src="/images/collaborate.png" /><div>Collaborate on Documents</div></div>
                            <div><img className='img2' src="/images/format.png" /><div>Format Documents</div></div>
                            <div><img className='img3' src="/images/share-docs.png" /><div>Share Documents</div></div>
                            <div><img className='img4' src="/images/chat.png" /><div>Online Chatrooms</div></div>
                            {/* clone */}
                            <div className="clone"><img className='img1' src="/images/collaborate.png" /><div>Collaborate on Documents</div></div>
                            <div className="clone"><img className='img2' src="/images/format.png" /><div>Format Documents</div></div>
                            <div className="clone"><img className='img3' src="/images/share-docs.png" /><div>Share Documents</div></div>
                            <div className="clone"><img className='img4' src="/images/chat.png" /><div>Online Chatrooms</div></div>
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
            <div className="section3" id="nav-about">
                <main>
                    <article>
                        <p>Co-working</p>
                        <main>I don't know</main>
                        <div>I don't knowI don't knowI don't knowI don't know</div>
                    </article>
                    <div>
                        <img src="/images/co-working.png" />
                    </div>
                </main>
                <main>
                    <div>
                        <img src="/images/edit-text.jpg" />
                    </div>
                    <article>
                        <p>Edit Document Online</p>
                        <main>I don't know</main>
                        <div>I don't knowI don't knowI don't knowI don't know</div>
                    </article>
                </main>
                <main>
                    <article>
                        <p>Manager docs</p>
                        <main>I don't know</main>
                        <div>I don't knowI don't knowI don't knowI don't know</div>
                    </article>
                    <div>
                        <img src="/images/manager.jpg" />
                    </div>
                </main>
            </div>
        </div>
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll.bind(this))
        window.addEventListener('load', this.handleSlide.bind(this)())
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        // window.removeEventListener('load', this.handleSlide.bind(this));
    };
}

class DocCreate extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <MainPage
                db={this.props.db}
                realtimeDb={this.props.realtimeDb}
                storage={this.props.storage}
                docId={this.props.docId}
                currentUser={this.props.currentUser}

                signUp={this.props.signUp}
                signIn={this.props.signIn}
                googleSignIn={this.props.googleSignIn}
                facebookSignIn={this.props.facebookSignIn}
             />
    }
}

class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            docName: null,
            docId: null,
            showMemberBlock: false,
            showCreateDoc: false,
            username: null,
            currentUser: null,
            landingPage: '/'
        }
    }
    handleLandingPage(landingPage){
        this.setState({
            landingPage: landingPage
        })
    }
    handleDocCreate(){
        if(this.props.currentUser){
            let db = this.props.db;
            // 建立文件基本資料
            let newDoc = db.collection("documents").doc();
            console.log(newDoc.id);
            newDoc.set({
                name: 'Untitled document',
                owner: this.props.currentUser.uid,
                time: Date.now(),
                text: '',
                version: 0,
                editorsList: []
            })
            .then(()=>{
                // 建立user擁有的文件
                let userDoc = db.collection('users').doc(this.props.currentUser.uid)
                userDoc.collection("userdocs").doc(newDoc.id).set({
                    time: Date.now()
                })
                .then(()=>{
                    console.log('userdoc is set')
                    // 建立chatroom成員（擁有者本人）
                    let chatroomMembers = db.collection('chatrooms').doc(newDoc.id)
                    .collection('members').doc(this.props.currentUser.uid)
                    chatroomMembers.set({
                        time: Date.now(),
                        id: this.props.currentUser.uid
                    })
                    .then(()=>{
                        console.log('chatroom member is set')
                        // 建立status空array
                        db.collection('status').doc(newDoc.id).collection('online').doc("total").set({
                            total: []
                        })
                        .then(()=>{
                            console.log('status total is set')
                            this.setState({docId: newDoc.id})
                        })
                        .catch((error)=>{error.message})
                    })
                    .catch((error)=>{error.message})
                })
                .catch(console.log('userdoc is fail'))
            })
            .catch(console.log('data set fail!'))
        }else{
            alert("Sign-In First!");
        }
        
    }
    render(){
        let path = '/document/';
        let docId;
        let url = location.href.toString();
        let id = url.split('document/')[1];
        if(id){
            docId = id
            path = path+docId
        }else{
            if(this.state.docId){
                docId = this.state.docId;
                path = path+docId
            }
        }
        let accountPath = '/account/'
        if(this.props.currentUser){
            accountPath = '/account/'+this.props.currentUser.uid
        }
        return <BrowserRouter>
                <Route exact path='/' >
                    {docId ? <Redirect to={path} /> : <Main
                        currentUser={this.props.currentUser}
                        signOut={this.props.signOut}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />}
                </Route>
                <Route path="/authentication" render={(props)=>{
                    let routeProps = props.history;
                    return <Auth 
                        showMemberBlock={this.state.showMemberBlock}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                        landingPage={this.state.landingPage}
                        routeProps={routeProps}
                    />;
                }} />
                <Route exact path={path} >
                    <DocCreate 
                        db={this.props.db}
                        realtimeDb={this.props.realtimeDb}
                        storage={this.props.storage}
                        docId={docId}
                        currentUser={this.props.currentUser}
                        signUp={this.props.signUp}
                        signIn={this.props.signIn}
                        googleSignIn={this.props.googleSignIn}
                        facebookSignIn={this.props.facebookSignIn}
                     />
                </Route>
                <Route exact path={accountPath} >
                    <Account
                        db={this.props.db}
                        docId={docId}
                        currentUser={this.props.currentUser}
                        storage={this.props.storage}
                        handleDocCreate={this.handleDocCreate.bind(this)}
                     />
                </Route>
        </BrowserRouter>     
    }

    componentDidMount(){
        let url = location.href.toString();
        let id = url.split('document/')[1];
        if(id){
            this.handleLandingPage.call(this, '/document/'+id);
        }else{
            this.handleLandingPage.call(this, '/');
        }
    }
}
export {Homepage};
// pic attribute
// <a href="https://stories.freepik.com/">Illustration by Stories by Freepik</a>
// <a href='https://www.freepik.com/free-photos-vectors/design'>Design vector created by stories - www.freepik.com</a>