import React from 'react';
import HomepageHeader from './HomepageHeader';
import HomepageBackground from './HomepageBackground';
import HomepageFeature from './HomepageFeature';
import HomepageAbout from './HomepageAbout';
// redux
import {connect} from 'react-redux';
import * as actionCreators from '../../../Redux/actions/action';

class HomepageContent extends React.Component{
    constructor(props){
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }
    handleHeaderScroll(){
        let isHeaderFixed = (window.scrollY>0 ? true : false);
        this.props.handleHeaderFixed(isHeaderFixed);
    }
    handleScroll(){
        this.handleHeaderScroll.bind(this)();
    }
    render(){
        return <div className="homepage-wrap">
            <HomepageHeader
                signOut={this.props.signOut}
                isHeaderFixed={this.props.isHeaderFixed}
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

const mapStateToProps = (store)=>{
    return{
        isHeaderFixed: store.isHeaderFixedReducer.isHeaderFixed
    };
};
export default connect(mapStateToProps, actionCreators)(HomepageContent);