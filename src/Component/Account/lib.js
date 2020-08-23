function formatTime(time){
  let year = new Date(time).getFullYear();
  let month = new Date(time).getMonth()+1;
  let date = new Date(time).getDate();
  let hour = new Date(time).getHours();
  if(hour.toString().length<2){
    hour = "0"+hour;
  }
  let minute = new Date(time).getMinutes();
  if(minute.toString().length<2){
    minute = "0"+minute;
  }
  return year+" / "+month+" / "+date+" "+hour+": "+minute;
}

export{formatTime};