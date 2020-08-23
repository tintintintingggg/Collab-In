import React from "react";
import "../../../css/DocText.css";
import {db} from "../../../utils/firebase";

class DocText extends React.Component{
  constructor(props){
    super(props);
    this.selectableArea = React.createRef();
    this.state = {
      docName: null,
      docText: null,
      currentImg: ""
    };
  }
  render(){
    if(this.props.imgurl){
      let img = document.createElement("img");
      img.setAttribute("draggable", true);
      img.setAttribute("src", this.props.imgurl);
      img.setAttribute("class", "draggable-img");
      img.setAttribute("contenteditable", true);
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
    </div>;
  }
    
  componentDidMount(){
    let docId = this.props.docId;
    let text;
    let textContainer = this.selectableArea.current;
    let currentVersion=0;
    let starttime = null;

    this.unsubscribe = db.collection("documents").doc(docId)
      .onSnapshot((doc) => {
        if(!doc.metadata.hasPendingWrites){
          if(doc.data().text !== textContainer.innerHTML){
            textContainer.innerHTML = doc.data().text;
            text = doc.data().text;
            this.setState({
              docText: doc.data().text
            });
          }
        }else{
          text = textContainer.innerHTML;
          this.setState({
            docText: textContainer.innerHTML
          });
        }
      });

    let mutationObserver = new MutationObserver(() => {
      if(starttime === null){
        this.props.detectUpload(false);
        starttime = Date.now();
        setTimeout(()=>{
          starttime=null;
          let currentHTML = this.selectableArea.current.innerHTML;
          if(currentHTML !== text){
            db.collection("documents").doc(docId).get().then(doc=>{
              currentVersion = doc.data().version;
              db.collection("documents").doc(docId).update({
                text: currentHTML,
                version: currentVersion+1
              });
            }).then(()=>{
              // console.log("text is update to DB");   
            }).catch(error=>{console.log(error.message);});
          }
          this.props.recordText(currentHTML);
          this.props.detectUpload(true);
        }, 2000);
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

export default DocText;