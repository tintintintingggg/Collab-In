import {combineReducers} from "redux";
import React from "react";
import ReactDOM from "react-dom";
import {userReducer, setNewUserNameReducer, setUserCredentialReducer} from "./userData";
import {docIdReducer} from "./documentData";
import {saveSignReducer} from "./textEditorData";
import {isHeaderFixedReducer} from "./homepage";

const appReducer = combineReducers({
  userReducer,
  docIdReducer,
  saveSignReducer,
  setNewUserNameReducer,
  setUserCredentialReducer,
  isHeaderFixedReducer
});

export default appReducer;