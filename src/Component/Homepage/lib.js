function setDocId(currentId, newId){
    if(currentId){
        return currentId;
    }else if(newId){
        return newId;
    }else{
        return null;
    }
}

export {setDocId};