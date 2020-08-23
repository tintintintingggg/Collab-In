import React from "react";
import {Auth} from "../Auth";
import MainPage from "../Mainpage";
import Account from "../Account";
import HomepageContent from "./HomepageContent/HomepageContent";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import {db} from "../../utils/firebase";
import "../../css/Homepage.css";
// redux
import {connect} from "react-redux";
import * as actionCreators from "../../Redux/actions/action";

class Homepage extends React.Component{
  constructor(props){
    super(props);
  }
  handleDocCreate(){
    if(this.props.user){
      let uid = this.props.user.uid;
      let newDoc = db.collection("documents").doc();
      newDoc.set({
        name: "Untitled document",
        owner: uid,
        time: Date.now(),
        text: " ",
        version: 0,
        editorsList: []
      }).then(()=>{
        return db.collection("users").doc(uid).collection("userdocs").doc(newDoc.id).set({
          time: Date.now()
        });
      }).then(()=>{
        return db.collection("chatrooms").doc(newDoc.id).collection("members").doc(uid).set({
          time: Date.now(),
          id: uid
        });
      }).then(()=>{
        return db.collection("status").doc(newDoc.id).collection("online").doc("total").set({
          total: []
        });
      }).then(()=>{
        this.props.setNewDocId(newDoc.id);
      }).catch((error)=>{console.log(error.message);});
    }else{
      alert("Sign In First!");
    }
  }
  render(){
    return <BrowserRouter>
      <Route exact path='/' >
        {this.props.docId ? <Redirect to={"/document/"+this.props.docId} /> : 
          <HomepageContent
            signOut={this.props.signOut}
            handleDocCreate={this.handleDocCreate.bind(this)}
          />}
      </Route>
      <Route path="/authentication" render={(props)=>{
        let routeProps = props.history;
        return <Auth 
          signUp={this.props.signUp}
          signIn={this.props.signIn}
          googleSignIn={this.props.googleSignIn}
          facebookSignIn={this.props.facebookSignIn}
          routeProps={routeProps}
        />;
      }} />
      <Route path={"/document/:docId"} render={(props)=>{
        return <MainPage
          docId={props.match.params.docId}
        />;
      }} />
      <Route exact path={"/account/:uid"}  render={(props)=>{
        let page = (
          this.props.docId ? <Redirect to={"/document/"+this.props.docId} /> 
            : <Account handleDocCreate={this.handleDocCreate.bind(this)} />);
        return page;
      }} />
    </BrowserRouter>;     
  }
}

const mapStateToProps = (store)=>{
  return{
    user: store.userReducer.user,
    docId: store.docIdReducer.docId
  };
};
export default connect(mapStateToProps, actionCreators)(Homepage);