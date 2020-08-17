import React from 'react';
import {DocText} from './DocText';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {db, storage} from '../../../utils/firebase';
import '../../../css/DocBtn.css';


class UndoBtn extends React.Component{
    constructor(props){
        super(props);
    }
    undo(){
        if(this.props.selectableArea){
            if(this.props.step>1){
                this.props.selectableArea.innerHTML = this.props.record[this.props.step-2];
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
    }
    render(){
        return <button onClick={()=>{this.props.changeStyle('span', 'bold', null)}}>
            <img src="/images/bold-1.png" />
        </button>
    }
}
class UnBoldBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <button onClick={()=>{this.props.changeStyle('span', 'un-bold', null)}}>
            <img src="/images/bold-remove.png" />
        </button>
    }
}
class ItalicBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <button onClick={()=>{this.props.changeStyle('span', 'italic', null)}}>
            <img src="/images/italic-1.png" />
        </button>
    }
}
class UnItalicBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <button onClick={()=>{this.props.changeStyle('span', 'un-italic', null)}}>
            <img src="/images/italic-remove.png" />
        </button>
    }
}

class ColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    getEventTargetValue(e){
        this.props.changeStyle('span', 'color', 'color: '+e.target.value)
    }
    render(){
        return <div className="colorbtn"><input id="color-input" type="color" 
            onChange={this.getEventTargetValue.bind(this)}
         /></div>
    }
}
class BackgroundColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    getEventTargetValue(e){
        this.props.changeStyle('span', 'background-color', 'background-color: '+e.target.value)
    }
    render(){
        return <div className="background-colorbtn"><input id="background-color-input" type="color" 
            onChange={this.getEventTargetValue.bind(this)}
         /></div>
    }
}
class ClearBackgroundColorBtn extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <button onClick={()=>{this.props.changeStyle('span', 'un-color', null)}}>
            <img src="/images/remove-color.png" />
        </button>
    }
}
class FontSizeBtn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: 16,
            showList: false
        }
    }
    getValue(e){
        this.setState({
            value: e.target.value
        })
    }
    showList(){
        this.setState(prevState=>({
            showList: !prevState.showList
        }))
    }
    getEventTargetValue(e){
        this.showList();
        this.props.changeStyle('span', 'font-size', 'font-size: '+e.target.innerText+'px');
    }
    render(){
        let btns = [];
        let fontsizeList = [8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96];
        fontsizeList.forEach(item=>{
            let btn = <button key={'fontsize'+item}>{item}</button>
            btns.push(btn)
        })
        return <div className="font-size-btn">
            <div className="font-size-btn-arrow">
                <button onClick={this.showList.bind(this)}><img src="/images/font-size.png" /></button>
            </div>
            <div className="font-size-btn-list" style={{display: this.state.showList ? 'block' : 'none'}} onClick={this.getEventTargetValue.bind(this)}>
                {btns}
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
        let storageRef = storage.ref(docId+'/'+file.name); 
        // upload file
        storageRef.put(file).then(()=>{
            return storageRef.getDownloadURL();
        }).then(url=>{
            return this.props.getImgurl(url);
        }).catch((error)=>{alert(error.message)})
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
        </div>;
    }
}
class DownloadBtn extends React.Component{
    constructor(props){
        super(props);
    }
    getCanvas(){
        let div = this.props.selectableArea;
        window.scroll(0,0)
        html2canvas(div)
        .then((canvas)=>{
            const imgData = canvas.toDataURL('image/png', 1);
            const pdf = new jsPDF("p", "mm", "a4");
            let width = pdf.internal.pageSize.getWidth();
            let height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 10, 10, width-20, height-20);
            db.collection('documents').doc(this.props.docId)
            .get()
            .then((doc)=>{
                pdf.save(doc.data().name+".pdf");
            })
            .catch((error)=>{alert(error.message)}) 
        });
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
            selectableArea: null,
            record: [],
            step: 0,
            imgurl: null
        }
    }
    render(){
        // console.log(this.state.record ,this.state.step)
        return <div className="doc-btn">
            <div className="btns-wrap">
                <div className="btns">
                    <UndoBtn step={this.state.step} record={this.state.record} updateRecord={this.updateRecord.bind(this)} selectableArea={this.state.selectableArea} />
                    <FontSizeBtn changeStyle={this.changeStyle.bind(this)} />
                    <BoldBtn changeStyle={this.changeStyle.bind(this)} />
                    <UnBoldBtn changeStyle={this.changeStyle.bind(this)} />
                    <ItalicBtn changeStyle={this.changeStyle.bind(this)} />
                    <UnItalicBtn changeStyle={this.changeStyle.bind(this)} />
                    <ColorBtn changeStyle={this.changeStyle.bind(this)} />
                    <BackgroundColorBtn changeStyle={this.changeStyle.bind(this)} />
                    <ClearBackgroundColorBtn changeStyle={this.changeStyle.bind(this)} />
                    <ImgBtn docId={this.props.docId} getImgurl={this.getImgurl.bind(this)} />
                    <DownloadBtn docId={this.props.docId} selectableArea={this.state.selectableArea}  />
                </div>
            </div>
            <DocText 
                ref={this.editArea}
                docId={this.props.docId}
                recordText={this.recordText.bind(this)}
                detectUpload={this.props.detectUpload}
                imgurl={this.state.imgurl}
            />
        </div>;
    }
    componentDidMount(){
        this.setState({
            selectableArea: this.editArea.current.selectableArea.current
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
    changeStyle(elementType, className, style){
        if(!window.getSelection().getRangeAt(0).collapsed){
            this.surroundSelection(elementType, className, style)
        }
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

export {DocBtn};