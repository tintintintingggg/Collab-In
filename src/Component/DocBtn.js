import React from 'react';
import {DocText} from './DocText';
import '../css/DocBtn.css';

class ClearFormatBtn extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
    }
    changeFormat(e){
        if(document.getElementById('selectable-area').innerHTML !== ''){
            if(!window.getSelection().getRangeAt(0).collapsed){
                this.props.surroundSelection('span', 'clear', null)
            }
        }
    }
    render(){
        return <button onClick={this.changeFormat.bind(this)}>
            Clear
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
            粗體
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
            不粗
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
            斜體
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
            不斜
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
        return <input type="color" onChange={this.changeColor.bind(this)}/>
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
        let fontNumber = '▼'
        if(this.state.value){
            fontNumber = 'Font ▼';
        }
        return <div className="font-size-btn">
            <div className="font-size-btn-input" >
                {/* <input type="text" onKeyDown={this.changeFontSize.bind(this)} onChange={this.getValue.bind(this)} onMouseDown={this.props.changeFocus}
                    // defaultValue={this.state.value} 
                /> */}
            </div>
            <div className="font-size-btn-arrow">
                <button onClick={this.showList.bind(this)}>{fontNumber}</button>
            </div>
            <div className="font-size-btn-list" style={{display: this.state.listDisplay}} onClick={this.changeFontSize.bind(this)}>
            <button>8</button><button>10</button><button>12</button><button>14</button><button>16</button><button>18</button><button>20</button><button>24</button><button>30</button><button>36</button><button>48</button><button>60</button><button>72</button><button>96</button>
            </div>
        </div>
    }
}



class DocBtn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selection: null,
            fontSizeIsFocus: false
        }
    }
    render(){
        return <div>
            <div className="btns">
                <ClearFormatBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <BoldBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <UnBoldBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <ItalicBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <UnItalicBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <ColorBtn surroundSelection={this.surroundSelection.bind(this)}/>
                <FontSizeBtn surroundSelection={this.surroundSelection.bind(this)} remainSelection={this.remainSelection.bind(this)} changeFocus={this.changeFocus.bind(this)}/>
            </div>
            <DocText 
                db={this.props.db}
                docId={this.props.docId}
                // docId={id}
                // getSelection={this.getSelection.bind(this)}
                // fontSizeIsFocus={this.state.fontSizeIsFocus}
                // updateCurrentText={this.updateCurrentText.bind(this)}
            />
        </div>
    }

    

    changeFocus(e){
        this.setState({
            fontSizeIsFocus: true
        })
    }

    remainSelection(e){
        e.preventDefault();
    }

    // getSelection(){
    //     let selection = window.getSelection();
    //     if(!selection.getRangeAt(0).collapsed){
    //         console.log(selection.getRangeAt(0));
    //         this.setState({
    //             selection: selection
    //         })
    //     }
    // }


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