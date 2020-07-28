import React from 'react';
import '../css/Account.css';
import {LoadingPage} from './LoadingPage';

class MyDocuments extends React.Component{
    constructor(props){
        super(props);
        this.state={
            main: null
        }
    }
    render(){
        if(!this.state.main){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap my-documents">
                <header>My Documents</header>
                <div className="separator-line"></div>
                <main>{this.state.main}</main>
            </div>
        }
    }
    componentDidMount(){
        let db = this.props.db;
        let currentUser = this.props.currentUser;
        let docArr = [];
        let empty = 'No Documents!'
        console.log(currentUser.uid)
        db.collection('users').doc(currentUser.uid).collection('userdocs')
        .orderBy('time')
        .get()
        .then((docs)=>{
            console.log('docs come!')
            console.log(docs)
            if(!docs.empty){
                console.log('docs.exists!')
                docs.forEach(doc=>{
                    db.collection('documents').doc(doc.id).get()
                    .then((data)=>{
                        let name = data.data().name;
                        let time = data.data().time;
                        let year = new Date(time).getFullYear();
                        let month = new Date(time).getMonth()+1;
                        let date = new Date(time).getDate();
                        let hour = new Date(time).getHours();
                        if(hour.toString().length<2){hour = '0'+hour}
                        let minute = new Date(time).getMinutes();
                        if(minute.toString().length<2){minute = '0'+minute}
                        docArr.push(<a href={`/document/${doc.id}`} key={doc.id} className="document-item">
                                <section>
                                    <div className="doc-item-name">{name}</div>
                                    <div className="doc-item-time">{`${year} / ${month} / ${date} ${hour}: ${minute}`}</div>
                                </section>
                            </a>);
                        this.setState({
                            main: docArr
                        })
                    })
                    .catch(error=>{console.log(error.message)})
                })
            }else{
                console.log('docs.exists not!')
                this.setState({
                    main: empty
                })
            }
            
        })
        .catch(error=>{console.log(error.message)})
    }
}
class CollabDocuments extends React.Component{
    constructor(props){
        super(props);
        this.state={
            main: null
        }
    }
    render(){
        if(!this.state.main){
            return <LoadingPage />
        }else{
            return <div className="handle-docs-wrap collab-documents">
                <header>Collab Documents</header>
                <div className="separator-line"></div>
                <main>{this.state.main}</main>
            </div>
        }
    }
    componentDidMount(){
        let db = this.props.db;
        let currentUser = this.props.currentUser;
        let docArr = [];
        let empty = 'No Documents!';
        db.collection('users').doc(currentUser.uid).collection('editordocs')
        .orderBy('time')
        .get()
        .then((docs)=>{
            console.log(docs)
            if(!docs.empty){
                docs.forEach(doc=>{
                    db.collection('documents').doc(doc.id).get()
                    .then((data)=>{
                        if(data.exists){
                            let name = data.data().name;
                            let time = data.data().time;
                            let year = new Date(time).getFullYear();
                            let month = new Date(time).getMonth()+1;
                            let date = new Date(time).getDate();
                            let hour = new Date(time).getHours();
                            if(hour.toString().length<2){hour = '0'+hour}
                            let minute = new Date(time).getMinutes();
                            if(minute.toString().length<2){minute = '0'+minute}
                            docArr.push(<a href={`/document/${doc.id}`} key={doc.id} className="document-item">
                                    <section>
                                        <div className="doc-item-name">{name}</div>
                                        <div className="doc-item-time">{`${year} / ${month} / ${date} ${hour}: ${minute}`}</div>
                                    </section>
                                </a>);
                            this.setState({
                                main: docArr
                            })
                        }else{
                            console.log('nonono')
                        }
                        
                    })
                    .catch(error=>{console.log(error.message)})
                })
            }else{
                this.setState({
                    main: empty
                })
            }
        })
        .catch(error=>{console.log(error.message)})
    }
}
class AccountSetting extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userDetail: null
        }
    }
    chancgProfile(e){
        let file = e.target.files[0];
        let currentUser = this.props.currentUser;
        let storageRef = this.props.storage.ref(currentUser.uid+'/'+file.name);
        storageRef.put(file)
        .then(()=>{
            console.log('image is upload');
            storageRef.getDownloadURL()
            .then((url)=>{
                currentUser.updateProfile({photoURL: url})
                .then(()=>{
                    this.setState((prevState)=>({
                        userDetail: {name: prevState.userDetail.name, photoURL: url}
                    }))
                })
                .catch(error=>{console.log(error.message)})
            })
            .catch((error)=>{alert(error.message)})
        })
        .catch((error)=>{alert(error.message)})
    }
    render(){
        if(!this.state.userDetail){
            return <LoadingPage />
        }else{
            return <div className="account-setting">
                <div className="user-photo">
                    <div><img src={this.state.userDetail.photoURL} /></div>
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
                <div>Dear, <span id="username">{this.state.userDetail.name}</span></div>
            </div>
        }
    }
    componentDidMount(){
        let db = this.props.db;
        let currentUser = this.props.currentUser;
        let photoURL;
        if(currentUser.photoURL){
            photoURL = currentUser.photoURL;
        }else{
            photoURL = '/images/user-1.png'
        }
        this.setState({
            userDetail: {name: currentUser.displayName, photoURL: photoURL}
        })
    }
}
class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            currentPage: 'myDocuments',
            userData: null
        }
    }
    handleCurrentPage(state){
        console.log(state);
        this.setState({
            currentPage: state
        })
    }
    render(){
        let main;
        if(this.state.currentPage === 'myDocuments'){
            main = <MyDocuments
                db={this.props.db}
                currentUser={this.props.currentUser}
             />
        }else if(this.state.currentPage === 'collabDocuments'){
            main = <CollabDocuments
                db={this.props.db}
                currentUser={this.props.currentUser}
             />
        }else if(this.state.currentPage === 'accountSetting'){
            main = <AccountSetting
                db={this.props.db}
                currentUser={this.props.currentUser}
                storage={this.props.storage}
             />
        }
        let userInfo = '';
        if(this.state.currentUser){
            let photoURL;
            if(this.state.currentUser.photoURL){
                photoURL = this.state.currentUser.photoURL;
            }else{
                photoURL = '/images/user-1.png';
            }
            userInfo = <div id="profile-info">
                        <p>{'Hi! '+this.state.currentUser.displayName}</p>
                        <div><img src={photoURL} /></div>
                    </div>
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
                    <p onClick={this.props.handleDocCreate}>New Documents <span>+</span></p>
                </article>
                <div onClick={this.handleCurrentPage.bind(this, 'myDocuments')}>
                    <div className='img-before'><img  src="/images/icon1.png" /></div>
                    <div className="img-hover"><img  src="/images/icon1-hover.png" /></div>
                    <p>My Documents</p>
                </div>
                <div onClick={this.handleCurrentPage.bind(this, 'collabDocuments')}>
                    <div className='img-before'><img  src="/images/icon2.png" /></div>
                    <div className="img-hover"><img src="/images/icon2-hover.png" /></div>
                    <p>Collaborate with Me</p>
                </div>
                <div onClick={this.handleCurrentPage.bind(this, 'accountSetting')}>
                    <div className='img-before'><img src="/images/icon3.png" /></div>
                    <div className="img-hover"><img src="/images/icon3-hover.png" /></div>
                    <p>Account Setting</p>
                </div>
            </nav>
            <main>
                {main}
            </main>
            {userInfo}
        </div>
    }
}
export {Account};