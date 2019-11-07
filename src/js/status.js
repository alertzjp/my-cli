let  status = {
     bikeStatusdata () {
       let  data = [
         {value:0,name:"待投放"},
         {value:1,name:"可租"},
         {value:2,name:"骑行"},
         {value:3,name:"维护开锁"},
         {value:4,name:"报废"},
         {value:5,name:"车辆故障"},
         {value:6,name:"带回"},
         {value:7,name:"维修完成"},
         {value:8,name:"临停"},
         {value:9,name:"调度"},
         {value:10,name:"丢失"},
        ]
       return data
     },
     bicycleStatus (value) {
       let  str = ""
       let  data = status.bikeStatusdata()
       if(value!==undefined && value!==null){
         data.forEach((e)=>{
           if(e.value == parseInt(value)){
             str = e.name
           }
         })
         return str
       }
        return str
     },
     bicycleUserType (value) {
       let  str="";
         switch (value) {
           case 1:
             str="手机帐号"
             break;
           case 2:
             str="公交帐号"
             break;
           case 3:
             str="银行帐号"
             break;
           case 5:
             str="工商银行免押金账号"
             break;
         }
         return str;
     },
     changestatus (val) {
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
     },
     docksiteType (value) {
       let  str = ''
        if(parseInt(value)==1){
            str = '一代站点'
        }
        else if(parseInt(value)==2){
            str = '二代站点'
        }
        return str
     },
     docksitestatus (value) {
       let  str = ''
        if(parseInt(value)==1){
            str = '运营中'
        }
        else if(parseInt(value)==-1){
            str = '关闭'
        }
        return str
     },
     OtherBikeList (value) {
       let  str = ''
        if(value.length>0){
          value.forEach((a)=>{
            str += a.enteringCompanyName+"("+a.bikeNum+")"
          })
        }
        return str
     },
     sitestatus (value) {
       // status   1  //设备正常
      // status   2 //电压不够线圈正常
      // status  3  //电压正常,线圈不正常
      // status  4  //电压,线圈都不正常
      // status  5  //设备断开连接
        let  str = ''
        if(parseInt(value)==1){
            str = '正常'
        }else if(parseInt(value)==2){
            //str = '电压不足'
            str = "正常"
        }
        else if(parseInt(value)==3){
            //str = '线圈异常'
             str = "正常"
        }
        else if(parseInt(value)==4){
            //str = '电压,线圈异常'
            str = "正常"
        }
        else if(parseInt(value)==5){
            str = '断开连接'
        }
        return str
     }
}

export default status
