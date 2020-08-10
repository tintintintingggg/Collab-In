function justifyNumberToTwoDigits(number){
    if(number.toString().length<2){
        return number = '0'+number;
    }else{
        return number.toString();
    }
};

export {justifyNumberToTwoDigits};