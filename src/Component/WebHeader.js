import React from 'react';
import '../css/WebHeader.css';

class WebHeader extends React.Component{
    constructor(props){
        super(props);
        this.urlInput = React.createRef();
        this.shareList = React.createRef();
        this.shareImg = React.createRef();
        this.state = {
            nameValue: '',
            onlineUser: null,
            copyUrl: ''
        }
    }
    getName(e){
        this.setState({
            nameValue: e.target.value
        })
    }
    submitName(){
        let db = this.props.db;
        db.collection('documents').doc(this.props.docId).update({
            name: this.state.nameValue
        })
        .then(console.log('submit success')).catch(() => {console.log(error.message)})
    } 
    copyUrl(){
        this.urlInput.current.select();
        document.execCommand('copy');
        if(document.execCommand('copy')){
            this.setState({copyUrl: 'Copied'},
                ()=>{window.setTimeout(()=>{this.setState({copyUrl: ''})}, 2000)}
            )
        }else{
            this.setState({copyUrl: 'Fail to Copy!'},
                ()=>{window.setTimeout(()=>{this.setState({copyUrl: ''})}, 2000)}
            )
        }
    }
    handleShareList(){
        if(this.shareList.current.style.display === 'none'){
            this.shareList.current.style.display = 'block';
            this.shareImg.current.classList.add('img-on-hover');
        }else{
            this.shareList.current.style.display = 'none';
            this.shareImg.current.classList.remove('img-on-hover');
        }
    }
    render(){
        let save; let icon;
        if(!this.props.saved){
            save = "Saving...";
            icon = "/images/sync.png";
        }else{
            save = "Saved!";
            icon = "/images/cloud-computing.png";
        }
        let onlineUserName = [];
        let online = '';
        if(this.state.onlineUser){
            for(let i =0; i<this.state.onlineUser.length; i++){
                if(this.state.onlineUser[i] !== null){
                    let item = <div key={i}><div></div>{this.state.onlineUser[i]}</div>
                    onlineUserName.push(item);
                }
            }
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
            </div>
        }
        let copied = this.state.copyUrl;
        return <div className='docHeader'>
            <div className="headerleft">
                <div className="logo"><a href="/"><img src="/images/main-logo.png" /></a></div>
                <div className="docname">
                    <input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} />
                    <button onClick={this.submitName.bind(this)}><img src="/images/save.png" /></button>
                </div>
                <div className="store-state">
                    <div id="upload-icon" className="upload-icon"><img src={icon} /></div>
                    <div id="upload-text">{save}</div>
                </div>
                
            </div>
            <div className="headerright">
                <div className="share-list" style={{display: 'none'}} ref={this.shareList}>
                    <section className="section1">
                        <main>Share by URL<span>{copied}</span></main>
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
                    <img ref={this.shareImg} src="/images/share.png" />
                </div>
                <div id="header-nav-mobile-icon">
                    <img src="/images/share.png" />
                </div>
                {online}
            </div>
            {/* <div id="header-nav-mobile">
                <div className="docname">
                    <input type="text" value={this.state.nameValue} onChange={this.getName.bind(this)} />
                    <button onClick={this.submitName.bind(this)}><img src="/images/save.png" /></button>
                </div>
                <div className="share" onClick={this.handleShareList.bind(this)}>
                    <img ref={this.shareImg} src="/images/share.png" />
                </div>
            </div> */}
        </div>
    }
    componentDidMount(){
        let db = this.props.db;
        db.collection('documents').doc(this.props.docId).get()
        .then((doc) => {
            this.setState({
                nameValue: doc.data().name
            })
        }).catch((error) => {console.log(error.message)})

        db.collection('documents').doc(this.props.docId)
        .onSnapshot((doc) => {
            this.setState({
                nameValue: doc.data().name
            })
        });

        db.collection('status').doc(this.props.docId).collection('online').doc("total")
        .onSnapshot((doc)=>{
            let userContainer = [];
            for(let i =0; i<doc.data().total.length; i++){
                db.collection('users').doc(doc.data().total[i]).get()
                .then((data)=>{
                    userContainer.push(data.data().name)
                    this.setState({
                        onlineUser: userContainer
                    })
                })
                .catch((error)=>{console.log(error)})
            }
            
        })        
    }
}

export {WebHeader};