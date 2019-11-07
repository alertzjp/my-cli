/*
*时间转换
*/
let formatDate = (time,type) => {
  type = type || 'date'
  time = time ? parseInt(time, 10) : null
  let  result = ''
  if (time) {
    let  tdate = new Date(time * 1000)
    let  year = tdate.getFullYear()
    let  month = tdate.getMonth() + 1
    let  date = tdate.getDate()
    let  hour = tdate.getHours()
    let  minute = tdate.getMinutes()
    let  second = tdate.getSeconds()
    month = month > 9 ? month : '0' + month
    date = date > 9 ? date : '0' + date
    hour = hour > 9 ? hour : '0' + hour
    minute = minute > 9 ? minute : '0' + minute
    second = second > 9 ? second : '0' + second
    result = [year, month, date].join('-')
    if (type == 'time') {
        result += ' ' + [hour, minute, second].join(':')
    }
  }
  return result
}

/*
*value.toString().replace(/\B(?=(\d{3})+$)/g,',');
*千位分割符
*/
let disnum = value =>{
   return value.toString().replace(/\B(?=(\d{3})+$)/g,',')
}

/*
*数字过滤比如银行卡和或者手机号不是显示完整的112364****123456
*/
let ShowDisnum = value => {
  if(value){
     let  str = value.substring(0,4) + "****" + value.substring(value.length-4,value.length)
     return str
  }
  return ""
}

/*
*车辆状态@bikeStatus
*/

let bikeStatus = value => {
  if(value){
    let str = ""
    if(value==1){
      str="待生产"
    }
    if(value==2){
      str="已生产"
    }
    if(value==3){
      str="合格"
    }
    if(value==4){
      str="不合格"
    }
    if(value==5){
      str="出厂"
    }
    if(value==10){
      str="低电量充电"
    }
    if(value==12){
      str="待租"
    }
    if(value==21){
      str="临时停车"
    }
    if(value==20){
      str="已借出"
    }
    if(value==30){
      str="车辆故障"
    }
    if(value==41){
      str="维修中"
    }
    if(value==42){
      str="维修完成"
    }
    if(value==49){
      str="报废"
    }
    if(value==60){
      str="车辆故障(已售)"
    }
    if(value==60){
      str="车辆故障(已售)"
    }
    if(value==61){
      str="维修中(已售)"
    }
    if(value==62){
      str="维修完成(已售)"
    }
    if(value==99){
      str="报废(已售)"
    }
    return str
  }
  return ""
}

let changestatus = val => {
  let  str="";
    switch (val) {
      case 1:
        str="未使用"
        break;
      case 2:
        str="已装配"
        break;
      case 3:
        str="入库"
        break;
      case 4:
        str="运营中"
        break;
      case 5:
        str="已分配"
        break;
      case 6:
        str="出库"
        break;
      case 7:
        str="报废"
        break;
    }
    return str;
}


export { formatDate,disnum,ShowDisnum,bikeStatus,changestatus}
