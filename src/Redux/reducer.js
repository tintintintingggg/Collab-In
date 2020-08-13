import {combineReducers} from 'redux';
import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import {CHANGE_USER} from './actionType';

const initState = {
  user: null
}
const userReducer = (state=initState, action)=>{
  switch(action.type){
    case CHANGE_USER: return {
      ...state,
      user: 'uuu'
    }
    default: return state
  }
}
export default userReducer;