let iView = require('iView')
//保存缓存里
function saveStorage (typeName,typedata){
    window.sessionStorage.setItem(typeName, typedata)
    return
}

//获取缓存里
function getStorage (typeName){
    return window.sessionStorage.getItem(typeName)
}

//删除
function removeItem (typeName) {
  return window.sessionStorage.removeItem(typeName)
}

//时间格式转换
function gettime (type,time) {
  type = type || 'date'
  time = time ? parseInt(time, 10) : null
  let  result = '---'
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
//utc 时间转换
function timeUTC (date) {
  let  dateTime = new Date(+new Date(date)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  return dateTime
}
//数字不够12位，用0来替代
function disnum12 (val) {
  let  itemlength = ""+val
   let  str = ""
   for(let  i=0;i<12-itemlength.length;i++){
      str = ""+str+0
   }
   if(itemlength.length<12){
     let  num = str+""+val
     return disnum(num)
   }
}
//数字很大，3数，前面加一个逗号
function disnum(number) {
  if(number){
    if (number.length <= 3)
      return (number == '' ? '0' : number);
    else {
      let  mod = number.length % 3;
      let  output = (mod == 0 ? '' : (number.substring(0, mod)));
      for (let  i = 0; i < Math.floor(number.length / 3); i++) {
        if ((mod == 0) && (i == 0))
          output += number.substring(mod + 3 * i, mod + 3 * i + 3);
        else
          output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
      }
      return (output);
    }
  }else {
    return
  }
}

function getnum (num) {
  let  result = [], counter = 0;
    num = (num || 0).toString().split('');
    for (let  i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}
//订单状态
function orderstatus (code){
  let str = ""
  let staus = [
    {id:1,name:"待支付"},
    {id:2,name:"待发货"},
    {id:3,name:"待取货"},
    {id:4,name:"已取货"},
    {id:5,name:"取消"},
    {id:6,name:"订单关闭"},
    {id:7,name:"失效"},
    {id:8,name:"退货"}
  ]
   staus.forEach(function (item) {
     if(item.id == code){
        str = item.name
     }
   })
  return str
}
 
//过滤null unfinued
function filtering(data) {
  var reset = {};
  if(typeof(data)=='object'){
    Object.keys(obj).forEach(function(key){
      if(obj[key]==null || obj[key]==undefined){
        reset[key] = "";
      }else{
        reset[key] = obj[key];
      }            
    });
  }
  return reset
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

let xpmopedStatus = value => {
  if(value){
    let str = "";
    if(value==1){
      str="待投放"
    }
    if(value==2){
      str="待租"
    }
    if(value==3){
      str="临时停车"
    }
    if(value==4){
      str="骑行"
    }
    if(value==5){
      str="报障中"
    }
    if(value==6){
      str="维修开锁"
    }
    if(value==7){
      str="维修完成"
    }
    if(value==8){
      str="报废"
    }
    return str
  }
  return ""
}

//强制保存小数点后面两位
function toDecimal2(x) {
  var  f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
  var  f = Math.round(x*100)/100;
  let  s = f.toString();
  let  rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return parseFloat(s);
}

function dealElement(obj){
    let  param = {};
    if ( obj === null || obj === undefined || obj === "" ) return param;
    for ( let  key in obj ){
        if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
            param[key] = obj[key];
        }
    }
    return param;
}

//对象转换url
function http_builder_url(url, data) {
      if(typeof(url) == 'undefined' || url == null || url == '') {
          return '';
      }
      if(typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
          return '';
      }
      url += (url.indexOf("?") != -1) ? "" : "?";
      for(let  k in data) {
          url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
      }
      return url;
}

//查看图片
function getimgurl (url,option) {
  var option = option || {}
  var yes = option.yes || ""
  var width = 100
      if(window.innerWidth>1500){
        width = (window.innerWidth) - 500
      }else if(window.innerWidth>1000 && window.innerWidth<1500){
         width = (window.innerWidth) - 200
      }
      else{
        width = (window.innerWidth)
      }
   var height=((window.innerHeight)-200)+"px"
   iView.Modal.confirm({
      title:"",
      closable:true,
      scrollable:true,
      width:width,
      content:`<div class='widthimgbox' ><img style="max-height:${height}" src="${url}" class='widthimg'></div>`,
      onOk:function () {
        yes&&yes()
      }
   })
}


function Messinfo (reoption) {
  let  option = reoption || {}
  let  title = reoption.title || "确认提示"
  let  content = reoption.content || ""
  let  yes = reoption.yes || ""
  let  cancel = reoption.cancel || ""
   iView.Modal.confirm({
      title:title,
      width:"600",
      closable:true,
      content:content,
      onOk:function () {
        yes&&yes()
      },
      onCancel:function(){
        cancel&&cancel()
      }
   })
}

//导出表
function exportTable(url,data,res){
  if(res&&res.code&&res.code!=1001){
    // ElementUi.Message({
    //    message: res.msg,
    //    type: 'error'
    //  });
      iView.Message.warning(res.msg)
  }else{
    const root = process.env.API_ROOT
    let  urls=root+url;
    window.location.href=http_builder_url(urls, data);
  }
}

function itemkey (obj) {
  let  str = ''
  for ( let  key in obj ){
      if ( obj[key] !== null && obj[key] !== undefined && obj[key] !== "" ){
        str += key + ':'+ obj[key] + ";"
      }
  }
  return str;
}
function top () {
  let webshellbd = document.getElementById('webshellbd')
  if(webshellbd){
    webshellbd.scrollTo(0,0)
  }
}

function timemin (value) {
  let  str = ''
  if(value==''){

  }else{
      let  days = parseInt(value/1440);
      let  hous = parseInt(value/60);
      // let  min = parseInt(value) - hous*60;
      let  min = parseInt(value);
      if (days>0) {
        str =  getnum(min)+'分钟' + getnum(hous)+'小时' + "约"+getnum(days)+'天'
      }
      else if(hous>0){
        str =  getnum(min)+'分钟'+ getnum(hous)+'小时'
      }
      else{
          str = getnum(min)+'分钟'
      }
  }
  return  str
}


function timehousmin (value) {
  let  str = ''
  if(value==''){

  }else{
      let  hous = parseInt(value/60);
      let  min = parseInt(value) - hous*60;
      if(hous>0){
          str = hous+'小时'+ min+'分钟'
      }else{
          str = min+'分钟'
      }
  }
  return  str
}

function baifen (value) {
   let  str = parseFloat(value).toFixed(4);
   let  num =  parseFloat(str*100).toFixed(2);
   let  renum = parseFloat(num)
   return renum+'%'
}

//累计公里数
function gongli (value) {
  let  returnvalue = ((parseFloat(value)/60).toFixed(0))*12
  return  getnum(returnvalue)+'km'
}
//节约油耗
function youhao (value) {
  let  returnvalue =  ((parseFloat((parseFloat(((parseFloat(value)/60).toFixed(0))*12))/100))*12).toFixed(2)
  return getnum(returnvalue)+'L'
}
//碳排放
function tan (value) {
  let  tan1 =(parseFloat((parseFloat(parseFloat((parseFloat((parseFloat(((parseFloat(value)/60).toFixed(2)))/100))*12).toFixed(2))*0.72)).toFixed(1))*0.71).toFixed(2)   // 立平方
  let  returnvalue = parseFloat((parseFloat((parseFloat((parseFloat((parseFloat(((parseFloat(value)/60).toFixed(0))*12))/100))*12).toFixed(2))*0.000725))*2.62).toFixed(4)
  return getnum(returnvalue)+'吨'
}

function tan01 (value) {
  let  tan1 =(parseFloat((parseFloat(parseFloat((parseFloat((parseFloat(((parseFloat(value)/60).toFixed(2)))/100))*12).toFixed(2))*0.72)).toFixed(1))*0.71).toFixed(2)   // 立平方
  let  str = parseFloat((parseFloat((parseFloat((parseFloat((parseFloat(((parseFloat(value)/60).toFixed(0))*12))/100))*12).toFixed(2))*0.000725))*2.62).toFixed(4)
  return str
}

//解决长时间不操作的值
 function seetime () {
   let newtime = new Date().getTime();
   let expTime = getStorage('expTime') || 0;
   return expTime>0?(newtime-expTime)>3600000:false
 }


 function getUrlParam(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return decodeURIComponent(r[2]);
     return null;
 }

 //切换屏幕
 function tabsize (type,value,list) {
   var list = list || [24,12,8,6,6,4]
   if(type==1){
     return true
   }
   let width  = document.body.clientWidth;  // 获取屏幕的宽度
   if(width<=992){
     return value<=2
   }
   if(width>992 && width<=1400){
     console.log(value)
     return value<=3
   }
   if(width>1400 && width<1600){
     return value<=4
   }
   if(width>=1600){
     return value<=5
   }
   // let andy = [480,576,768,992,1200,1600] // 获取尺寸
   // let itemindex = 0;
   // andy.forEach((a,index)=>{
   //    let numindex = 0
   //    if(a - width<numindex){
   //      itemindex = index
   //    }
   // })
   // let itemList = list[itemindex]
   // return value<=(parseInt(24/itemList))
 }

// 保存缓存里
export default {
    save: function (typeName,typedata) {
      return saveStorage(typeName,typedata)
    },
    get: function (typeName) {
      return getStorage(typeName)
    },
    removeItem:function (typeName){
      return removeItem(typeName)
    },
    gettime: function (type,time) {
      return gettime(type,time)
    },
    toDecimal2:function(num){
      return toDecimal2(num)
    },
    getorderstatus:function (str) {
      return orderstatus(str)
    },
    getdisnum12:function (val) {
      return disnum12(val)
    },
    GETDISNUM:function (val) {
      return getnum(val)
    },
    timeUTC:function (date) {
       return timeUTC(date)
    },
    getobjurl:function (url,data) {
        return http_builder_url(url,data)
    },
    getimg:function (url) {
      return getimgurl(url)
    },
    getMessinfo:function (option) {
      return Messinfo(option)
    },
    getdealElement:function (option) {
      return dealElement(option)
    },
    getbikeStatus:function (option) {
      return bikeStatus(option)
    },
    getxpmopedStatus:function (option) {
      return xpmopedStatus(option)
    },
    exportTable:function (url,data,res) {
       return exportTable(url,data,res)
    },
    getitemkey:function (data) {
       return itemkey(data)
    },
    GETTOP:function (data) {
       return top(data)
    },
    GETTIMEMIN:function (value) {
      return timemin(value)
    },
    GETBAIFEN:function (value) {
      return baifen(value)
    },
    GETGONGLI:function (value) {
      return gongli(value)
    },
    GETYOUHAO:function (value) {
      return youhao(value)
    },
    GETTAN:function (value) {
      return tan(value)
    },
    GETTAN01:function (value) {
      return tan01(value)
    },
    GETtIMEHOUS:function (value) {
      return timehousmin(value)
    },
    GETBAIFEI:function (value) {
      return baifen(value)
    },
    GETSEETIME () {
       return seetime()
    },
    getUrlParam (name) {
      return getUrlParam(name)
    },
    GETTABSIZE (type,value,list) {
      return tabsize(type,value,list)
    },
    GETFILTER (data) {
      return filtering(data)
    }    
}
