import React from "react";
import ReactDOM from "react-dom";
import {SET_CURRENT_USER, SET_USER_NAME, SET_USER_CREDENTIAL} from "../actions/actionType";
import {changeUser, setUserName, setUserCredential} from "../actions/action";

const initState = {
  user: undefined,
  newUserName: undefined,
  userCredential: null
};
export const userReducer = (state=initState, action)=>{
  switch(action.type){
  case SET_CURRENT_USER: return {
    user: action.user
  };
  default: return state;
  }
};
export const setNewUserNameReducer = (state=initState, action)=>{
  switch(action.type){
  case SET_USER_NAME: return{
    newUserName: action.newUserName
  };
  default: return state;
  }
};
export const setUserCredentialReducer = (state=initState, action)=>{
  switch(action.type){
  case SET_USER_CREDENTIAL: return{
    userCredential: action.userCredential
  };
  default: return state;
  }
};
