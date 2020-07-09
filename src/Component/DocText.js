import React from 'react';
import {DocUndoRedo} from './DocUndoRedo';


class DocText extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.state = {
            docName: null,
            docText: null,
            record: [],
            step: 0,
            cooldown: false        
        }
    }
    remainSelection(e){
        e.preventDefault();
    }

    // addCurrentText(e){
    //     // setTimeout(this.setState((preState) => ({
    //     //     step: preState.step+1,
    //     //     record: preState.record.concat([document.getElementById('selectable-area').innerHTML])
    //     // })), 10000)
    //     //     // console.log('change')
    //     //     // console.log(e.persist())
    //     setTimeout(() => {this.setState((preState) => ({
    //         step: preState.step+1,
    //         record: preState.record.concat([document.getElementById('selectable-area').innerHTML])
    //     }))}, 1000)
    // }

    updateRecord(){
        this.setState((preState) => ({
            step: preState.step-2,
            record: preState.record.splice(0, preState.record.length-2)
        }))
    }


    update(text, name){
        console.log('update currentText');
        this.setState({
            docText: text,
            docName: name
        })
    }

    
    render(){
        // console.log(this.state.step,this.state.record);
        return <div className="text" onLoad={console.log('is rendering')}>
            <DocUndoRedo step={this.state.step} record={this.state.record} updateRecord={this.updateRecord.bind(this)}/>
            <div  
                contentEditable="true" 
                suppressContentEditableWarning='true'
                id="selectable-area"  
                db={this.props.db}
                ref={this.myRef}
                // onInput={this.addCurrentText.bind(this)} 
            >
                {/* {this.state.docText} */}
            </div>
            {/* {content} */}
        </div>
    }


    componentDidMount(){
        let docId = this.props.docId;
        let db = this.props.db
        let docData = db.collection("documents").doc(docId);
        let text; let name;
        let textContainer = this.myRef.current;
        docData.get().then(function(doc){
            if(doc.exists){
                name = doc.data().name;
                console.log(name)
                if(doc.data().text){
                    text = doc.data().text;
                }else{
                    text = '';
                    console.log(text)
                }
                console.log('state', this.state.docText)
                if(text !== this.state.docText){
                    this.update(text, name);
                    textContainer.innerHTML = text;
                    console.log('container', textContainer.innerHTML)
                }

              
                
                let mutationObserver = new MutationObserver((mutations) => {
                    console.log('detect')
                    let currentHTML = this.myRef.current.innerHTML;
                    console.log(currentHTML, text)
                    if(currentHTML !== text){
                        docData.update({
                            text: currentHTML
                        })
                        .then(function() {
                            console.log("text is update to DB");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });  
                    }
                    setTimeout(() => {
                        if(this.state.record === null){
                            this.setState((preState) => ({
                                step: preState.step+1,
                                record: [currentHTML]
                            }))
                        }
                        if(this.state.record[this.state.record.length-1] !== currentHTML){
                            this.setState((preState) => ({
                                step: preState.step+1,
                                record: preState.record.concat([currentHTML])
                            }))
                        }
                    },0) //延遲會影響回到上一步 再看看！
                    
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

        docData.onSnapshot(function(doc) {
            console.log("Snapshot", doc.data().text)
            if(doc.data().text !== textContainer.innerHTML){
                console.log("Current data: ", doc.data().text);
                textContainer.innerHTML = doc.data().text;
                this.setState({
                    docText: doc.data().text
                })
            }
        }.bind(this));
        
    }

}

// onMouseUp={this.props.getSelection}
// onMouseDown={this.remainSelection.bind(this)}
// window.addEventListener('mousedown', (e) => {e.preventDefault();})

export {DocText};