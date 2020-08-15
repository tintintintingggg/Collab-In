import {SET_CURRENT_USER, 
        HANDLE_EDITORS_IDENTITY,
        SET_NEW_DOCID,
        SET_DOCUMENT_TEXT_SAVE_SIGN,
        SET_USER_NAME,
        SET_USER_CREDENTIAL,
        IS_HEADER_FIXED
} from './actionType';

// user data
export const changeUser = (user)=>{
    return{
        type: SET_CURRENT_USER,
        user: user
    }
}
export const setUserName = (newUserName)=>{
    return{
        type: SET_USER_NAME,
        newUserName: newUserName
    }
}
export const setUserCredential = (userCredential)=>{
    return{
        type: SET_USER_CREDENTIAL,
        userCredential: userCredential
    }
}

// document data
export const handleEditorsIdentity = (identity)=>{
    return{
        type: HANDLE_EDITORS_IDENTITY,
        editorIdentity: identity
    }
}

export const setNewDocId = (docId)=>{
    return{
        type: SET_NEW_DOCID,
        docId: docId
    }
}

// text editor data
export const setDocumentTextSaveSign = (saved)=>{
    return{
        type: SET_DOCUMENT_TEXT_SAVE_SIGN,
        saved: saved
    }
}

// homepage
export const handleHeaderFixed = (isHeaderFixed)=>{
    return{
        type: IS_HEADER_FIXED,
        isHeaderFixed: isHeaderFixed
    }
}