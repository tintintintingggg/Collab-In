import React from 'react';
import '../../css/Account.css';
import {LoadingPage} from '../LoadingPage';
import {db, storage} from '../../utils/firebase';
import {formatTime} from './lib';

class MyDocuments extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(!this.props.docDataFromDb){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap my-documents">
                <header>My Documents</header>
                <div className="separator-line"></div>
                <main>{this.props.docDataFromDb}</main>
            </div>
        }
    }
    componentDidMount(){
        this.props.getAllDocumensFromDb('userdocs');
    }
}

class CollabDocuments extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(!this.props.docDataFromDb){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap collab-documents">
                <header>Collab Documents</header>
                <div className="separator-line"></div>
                <main>{this.props.docDataFromDb}</main>
            </div>
        }
    }
    componentDidMount(){
        this.props.getAllDocumensFromDb('editordocs');
    }
}

class AccountSetting extends React.Component{
    constructor(props){
        super(props);
    }
    chancgProfile(e){
        let file = e.target.files[0];
        let currentUser = this.props.currentUser;
        let storageRef = storage.ref(currentUser.uid+'/'+file.name);
        storageRef.put(file)
        .then(()=>{
            return storageRef.getDownloadURL();
        }).then((url)=>{
            return currentUser.updateProfile({photoURL: url});
        }).then(()=>{
            this.props.updateUserData({
                username: currentUser.displayName,
                photoURL: currentUser.photoURL
            });
        }).catch(()=>{console.log(error.message);});
    }
    
    render(){
        if(!this.props.userData){
            return <LoadingPage />
        }else{
            return <div className="account-setting">
                <div className="user-photo">
                    <div><img src={this.props.userData.photoURL} /></div>
                    <div id="photo-edit">
                        <label htmlFor="img-uploader">
                            <img src="/images/change-profile.png" />
                        </label>
                        <input 
                            type="file" id="img-uploader" name="img" accept="image/*"
                            onChange={this.chancgProfile.bind(this)} 
                         />
                    </div>
                </div>
                <div>Dear, <span id="username">{this.props.userData.username}</span></div>
            </div>
        }
    }
}
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
            }
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
        let currentUser = this.props.currentUser;
        db.collection('users').doc(currentUser.uid).collection(docType).doc(targetId).delete().then(()=>{
            console.log('delete!');
        }).catch((error)=>{console.log(error.message)});
    }
    confirmDeletionMessage(){

    }
    deleteDoc(e, docType){
        e.preventDefault();
        let targetId = e.target.parentNode.id;

        this.deleteDocFromState(targetId, ()=>{this.deleteDocFromDb(targetId, docType)});
    }
    handleImgShake(){

    }
    // formatTime(time){
    //     let year = new Date(time).getFullYear();
    //     let month = new Date(time).getMonth()+1;
    //     let date = new Date(time).getDate();
    //     let hour = new Date(time).getHours();
    //     if(hour.toString().length<2){
    //         hour = '0'+hour
    //     };
    //     let minute = new Date(time).getMinutes();
    //     if(minute.toString().length<2){
    //         minute = '0'+minute
    //     };
    //     return year+' / '+month+' / '+date+' '+hour+': '+minute;
    // }
    getAllDocumensFromDb(docType){
        this.setState({
            docDataFromDb: null
        }, ()=>{
            let currentUser = this.props.currentUser;
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
                                        <button onMouseOver={this.handleImgShake.bind(this)} onClick={(e)=>{this.deleteDoc.call(this, e, docType)}} id={doc.id}><img src="/images/trash.png" /></button>
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
        if(this.state.currentPage === 'myDocuments'){
            main = <MyDocuments
                getAllDocumensFromDb={this.getAllDocumensFromDb.bind(this)}
                docDataFromDb={this.state.docDataFromDb}
             />
        }else if(this.state.currentPage === 'collabDocuments'){
            main = <CollabDocuments
                getAllDocumensFromDb={this.getAllDocumensFromDb.bind(this)}
                docDataFromDb={this.state.docDataFromDb}
             />
        }else if(this.state.currentPage === 'accountSetting'){
            main = <AccountSetting
                currentUser={this.props.currentUser}
                userData={this.state.userData}
                updateUserData={this.updateUserData.bind(this)}
             />
        }
        let userInfo = '';
        if(this.state.userData){
            userInfo = <section id="profile-info">
                <div><img src={this.state.userData.photoURL} /></div>
                <p>{this.state.userData.username}</p>
            </section>
        }
        return <div className="my-account">
            <nav>
                <article className="account-logo"> 
                    <a href="/">
                        <div><img src="/images/main-logo.png" /></div>
                        <p>CollabIn</p>
                    </a>
                </article>
                <article className="create-new-doc">
                    <p onClick={this.props.handleDocCreate}>Create Docs</p>
                    <div><img src="/images/plus.png" /></div>
                </article>
                <div onClick={this.handleCurrentPage.bind(this, 'myDocuments')} 
                    style={this.setCurrentPageNavStyle.call(this, 'myDocuments')}>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'myDocuments', 'before')} className='img-before' ><img  src="/images/icon1.png" /></div>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'myDocuments', 'hover')} className="img-hover" ><img  src="/images/icon1-hover.png" /></div>
                    <p>My Documents</p>
                </div>
                <div onClick={this.handleCurrentPage.bind(this, 'collabDocuments')}
                    style={this.setCurrentPageNavStyle.call(this, 'collabDocuments')}>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'collabDocuments', 'before')} className='img-before'><img  src="/images/icon2.png" /></div>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'collabDocuments', 'hover')} className="img-hover"><img src="/images/icon2-hover.png" /></div>
                    <p>Collaborate with Me</p>
                </div>
                <div onClick={this.handleCurrentPage.bind(this, 'accountSetting')}
                    style={this.setCurrentPageNavStyle.call(this, 'accountSetting')}>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'accountSetting', 'before')} className='img-before'><img src="/images/icon3.png" /></div>
                    <div style={this.setCurrentPageNavImgStyle.call(this, 'accountSetting', 'hover')} className="img-hover"><img src="/images/icon3-hover.png" /></div>
                    <p>Account Setting</p>
                </div>
                {userInfo}
            </nav>
            <main>
                <div className='alert-message'>
                    <div>
                        <header><div>Are yoyu sure?</div><div>X</div></header>
                        <div>Do you really want to delete this document?</div>
                        <button>Cancel</button><button>Yes, do it!</button>
                    </div>
                </div>
                {main}
            </main>
        </div>
    }
    componentDidMount(){
        let currentUser = this.props.currentUser;
        let photoURL = currentUser.photoURL ? currentUser.photoURL : '/images/user-1.png';
        let username = currentUser.displayName;
        this.setState({
            userData: {username: username, photoURL: photoURL}
        })
    }
}
export {Account};