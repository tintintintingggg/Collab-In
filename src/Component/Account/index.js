import React from 'react';
import '../../css/Account.css';
import MyDocuments from './MyDocuments';
import CollabDocuments from './CollabDocuments';
import AccountSetting from './AccountSetting';
import {db} from '../../utils/firebase';
import {formatTime} from './lib';
// redux
import {connect} from 'react-redux';

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentPage: 'myDocuments',
            docDataFromDb: null,
            userData: null,
            currentPageNavStyle: {
                backgroundColor: '#f4604921',
                borderLeft: '5px solid #f46149',
                color: '#f46149'
            },
            currentPageNavImgStyle: {
                before: {display: 'none'},
                hover: {display: 'flex'}
            },
            navTags: [
                {tagName: 'myDocuments', text: 'My Documents'}, 
                {tagName: 'collabDocuments', text: 'Collaborate with Me'}, 
                {tagName: 'accountSetting', text: 'Account Setting'}
            ]
        }
    }
    handleCurrentPage(state){
        this.setState({
            currentPage: state
        })
    }
    updateUserData(newData){
        this.setState({
            userData: newData
        })
    }
    deleteDocFromState(targetId, callback){
        let newDocDataFromDb = this.state.docDataFromDb.filter(
            doc=>doc.key !== targetId
        );
        this.setState({
            docDataFromDb: newDocDataFromDb
        }, callback);
    }
    deleteDocFromDb(targetId, docType){
        let currentUser = this.props.user;
        db.collection('users').doc(currentUser.uid).collection(docType).doc(targetId).delete().then(()=>{
            // console.log('delete!');
        }).catch((error)=>{console.log(error.message)});
    }
    deleteDoc(e, docType){
        e.preventDefault();
        let targetId = e.target.parentNode.id;
        this.deleteDocFromState(targetId, ()=>{this.deleteDocFromDb(targetId, docType)});
    }
    getAllDocumensFromDb(docType){
        this.setState({
            docDataFromDb: null
        }, ()=>{
            let currentUser = this.props.user;
            let docArr = [];
            let empty = 'No Documents!';
            db.collection('users').doc(currentUser.uid).collection(docType)
            .orderBy('time')
            .get()
            .then((docs)=>{
                if(!docs.empty){
                    docs.forEach(doc=>{
                        db.collection('documents').doc(doc.id).get()
                        .then((data)=>{
                            docArr.push(<a href={`/document/${doc.id}`} key={doc.id} className="document-item">
                                    <section>
                                        <button 
                                            onClick={(e)=>{this.deleteDoc.call(this, e, docType)}} 
                                            id={doc.id}>
                                            <img src="/images/trash.png" />
                                        </button>
                                        <div className="doc-item-name">{data.data().name}</div>
                                        <div className="doc-item-time">{formatTime(data.data().time)}</div>
                                    </section>
                                </a>);
                            this.setState({
                                docDataFromDb: docArr
                            })
                        })
                        .catch(error=>{console.log(error.message)})
                    })
                }else{
                    this.setState({
                        docDataFromDb: empty
                    })
                }
            })
            .catch(error=>{console.log(error.message)})
        })
    }
    setCurrentPageNavStyle(state){
        let currentPage = this.state.currentPage;
        return currentPage === state ? this.state.currentPageNavStyle : null;
    }
    setCurrentPageNavImgStyle(state, imgState){
        let currentPage = this.state.currentPage;
        return currentPage === state ? this.state.currentPageNavImgStyle[imgState] : null;
    }
    render(){
        let main;
        switch(this.state.currentPage){
            case 'myDocuments': main = <MyDocuments
                    getAllDocumensFromDb={this.getAllDocumensFromDb.bind(this)}
                    docDataFromDb={this.state.docDataFromDb}
                 />;
                break;
            case 'collabDocuments': main = <CollabDocuments
                    getAllDocumensFromDb={this.getAllDocumensFromDb.bind(this)}
                    docDataFromDb={this.state.docDataFromDb}
                 />;
                break;
            case 'accountSetting': main = <AccountSetting
                    userData={this.state.userData}
                    updateUserData={this.updateUserData.bind(this)}
                 />
                break;
        }
        let userInfo = '';
        if(this.state.userData){
            userInfo = <section id="profile-info">
                <div style={{backgroundImage: `url(${this.state.userData.photoURL})`}}></div>
                <p>{this.state.userData.username}</p>
            </section>
        }
        let nav = [];
        this.state.navTags.forEach(tag=>{
            let item = <div key={tag.tagName} onClick={this.handleCurrentPage.bind(this, tag.tagName)} 
                style={this.setCurrentPageNavStyle.call(this, tag.tagName)}>
                <div style={this.setCurrentPageNavImgStyle.call(this, tag.tagName, 'before')} className='img-before' ><img  src={`/images/${tag.tagName}.png`} /></div>
                <div style={this.setCurrentPageNavImgStyle.call(this, tag.tagName, 'hover')} className="img-hover" ><img  src={`/images/${tag.tagName}-hover.png`} /></div>
                <p>{tag.text}</p>
            </div>;
            nav.push(item);
        });
        return <div className="my-account">
            <nav>
                <article className="account-logo"> 
                    <a href="/">
                        <div><img src="/images/main-logo.png" /></div>
                        <p>CollabIn</p>
                    </a>
                </article>
                <article className="create-new-doc" onClick={this.props.handleDocCreate}>
                    <p>Create Docs</p>
                    <div><img src="/images/plus.png" /></div>
                </article>
                {nav}
                {userInfo}
                <footer className="back-to-homepage-mobile"><a href="/"><img src="/images/back-to-homepage-mobile.png" /></a></footer>
            </nav>
            <main>
                {main}
            </main>
        </div>
    }
    componentDidMount(){
        let currentUser = this.props.user;
        let photoURL = currentUser.photoURL ? currentUser.photoURL : '/images/user-1.png';
        let username = currentUser.displayName;
        this.setState({
            userData: {username: username, photoURL: photoURL}
        })
    }
}

const mapStateToProps = (store)=>{
    return{user: store.userReducer.user};
};
export default connect(mapStateToProps)(Account);