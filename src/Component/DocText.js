import React from 'react';
import '../css/DocText.css';


class DocText extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            docName: null,
            docText: null,
            cooldown: false,
            time: 0,
            position: null   

        }
    }

    update(text, name){
        console.log('update currentText');
        this.setState({
            docText: text,
            docName: name
        })
    }
    // recordPosition(e){
    //     console.log(e.pageX, e.pageY)
    //     this.setState({
    //         position: {x: e.pageX, y:e.pageY}
    //     })
    // }
    // getPosition() {
    //     if (window.getSelection) {
    //         let sel = window.getSelection();
    //         let range = new Range();
    //         console.log(range)
    //         if (sel.getRangeAt) {
    //             console.log(sel.getRangeAt(0).startOffset, sel.getRangeAt(0).startContainer);
    //             this.setState({
    //                 position: range
    //             })
    //         }
    //     }
    //     return null;
    // }
    
    render(){
        if(this.props.imgurl){
            let img = document.createElement('img');
            img.setAttribute('draggable', true);
            img.setAttribute('src', this.props.imgurl);
            img.setAttribute('class', "draggable-img");
            img.setAttribute('contenteditable', true)
            this.myRef.current.appendChild(img);
        }
        return <div className="text">
            <div id="canvas-area">
                <div  
                    contentEditable="true" 
                    suppressContentEditableWarning='true'
                    id="selectable-area"  
                    db={this.props.db}
                    ref={this.myRef}
                    // onClick={this.props.recordPosition}
                    // onClick={this.recordPosition.bind(this)}
                    // onClick={this.getPosition.bind(this)}
                >
                </div>
            </div>
        </div>
    }


    componentDidMount(){
        let docId = this.props.docId;
        let db = this.props.db
        let docData = db.collection("documents").doc(docId);
        let text; let name;
        let textContainer = this.myRef.current;
        let currentVersion=0;
        let starttime = null;
        docData.get().then(function(doc){
            // 第一次載入文件
            if(doc.exists){
                name = doc.data().name;
                text = doc.data().text;
                if(text !== this.state.docText){
                    this.update(text, name);
                    textContainer.innerHTML = text;
                }
                this.props.recordText(text)
                
            // 監聽 local 文件
                let mutationObserver = new MutationObserver((mutations) => {
                    if(starttime === null){
                        this.props.detectUpload(false);
                        starttime = Date.now();
                        setTimeout(()=>{
                            starttime=null;
                            let currentHTML = this.myRef.current.innerHTML;
                            if(currentHTML !== text){
                                docData.get()
                                .then((doc) => {
                                    currentVersion = doc.data().version;
                                    docData.update({
                                        text: currentHTML,
                                        version: currentVersion+1
                                    })
                                    .then(function() {
                                        console.log("text is update to DB");                                        
                                    })
                                    .catch(function(error) {
                                        console.error("Error writing document: ", error);
                                    });  
                                }).catch((error) => {console.log("error getting data",error)})
                                
                            }
                            this.props.recordText(currentHTML);
                            this.props.detectUpload(true);
                        }, 2000)
                    }
                });
                mutationObserver.observe(this.myRef.current, {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                  });
            }else{console.log('no data');}
        }.bind(this))
        .catch(function(error){
            console.log('error', error)
        })

        docData.onSnapshot((doc) => {
            console.log("is local?",doc.metadata.hasPendingWrites);
            if(!doc.metadata.hasPendingWrites){
                if(doc.data().text !== textContainer.innerHTML){
                    console.log("Current data: ", doc.data().text);
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
        
    }

}

// onMouseUp={this.props.getSelection}
// onMouseDown={this.remainSelection.bind(this)}
// window.addEventListener('mousedown', (e) => {e.preventDefault();})

export {DocText};