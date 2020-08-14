import {combineReducers} from 'redux';
import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import {SET_CURRENT_USER, HANDLE_EDITORS_IDENTITY} from './actionType';
import {changeUser, handleEditorsIdentity} from './action';

const initState = {
  user: undefined
}
const userReducer = (state=initState, action)=>{
  switch(action.type){
    case SET_CURRENT_USER: return {
      user: action.user
    }
    default: return state
  }
}
export default userReducer;