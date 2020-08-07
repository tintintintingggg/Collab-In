import React from 'react';
import '../../../css/DocText.css';
import {db} from '../../../utils/firebase';

class DocText extends React.Component{
    constructor(props){
        super(props);
        this.selectableArea = React.createRef();
        this.state = {
            docName: null,
            docText: null
        }
    }
    render(){
        if(this.props.imgurl){
            let img = document.createElement('img');
            img.setAttribute('draggable', true);
            img.setAttribute('src', this.props.imgurl);
            img.setAttribute('class', "draggable-img");
            img.setAttribute('contenteditable', true)
            this.selectableArea.current.appendChild(img);
        }
        return <div className="text">
            <div id="canvas-area">
                <div  
                    contentEditable="true" 
                    suppressContentEditableWarning='true'
                    id="selectable-area"  
                    ref={this.selectableArea}
                >
                </div>
            </div>
        </div>
    }
    // componentDidMount(){
    //     let docId = this.props.docId;
    //     let db = this.props.db
    //     let docData = db.collection("documents").doc(docId);
    //     let text; let name;
    //     let textContainer = this.selectableArea.current;
    //     let currentVersion=0;
    //     let starttime = null;
    //     docData.get().then(function(doc){
    //         // 第一次載入文件
    //         if(doc.exists){
    //             name = doc.data().name;
    //             text = doc.data().text;
    //             if(text !== this.state.docText){
    //                 this.updateDocInfoInState(text, name);
    //                 textContainer.innerHTML = text;
    //             }
    //             this.props.recordText(text)
                
    //         // 監聽 local 文件
    //             let mutationObserver = new MutationObserver((mutations) => {
    //                 if(starttime === null){
    //                     this.props.detectUpload(false);
    //                     starttime = Date.now();
    //                     setTimeout(()=>{
    //                         starttime=null;
    //                         let currentHTML = this.selectableArea.current.innerHTML;
    //                         if(currentHTML !== text){
    //                             docData.get()
    //                             .then((doc) => {
    //                                 currentVersion = doc.data().version;
    //                                 docData.update({
    //                                     text: currentHTML,
    //                                     version: currentVersion+1
    //                                 })
    //                                 .then(function() {
    //                                     console.log("text is update to DB");                                        
    //                                 })
    //                                 .catch(function(error) {
    //                                     console.error("Error writing document: ", error);
    //                                 });  
    //                             }).catch((error) => {console.log("error getting data",error)})
                                
    //                         }
    //                         this.props.recordText(currentHTML);
    //                         this.props.detectUpload(true);
    //                     }, 2000)
    //                 }
    //             });
    //             mutationObserver.observe(this.selectableArea.current, {
    //                 attributes: true,
    //                 characterData: true,
    //                 childList: true,
    //                 subtree: true,
    //                 attributeOldValue: true,
    //                 characterDataOldValue: true
    //               });
    //         }else{console.log('no data');}
    //     }.bind(this))
    //     .catch(function(error){
    //         console.log('error', error)
    //     })

    //     docData.onSnapshot((doc) => {
    //         console.log("is local?",doc.metadata.hasPendingWrites);
    //         if(!doc.metadata.hasPendingWrites){
    //             if(doc.data().text !== textContainer.innerHTML){
    //                 textContainer.innerHTML = doc.data().text;
    //                 text = doc.data().text
    //                 this.setState({
    //                     docText: doc.data().text
    //                 })
    //             }
    //         }else{
    //             text = textContainer.innerHTML
    //             this.setState({
    //                 docText: textContainer.innerHTML
    //             })
    //         }
    //     });
        
    // }

    // loadDataInFirstTime(db, docId, name, text, textContainer){
    //     db.collection("documents").doc(docId).get()
    //     .then((doc)=>{
    //         if(doc.exists){
    //             name = doc.data().name;
    //             text = doc.data().text;
    //             if(text !== this.state.docText){
    //                 this.updateDocInfoInState(text, name);
    //                 textContainer.innerHTML = text;
    //             }
    //             this.props.recordText(text)
    //         }else{
    //             console.log('no data');
    //         }
    //     })
    // }
    
    componentDidMount(){
        let docId = this.props.docId;
        let text;
        let textContainer = this.selectableArea.current;
        let currentVersion=0;
        let starttime = null;

        this.unsubscribe = db.collection("documents").doc(docId)
        .onSnapshot((doc) => {
            // console.log("is local?",doc.metadata.hasPendingWrites);
            if(!doc.metadata.hasPendingWrites){
                if(doc.data().text !== textContainer.innerHTML){
                    textContainer.innerHTML = doc.data().text;
                    text = doc.data().text
                    this.setState({
                        docText: doc.data().text
                    })
                }
            }else{
                text = textContainer.innerHTML
                this.setState({
                    docText: textContainer.innerHTML
                })
            }
        });

        let mutationObserver = new MutationObserver((mutations) => {
            if(starttime === null){
                this.props.detectUpload(false);
                starttime = Date.now();
                setTimeout(()=>{
                    starttime=null;
                    let currentHTML = this.selectableArea.current.innerHTML;
                    if(currentHTML !== text){
                        db.collection("documents").doc(docId).get()
                        .then((doc) => {
                            currentVersion = doc.data().version;
                            db.collection("documents").doc(docId).update({
                                text: currentHTML,
                                version: currentVersion+1
                            })
                            .then(()=>{
                                console.log("text is update to DB");                                        
                            })
                            .catch((error)=>{
                                console.error("Error writing document: ", error);
                            });  
                        }).catch((error)=>{
                            console.log("error getting data",error)
                        })
                        
                    }
                    this.props.recordText(currentHTML);
                    this.props.detectUpload(true);
                }, 2000)
            }
        });
        mutationObserver.observe(this.selectableArea.current, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
}

export {DocText};