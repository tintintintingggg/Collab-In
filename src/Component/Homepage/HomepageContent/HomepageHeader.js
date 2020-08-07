import React from 'react';
import { Link } from "react-router-dom";
import "firebase/auth";
import "firebase/firestore";

class HomepageHeader extends React.Component{
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
                    <img id="sidebar-open" style={{display: this.state.mobileSidebarIsOpen ? 'none' : 'block'}} src="/images/sidebar.png" />
                    <img id="sidebar-close" style={{display: this.state.mobileSidebarIsOpen ? 'block' : 'none'}} src="/images/close-sidebar.png" />
                </button>
                <div className="logo"><a href="/">CollabIn</a></div>
                <div className="nav">
                    <section style={{left: this.state.mobileSidebarIsOpen ? '0' : '-100%'}}>
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

export {HomepageHeader};