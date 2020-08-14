import {SET_CURRENT_USER, HANDLE_EDITORS_IDENTITY} from './actionType';
const changeUser = (user)=>{
    return{
        type: SET_CURRENT_USER,
        user: user
    }
}

const handleEditorsIdentity = (identity)=>{
    return{
        type: HANDLE_EDITORS_IDENTITY,
        editorIdentity: identity
    }
}

export {changeUser, handleEditorsIdentity};