import {HANDLE_EDITORS_IDENTITY} from './actionType';

const handleEditorsIdentity = (identity)=>{
    return{
        type: HANDLE_EDITORS_IDENTITY,
        editorIdentity: identity
    }
}

export {handleEditorsIdentity};