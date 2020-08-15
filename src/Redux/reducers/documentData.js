import React from 'react'
import ReactDOM from 'react-dom'
import {SET_NEW_DOCID} from '../actions/actionType';
import {setNewDocId} from '../actions/action';

const initState = {
  docId: null
}
export const docIdReducer = (state=initState, action)=>{
  switch(action.type){
    case SET_NEW_DOCID: return {
      docId: action.docId
    }
    default: return state
  }
}