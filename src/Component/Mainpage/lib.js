function justifyNumberToTwoDigits(number){
  if(number.toString().length<2){
    return number = "0"+number;
  }else{
    return number.toString();
  }
}

function formatDate(time){
  let date = new Date(time).getDate();
  date = justifyNumberToTwoDigits(date);
  let month = new Date(time).toLocaleString("en-us", {month: "long"});
  let year = new Date(time).getFullYear();
  return {date: date, month: month, year: year};
}

export {justifyNumberToTwoDigits, formatDate};
