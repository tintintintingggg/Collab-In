import {combineReducers} from 'redux';
import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import {HANDLE_EDITORS_IDENTITY} from './actionType';
import {handleEditorsIdentity} from './action';

const initState = {
  user: undefined
}
const reducer = (state=initState, action)=>{
  switch(action.type){
    case HANDLE_EDITORS_IDENTITY: return {
      user: action.user
    }
    default: return state
  }
}
export default reducer;