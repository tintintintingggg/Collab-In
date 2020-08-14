import React from 'react';
import HomepageHeader from './HomepageHeader';
import HomepageBackground from './HomepageBackground';
import HomepageFeature from './HomepageFeature';
import HomepageAbout from './HomepageAbout';

class HomepageContent extends React.Component{
    constructor(props){
        super(props);
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
    handleScroll(){
        this.handleHeaderScroll.bind(this)();
    }
    render(){
        return <div className="homepage-wrap">
            <HomepageHeader
                signOut={this.props.signOut}
                isHeaderFixed={this.state.isHeaderFixed}
             />
            <HomepageBackground
                handleDocCreate={this.props.handleDocCreate}
             />
            <HomepageFeature />
            <HomepageAbout />
        </div>
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };
}

export default HomepageContent;