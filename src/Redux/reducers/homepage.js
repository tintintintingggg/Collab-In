import React from 'react'
import ReactDOM from 'react-dom'
import {IS_HEADER_FIXED} from '../actions/actionType';
import {handleHeaderFixed} from '../actions/action';

const initState={
    isHeaderFixed: false
};
export const isHeaderFixedReducer = (state=initState, action)=>{
    switch(action.type){
        case IS_HEADER_FIXED: return{
            isHeaderFixed: action.isHeaderFixed
        };
        default: return state;
    }
}