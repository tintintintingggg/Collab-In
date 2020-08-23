import React from "react";
// redux
import {connect} from "react-redux";

class PrevStep extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div className='docPrevStep'>
      <div className="container">
        <button 
          onClick={()=>{this.props.handleEditor(this.props.user);}}
        >Add To Group</button>
      </div>
    </div>;
  }
}

const mapStateToProps = (store)=>{
  return{user: store.userReducer.user};
};
export default connect(mapStateToProps)(PrevStep);