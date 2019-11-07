<template>
  <div class="remapbox">
    <div class="remapbox-hd">
        <div class="">
          <Row>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                    <entering-component @EmitcompanyComponent="EmitcompanyComponent" @EmitvalueComponent="EmitvalueComponent" :companyid="formCustom.enteringCompanyId"></entering-component>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="mt10">
                    <Buttoncomponent title="查询" @emitButton="search" long=1 :loading="loading"></Buttoncomponent>
                </div>
              </Col>
          </Row>
        </div>
        <div class="">
        </div>
    </div>
    <div class="cartip01" v-if="flag==1">
      <div class="iconbox">
        <img class="icon" :src="dayicon.fourday"><span> 【4-6天的沉默车】</span>
      </div>
      <div class="iconbox">
        <img class="icon" :src="dayicon.sevenday"><span> 【7天及以上的沉默车】</span>
      </div>
    </div>
    <div class="demo-spin-container" v-if="!spinshow">
     <Spin fix></Spin>
    </div>
    <el-amap vid="amapDemo01" :zoom="zoom" :center="center" class="amap-demo01" v-if="mapshow">
         <el-amap-polygon v-for="(polygon, index) in polygons" v-if='polygon.path[0]&&polygon.path[0].length>3'
         :vid="index"
         :ref="`polygon_${index}`"
         :path="polygon.path"
         :strokeColor="polygon.strokeColor"
         :strokeWeight="polygon.strokeWeight"
         :strokeOpacity="polygon.strokeOpacity"
         :fillOpacity="polygon.fillOpacity"
         :fillColor="polygon.fillColor"
         :zIndex="polygon.zIndex"
         ></el-amap-polygon>
         <el-amap-marker :position="mapding" :icon="icon" v-if="mapding.length>0"></el-amap-marker>
         <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="marker.icon" :events="marker.events" v-if="marker.show"></el-amap-marker>
         <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
     </el-amap>
  </div>
</template>
<script>
import enteringComponent from '../../pub/enteringCompany.vue'
export default {
  name: "",
  components:{
    enteringComponent,
  },
  data () {
    return {
      mapshow:false,
      loading:false,
      spinshow:false,
      flag:0,
      count: 1,
      data:[],
      model11:"",
      dayicon:{
        fourday:'',
        sevenday:''
      },
      clicknum:0,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      windows: [],
      window: '',
      icon:"/static/curmap.png",
      zoom: 13,
      path:[],
      center: [121.5273285, 31.21515044],
      componentMarker: {
        position: [121.5273285, 31.21315058],
      },
      polygons: [
            {
              path: [[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]],
              strokeColor: "#FF33FF",
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              fillColor: '#1791fc',
              zIndex: 50,
            }
      ],
      mapding:[],
      regionScope:[],
      bicycleIconList:[],
      formCustom:{
        enteringCompanyId:'',
        bicycle_no:"",
        docksiteNo:"",
        districtName:"",
        dockSiteName:"",
        address:"",
        longitude:"",
        latitude:""
      }
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.flag=this.$route.query.flag
    setTimeout(()=>{
      this.getdata()
    },300)
  },
  methods: {
    search () {
      this.getdata()
    },
    EmitvalueComponent(e){
      if(e){
        this.formCustom.enteringCompanyId=Number(e)
      }
    },
    EmitcompanyComponent (e) {
       if(e){
         this.formCustom.enteringCompanyId=Number(e.id)
       }
    },
    cancel () {
      this.$emit("EMITBIAOQIAN")
    },
    //沉默车
    getsilenceBicycle(){
      this.loading = true
      let windows = [];
      let listdata = {
        token:this.$webapi.get('token'),
        // bikeNo:this.formCustom.bikeNo,
        // day:this.formCustom.day,
        // enteringCompanyId:this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/tag/silenceBicycle/distribute',listdata,reset => {
        if (reset.codeId === 1) {
          let resetdata = []
          let data = reset.resData
          let idx = 0
          data.forEach((items,index)=>{
              let gpsLatitude = items.gpsLatitude/1000000
              let gpsLongitude = items.gpsLongitude/1000000
              let item = {
                show:true,
                bikeNo:items.bikeNo,
                companyName:items.companyName,
                day:items.day,
                position:[gpsLongitude,gpsLatitude],
                events: {
                    click() {
                      _this.clicknum = index
                      _this.windows.forEach(window => {
                        window.visible = false;
                      });
                      _this.window = _this.windows[index];
                      _this.$nextTick(() => {
                        _this.window.visible = true;
                      });
                    }
                  }
              }
              if(items.color==2){
                 item.icon = "/static/silencebike.png"
              }else if(items.color==3){
                item.icon = "/static/silencebike2.png"
              }
              resetdata.push(item)
              windows.push({
                  position: [gpsLongitude,gpsLatitude],
                  content: `<div class="prompt">
                  <p>
                  共享单车编号：${ items.bikeNo }
                  </p>
                  <p>
                  共享单车公司名称：${ items.companyName?items.companyName:"" }
                  </p>
                  <p>
                  沉默天数：${ items.day }
                  </p>
                  </div>`,
                  visible: false
              });
          })
          setTimeout(()=>{
             _this.mapshow = true
             if(data.length>0){
               _this.center = [data[0].gpsLongitude/1000000,data[0].gpsLatitude/1000000]
             }
             _this.data = resetdata
             _this.windows = windows;
           },1000)
          if(data.length<1){
             _this.data = []
          }
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    //外围车
    getperipheryBicycle(){
      this.loading = true
      let windows = [];
      let listdata = {
        token:this.$webapi.get('token'),
        // bikeNo:this.formCustom.bikeNo,
        // day:this.formCustom.day,
        // enteringCompanyId:this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/tag/periphery/distribute',listdata,reset => {
        if (reset.codeId === 1) {
          let resetdata = []
          let data = reset.resData
          let idx = 0
          data.forEach((items,index)=>{
              let gpsLatitude = items.gpsLatitude/1000000
              let gpsLongitude = items.gpsLongitude/1000000
              let item = {
                show:true,
                bikeNo:items.bikeNo,
                enteringCompanyName:items.enteringCompanyName,
                day:items.day,
                position:[gpsLongitude,gpsLatitude],
                events: {
                    click() {
                      _this.clicknum = index
                      _this.windows.forEach(window => {
                        window.visible = false;
                      });
                      _this.window = _this.windows[index];
                      _this.$nextTick(() => {
                        _this.window.visible = true;
                      });
                    }
                  }
              }
              item.icon='/static/bike.png'
              resetdata.push(item)
              windows.push({
                  position: [gpsLongitude,gpsLatitude],
                  content: `<div class="prompt">
                  <p>
                  共享单车编号：${ items.bikeNo }
                  </p>
                  <p>
                  共享单车公司名称：${ items.enteringCompanyName?items.enteringCompanyName:"" }
                  </p>
                  </div>`,
                  visible: false
              });
          })
          setTimeout(()=>{
             _this.mapshow = true
             if(data.length>0){
               _this.center = [data[0].gpsLongitude/1000000,data[0].gpsLatitude/1000000]
             }
             _this.data = resetdata
             // resetdata[0].position=[123.5273285, 32.21315058]
             // resetdata[1].position=[120.5273285, 31.21315058]
             // resetdata[2].position=[121.5273285, 30.21315058]
             _this.windows = windows;
           },1000)
          if(data.length<1){
             _this.data = []
          }
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    //统一接口
    getdata(){
      if(!this.formCustom.enteringCompanyId){
        this.$Message.warning("请选择要查看的共享单车公司")
        return
      }
      this.loading = true
      this.spinshow= false
      this.dayicon.fourday='/static/init1.png'
      this.dayicon.sevenday='/static/init1.png'
      let windows = [];
      let listdata = {
        token:this.$webapi.get('token'),
        type:this.flag,
        enteringCompanyId:this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/tag/shareBikeSP/distribute',listdata,reset => {
        _this.loading=false
        if (reset.codeId === 1) {
           this.data = []
           this.mapding = []
           let data = reset.resData
           this.window="" // 清空信息窗口
           this.bicycleIconList=data.bicycleIconList||[]  //icon集合
           let  periphery=""  //默认外围图标
           if(this.bicycleIconList&&this.bicycleIconList.length>0){
             this.bicycleIconList.map((a)=>{
               if(_this.flag==2&&a.bikeFlag==2&&a.iconType==1){
                 //找到外围车中的未点击图标,在车辆列表循环时使用
                  periphery=a.iconUrl
               }
               //沉默车图标
               if(_this.flag==1&&a.bikeFlag==1&&a.iconType==1){
                 this.dayicon.fourday=a.iconUrl  //4-6天的沉默车
               }
               if(_this.flag==1&&a.bikeFlag==3&&a.iconType==1){
                 this.dayicon.sevenday=a.iconUrl //7天及以上的沉默车
               }
             })
           }
           //公司运营范围
           if(!data.fenceList||data.fenceList.length<0){
             this.polygons=[]
           }else{
            var newList = [];
            this.polygons =[]
            data.fenceList.map((a)=>{
                var NewItem = []
                let item = a.regionScope?JSON.parse(a.regionScope):[]
                 if(item && item.length>0){
                    NewItem.push(
                      item.map(item=>{
                        return [item.lng,item.lat]
                      })
                    )
                    newList.push(NewItem)
                 }
             })
             newList.map((b,i)=>{
                this.polygons.push({
                   path: b,
                   strokeColor: "#FF33FF",
                   strokeWeight: 6,
                   strokeOpacity: 0.2,
                   fillOpacity: 0.4,
                   fillColor: '#1791fc',
                   zIndex: '1000'+i,
                 })
             })
             // console.log(this.polygons)
             // this.polygons[0].path=[[120.062235,30.302833],[120.06687,30.295274],[120.076826,30.294533],[120.092619,30.294681],[120.092791,30.305352],[120.091417,30.309798]];
             // this.polygons[1].path=[[120.202826,30.306093],[120.203512,30.274076],[120.235098,30.275114],[120.234583,30.306686]];
             // this.polygons[2].path=[[120.146864,30.317652],[120.135706,30.290976],[120.172785,30.295274]];
           }

           //车辆分布
           let bicycleList=data.bicycleList
           let resetdata = []
           if(bicycleList.length>0){
             bicycleList.forEach((items,index)=>{
                let gpsLatitude = items.gpsLatitude/1000000
                let gpsLongitude = items.gpsLongitude/1000000
                let item = {
                  show:true,
                  bikeNo:items.bikeNo,
                  companyName:items.companyName,
                  day:items.day,
                  position:[gpsLongitude,gpsLatitude],
                  events: {
                      click() {
                        _this.clicknum = index
                        _this.windows.forEach(window => {
                          window.visible = false;
                        });
                        _this.window = _this.windows[index];
                        _this.$nextTick(() => {
                          _this.window.visible = true;
                        });
                      }
                    }
                }

                if(this.flag==1){
                  if(items.color==1){
                     item.icon =  this.dayicon.fourday
                  }else if(items.color==2){
                     item.icon =  this.dayicon.sevenday
                  }
                  resetdata.push(item)
                  windows.push({
                      position: [gpsLongitude,gpsLatitude],
                      content: `<div class="prompt">
                      <p>
                      共享单车编号：${ items.bikeNo }
                      </p>
                      <p>
                      共享单车公司名称：${ items.companyName?items.companyName:"" }
                      </p>
                      <p>
                      沉默天数：${ items.day }
                      </p>
                      </div>`,
                      visible: false
                  });
                }else{
                  item.icon=periphery||"/static/init2.png"
                  resetdata.push(item)
                  windows.push({
                      position: [gpsLongitude,gpsLatitude],
                      content: `<div class="prompt">
                      <p>
                      共享单车编号：${ items.bikeNo }
                      </p>
                      <p>
                      共享单车公司名称：${ items.enteringCompanyName?items.enteringCompanyName:"" }
                      </p>
                      </div>`,
                      visible: false
                  });
                }

            })
           }else{
             bicycleList=[]
           }

           setTimeout(()=>{
             _this.mapshow = true
             _this.spinshow= true
             let str=_this.flag==1?'沉默车':_this.flag==2?'外围车':"车辆"

            if(bicycleList.length>0){
              _this.center = [bicycleList[0].gpsLongitude/1000000,bicycleList[0].gpsLatitude/1000000]
              _this.zoom=16
            }else{
              bicycleList=[]
              // 如果没有车辆信息,设置第一个片区的第一点为地图中心点
              if(_this.polygons.length>0&&_this.polygons[0].path[0]&&_this.polygons[0].path[0].length>3){
                 _this.center = _this.polygons[0].path[0][0].length?_this.polygons[0].path[0][0]:[_this.polygons[0].path[0][0].lng,_this.polygons[0].path[0][0].lat]
              }
              _this.$Message.info({
               content: "当前共享公司下没有"+str,
               duration: 5
              })
            }
             _this.data = resetdata
             _this.windows = windows;
           },1000)

        }else {
          _this.spinshow= false
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>
<style lang="less">
  .remapbox{
    display:flex;
    flex:1;
    width: 100%;
    flex-direction: column;
    position:relative;
    .prompt{
      width: 160px!important;
      height: 100px!important;
      text-align: left!important;
      word-break: break-all!important;
    }
  }
  .remapbox-hd{
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 250px;
  }
  .cartip01{
    position: absolute;
    right:20px;
    top:10px;
    z-index: 1000;
    background: rgba(0,0,0,.5);
    color: #fff;
    padding: 10px;
  }
  #amapDemo01 {
    height: 100%
  }
  .amap-demo01{
    display: flex;
    flex:1;
    width: 100%;
    height: 100vh!important;
    .el-vue-amap{
      width: 100%
    }
  }
  .icon{
    display: inline-block;
    // width: 40px;
    // height: 40px;
    vertical-align: middle;
  }
  .iconbox{
    margin-bottom: 5px
  }
  .icon1{
    background: url("../../../assets/silencebike11.png") center center no-repeat
  }
  .icon2{
    background: url("../../../assets/silencebike12.png") center center no-repeat
  }
</style>
