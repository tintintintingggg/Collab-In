import React from 'react';
import {db} from '../../../utils/firebase';
import '../../../css/WebHeader.css';
// redux
import {connect} from 'react-redux';

class WebHeader extends React.Component{
    constructor(props){
        super(props);
        this.urlInput = React.createRef();
        this.state = {
            nameValue: '',
            onlineUser: null,
            copyUrl: '',
            shareListIsOpen: false
        }
    }
    getName(e){
        this.setState({nameValue: e.target.value}, ()=>{
            db.collection('documents').doc(this.props.docId).update({
                name: this.state.nameValue
            })
            .catch(() => {console.log(error.message)});
        });
    }
    copyUrl(){
        this.urlInput.current.select();
        document.execCommand('copy');
        this.handleCopyUrlState(
            document.execCommand('copy') ? 'Copied' : 'Fail to Copy!'
        );
    }
    handleCopyUrlState(alertText){
        this.setState({copyUrl: alertText},
            ()=>{window.setTimeout(()=>{this.setState({copyUrl: ''})}, 1000)}
        );
    }
    handleShareList(){
        this.setState(prevState=>({
            shareListIsOpen: !prevState.shareListIsOpen
        }));
    }
    render(){
        let onlineUserName = [];
        let online = '';
        if(this.state.onlineUser){
            this.state.onlineUser.forEach(user=>{
                if(user){
                    let item = <div key={user}><div></div>{user}</div>
                    onlineUserName.push(item);
                };
            });
            online = <div className="online-state">
                <div className="online-total" id="online-total-web">
                    <div><img src="/images/online.png" /></div>
                    {this.state.onlineUser.length+" ONLINE"}
                </div>
                <div className="online-total" id="online-total-mobile">
                    <div><img src="/images/online.png" /></div>
                    {this.state.onlineUser.length}
                </div>
                <div className="online-list">
                    {onlineUserName}
                </div>
            </div>;
        }
        return <div className='docHeader'>
            <div className="headerleft">
                <div className="logo"><a href="/"><img src="/images/main-logo.png" /></a></div>
                <div className="docname">
                    <input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} />
                </div>
                <div className="store-state">
                    <div id="upload-icon" className="upload-icon">
                        <img src={this.props.saved ? "/images/cloud-computing.png" : "/images/sync.png"} />
                    </div>
                    <div id="upload-text">{this.props.saved ? "Saved!" : "Saving..."}</div>
                </div>
            </div>
            <div className="headerright">
                <div className="share-list" style={this.state.shareListIsOpen ? {display: 'block'} : {display: 'none'}}>
                    <section className="section1">
                        <main>Share by URL<span>{this.state.copyUrl}</span></main>
                        <article>
                            <div className="href-url"><input id="input-url" value={window.location.href} ref={this.urlInput} readOnly></input></div>
                            <div className="href-btn" onClick={this.copyUrl.bind(this)}>Copy</div>
                        </article>
                    </section>
                    <section>
                        <main>Share by Email</main>
                        <article>
                            <div className="href-url"><input value={window.location.href} readOnly /></div>
                            <div className="href-btn">
                                <a href={"mailto:?subject=Share a document with you!&body="+window.location.href} title="Share by Email" >
                                    Send Email
                                </a>
                            </div>
                        </article>
                    </section>
                </div>
                <div className="share" onClick={this.handleShareList.bind(this)}>
                    <img className={this.state.shareListIsOpen ? 'img-on-hover' : ''} src="/images/share.png" />
                </div>
                <div id="header-nav-mobile-icon">
                    <img src="/images/share.png" />
                </div>
                {online}
            </div>
        </div>;
    }
    componentDidMount(){
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            this.setState({
                nameValue: doc.data().name
            })
        }).catch((error) => {console.log(error.message)});

        this.unsubcribeDocument = db.collection('documents').doc(this.props.docId)
        .onSnapshot((doc) => {
            if(!doc.metadata.hasPendingWrites){
                this.setState({
                    nameValue: doc.data().name
                });
            }
        });

        this.unsubcribeStatus = db.collection('status').doc(this.props.docId).collection('online').doc("total")
        .onSnapshot((snapshot)=>{
            let userContainer = [];
            snapshot.data().total.forEach(userId=>{
                db.collection('users').doc(userId).get()
                .then((userData)=>{
                    userContainer.push(userData.data().name);
                    this.setState({
                        onlineUser: userContainer
                    });
                })
                .catch((error)=>{console.log(error)});
            })
        })        
    }
    componentWillUnmount(){
        this.unsubcribeDocument();
        this.unsubcribeStatus();
    }
}

const mapStateToProps = (store)=>{
    return{
        saved: store.saveSignReducer.saved
    };
};
export default connect(mapStateToProps)(WebHeader);