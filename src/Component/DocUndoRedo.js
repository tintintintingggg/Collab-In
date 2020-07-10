import React from 'react';

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
            還原
        </button>
    }
}


class DocUndoRedo extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div>
            <UndoBtn step={this.props.step} record={this.props.record} updateRecord={this.props.updateRecord}/>
        </div>
    }
}

export {DocUndoRedo};
