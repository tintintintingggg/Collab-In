import React from 'react';
import {DocText} from './DocText';
import '../css/DocBtn.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


class UndoBtn extends React.Component{
    constructor(props){
        super(props);
    }
    undo(){
        if(document.getElementById('selectable-area')){
            if(this.props.step>1){
                document.getElementById('selectable-area').innerHTML = this.props.record[this.props.step-2];
                console.log('undo');
                this.props.updateRecord();
            }else{
                alert('沒有上一步');
            }
        }
    }
    render(){
        return <button onClick={this.undo.bind(this)}>
            <img src="/images/return.png" alt="return" />
        </button>
    }
}
class BoldBtn extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
    }
    changeBold(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'bold', null)
            }
        }
    }
    render(){
        return <button onClick={this.changeBold.bind(this)}>
            <img src="/images/bold-1.png" />
        </button>
    }
}
class UnBoldBtn extends React.Component{
    constructor(props){
        super(props);
    }
    changeUnBold(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'un-bold', null)
            }
        }
    }
    render(){
        return <button onClick={this.changeUnBold.bind(this)}>
            <img src="/images/bold-remove.png" />
        </button>
    }
}
class ItalicBtn extends React.Component{
    constructor(props){
        super(props);
    }
    changeItalic(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'italic', null)
            }
        }
    }
    render(){
        return <button onClick={this.changeItalic.bind(this)}>
            <img src="/images/italic-1.png" />
        </button>
    }
}
class UnItalicBtn extends React.Component{
    constructor(props){
        super(props);
    }
    changeUnItalic(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'un-italic', null)
            }
        }
    }
    
    render(){
        return <button onClick={this.changeUnItalic.bind(this)}>
            <img src="/images/italic-remove.png" />
        </button>
    }
}

class ColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    changeColor(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'color', 'color: '+e.target.value)
            }
        }
    }
    render(){
        return <div className="colorbtn"><input id="color-input" type="color" 
            onChange={this.changeColor.bind(this)}
         /></div>
    }
}
class BackgroundColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    changeColor(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'background-color', 'background-color: '+e.target.value)
            }
        }
    }
    render(){
        return <div className="background-colorbtn"><input id="background-color-input" type="color" 
            onChange={this.changeColor.bind(this)}
         /></div>
    }
}
class ClearBackgroundColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    clearColor(){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'un-color', null)
            }
        }
    }
    render(){
        return <button onClick={this.clearColor.bind(this)}>
            <img src="/images/remove-color.png" />
        </button>
    }
}
class FontSizeBtn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: 16,
            listDisplay: 'none'
        }
    }
    changeFontSize(e){
        if(e.keyCode ===13){
            console.log(this.state.value)
            // this.props.surroundSelection('span', 'font-size', this.state.value)
        }
    }
    getValue(e){
        this.setState({
            value: e.target.value
        })
    }

    showList(){
        if(this.state.listDisplay === 'none'){
            this.setState({
                listDisplay: 'block'
            })
        }else{
            this.setState({
                listDisplay: 'none'
            })
        }
    }

    changeFontSize(e){
        this.showList();
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'font-size', 'font-size: '+e.target.innerText+'px')
            }
        }
    }
    render(){
        return <div className="font-size-btn">
            <div className="font-size-btn-arrow">
                <button onClick={this.showList.bind(this)}><img src="/images/font-size.png" /></button>
            </div>
            <div className="font-size-btn-list" style={{display: this.state.listDisplay}} onClick={this.changeFontSize.bind(this)}>
            <button>8</button><button>10</button><button>12</button><button>14</button><button>16</button><button>18</button><button>20</button><button>24</button><button>30</button><button>36</button><button>48</button><button>60</button><button>72</button><button>96</button>
            </div>
        </div>
    }
}

class ImgBtn extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file: null
        }
    }
    handleChange(e){
        let docId = this.props.docId;
        let file = e.target.files[0];
        let storageRef = this.props.storage.ref(docId+'/'+file.name); 
        // upload file
        storageRef.put(file)
        .then(()=>{
            console.log('image is upload');
            storageRef.getDownloadURL()
            .then((url)=>{
                this.props.getImgurl(url)
            })
            .catch((error)=>{alert(error.message)})
        })
        .catch((error)=>{alert(error.message)})
    }
    render(){
        return <div className="img-btn">
            <div>
                <label htmlFor="img-uploader">
                    <img src="/images/img-1.png" />
                </label>
                <input 
                    type="file" id="img-uploader" name="img" accept="image/*"
                    onChange={this.handleChange.bind(this)}
                 />
            </div>
        </div>
    }
}
class DownloadBtn extends React.Component{
    constructor(props){
        super(props);
    }
    getCanvas(){
        if(document.getElementById('selectable-area')){
            let div = document.getElementById('selectable-area');
            window.scroll(0,0)
            html2canvas(div)
            .then((canvas)=>{
                const imgData = canvas.toDataURL('image/png', 1);
                const pdf = new jsPDF("p", "mm", "a4");
                let width = pdf.internal.pageSize.getWidth();
                let height = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 10, 10, width-20, height-20);
                let db = this.props.db;
                console.log(db)
                db.collection('documents').doc(this.props.docId)
                .get().then((doc)=>{
                    pdf.save(doc.data().name+".pdf");
                }).catch((error)=>{alert(error.message)}) 
            });
        }else{
            alert('No Content!')
        }
    }
    render(){
        return <button onClick={this.getCanvas.bind(this)}>
            <img src="/images/download.png" />
        </button>
    }
}



class DocBtn extends React.Component{
    constructor(props){
        super(props);
        this.editArea = React.createRef();
        this.state = {
            selection: null,
            fontSizeIsFocus: false,
            record: [],
            step: 0,
            position: null,
            imgurl: null
        }
    }
    render(){
        console.log(this.state.record ,this.state.step)
        return <div className="doc-btn">
            <div className="btns-wrap">
                <div className="btns">
                    <UndoBtn step={this.state.step} record={this.state.record} updateRecord={this.updateRecord.bind(this)} />
                    <FontSizeBtn surroundSelection={this.surroundSelection.bind(this)} remainSelection={this.remainSelection.bind(this)} changeFocus={this.changeFocus.bind(this)}/>
                    <BoldBtn surroundSelection={this.surroundSelection.bind(this)}/>
                    <UnBoldBtn surroundSelection={this.surroundSelection.bind(this)}/>
                    <ItalicBtn surroundSelection={this.surroundSelection.bind(this)}/>
                    <UnItalicBtn surroundSelection={this.surroundSelection.bind(this)}/>
                    <ColorBtn surroundSelection={this.surroundSelection.bind(this)}/>
                    <BackgroundColorBtn surroundSelection={this.surroundSelection.bind(this)} />
                    <ClearBackgroundColorBtn surroundSelection={this.surroundSelection.bind(this)} />
                    <ImgBtn storage={this.props.storage} docId={this.props.docId} position={this.state.position} getImgurl={this.getImgurl.bind(this)} />
                    <DownloadBtn docId={this.props.docId} db={this.props.db}  />
                </div>
            </div>
            <DocText 
                ref={this.editArea}
                db={this.props.db}
                docId={this.props.docId}
                recordText={this.recordText.bind(this)}
                detectUpload={this.props.detectUpload}
                recordPosition={this.recordPosition.bind(this)}
                imgurl={this.state.imgurl}
            />
        </div>
    }

    recordPosition(e){
        console.log(e.pageX, e.pageY)
        this.setState({
            position: {x: e.pageX, y:e.pageY}
        })
    }
    getImgurl(url){
        this.setState({
            imgurl: url
        }, this.clearImgurl)
    }
    clearImgurl(){
        this.setState({
            imgurl: null
        })
    }
    recordText(currentHTML){
        if(this.state.record[this.state.record.length-1] !== currentHTML){
            this.setState((preState) => ({
                step: preState.step+1,
                record: preState.record.concat([currentHTML])
            }))
        }
    }
    updateRecord(){
        this.setState((preState) => ({
            step: preState.step-2,
            record: preState.record.splice(0, preState.record.length-2)
        }))
    }

    changeFocus(e){
        this.setState({
            fontSizeIsFocus: true
        })
    }

    remainSelection(e){
        e.preventDefault();
    }



    surroundSelection(elementType, className, style) {
        function getAllDescendants (node, callback) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes[i];
                getAllDescendants(child, callback);
                callback(child);
            }
        }
        function glueSplitElements (firstEl, secondEl){
            let done = false;
            let result = [];
            if(firstEl === undefined || secondEl === undefined){
                return false;
            }
            if(firstEl.nodeName === secondEl.nodeName){
                result.push([firstEl, secondEl]);
                while(!done){
                    firstEl = firstEl.childNodes[firstEl.childNodes.length - 1];
                    secondEl = secondEl.childNodes[0];
                    if(firstEl === undefined || secondEl === undefined){
                        break;
                    }
                    if(firstEl.nodeName !== secondEl.nodeName){
                        done = true;
                    } else {
                        result.push([firstEl, secondEl]);
                    }
                }
            }
            for(let i = result.length - 1; i >= 0; i--){
                let elements = result[i];
                while(elements[1].childNodes.length > 0){
                    elements[0].appendChild(elements[1].childNodes[0]);
                }
                elements[1].parentNode.removeChild(elements[1]);
            }
        }

        // abort in case the given elemenType doesn't exist.
        try {
            document.createElement(elementType);
        } catch (e){
            return false;
        }

        // 開始呼叫
        let selection = window.getSelection();
        if(selection.rangeCount > 0){
            let range = selection.getRangeAt(0);
            let rangeContents = range.extractContents();
            let nodesInRange  = rangeContents.childNodes;
            let nodesToWrap   = [];

            for(let i = 0; i < nodesInRange.length; i++){
                if(nodesInRange[i].nodeName.toLowerCase() === "#text"){
                    nodesToWrap.push(nodesInRange[i]);
                } else {
                    getAllDescendants(nodesInRange[i], function(child){
                        if(child.nodeName.toLowerCase() === "#text"){
                            nodesToWrap.push(child);
                        }
                    });
                }
            };

            for(let i = 0; i < nodesToWrap.length; i++){
                let child = nodesToWrap[i];
                let wrap = document.createElement(elementType);
                wrap.className = className;
                if(style){
                    wrap.setAttribute('style', style);
                }

                if(child.nodeValue.replace(/(\s|\n|\t)/g, "").length !== 0){
                    child.parentNode.insertBefore(wrap, child);
                    wrap.appendChild(child);
                } else {
                    wrap = null;
                }
            }
            let firstChild = rangeContents.childNodes[0];
            let lastChild = rangeContents.childNodes[rangeContents.childNodes.length - 1];
            range.insertNode(rangeContents);
            glueSplitElements(firstChild.previousSibling, firstChild);
            glueSplitElements(lastChild, lastChild.nextSibling);
            rangeContents = null;
        }
    };
}





export {DocBtn} ;