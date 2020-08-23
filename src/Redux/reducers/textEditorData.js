import React from "react";
import ReactDOM from "react-dom";
import {SET_DOCUMENT_TEXT_SAVE_SIGN} from "../actions/actionType";
import {setDocumentTextSaveSign} from "../actions/action";

const initState={
  saved: true
};
export const saveSignReducer = (state=initState, action)=>{
  switch(action.type){
  case SET_DOCUMENT_TEXT_SAVE_SIGN: return {
    saved: action.saved
  };
  default: return state;
  }
};