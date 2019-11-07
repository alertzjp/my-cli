<template>
  <div class="remapbox">
    <div class="remapbox-hd">
        <div class="">
          <Row>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent"></docksite-component>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="mt10">
                   <district-component @districtEmitComponent="districtEmitComponent"></district-component>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="mt10">
                    <Input type="text" v-model="formCustom.address" placeholder="根据地址模糊搜索" ></Input>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="mt10">
                    <Buttoncomponent title="查询" @emitButton="search" long=1></Buttoncomponent>
                </div>
              </Col>
          </Row>
        </div>
        <div class="">
        </div>
    </div>
    <div class="cartip01">
      <span>灰色图标【站点关闭】 绿色图标【运营中】</span>
    </div>
    <el-amap vid="amapDemo01" :zoom="zoom" :center="center" class="amap-demo01" v-if="mapshow">
         <el-amap-marker :position="mapding" :icon="icon" v-if="mapding.length>0"></el-amap-marker>
         <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="marker.icon" :events="marker.events" v-if="marker.show"></el-amap-marker>
         <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
     </el-amap>
  </div>
</template>
<script>
import districtComponent from '../../pub/districtcommon.vue'
import docksiteComponent from '../../pub/bicycledocksite.vue'
export default {
  name: "",
  components:{
    districtComponent,
    docksiteComponent
  },
  data () {
    return {
      mapshow:false,
      count: 1,
      data:[],
      model11:"",
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
      mapding:[],
      formCustom:{
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
    // this.list()
    this.longlist()
  },
  methods: {
    search () {
      this.longlist()
    },
    districtEmitComponent (e) {
      if(this.windows.length>0){
        this.windows[this.clicknum].visible = false
        this.clicknum = 0
      }
      this.formCustom.districtName = e.name
    },
    EmitDocksiteComponent (e) {
      if(this.windows.length>0){
        this.windows[this.clicknum].visible = false
        this.clicknum = 0
      }
      this.formCustom.dockSiteName = e.docksiteName
    },
    allcar () {
        let _this = this;
        _this.data.forEach((a)=>{
           if(_this.model11=="" || _this.model11==undefined || _this.model11==null){
              a.show = true
           }else {
             if(a.docksiteNo == _this.model11){
               a.show = true
               _this.center = a.position
             }else {
               a.show = false
             }
           }
        })
    },
    cancel () {
      this.$emit("EMITBIAOQIAN")
    },
    longlist () {
      let _this = this;
      if(this.formCustom.address &&this.formCustom.address!==""){
        AMap.plugin('AMap.Geocoder', function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: ''
          })
          geocoder.getLocation(""+_this.formCustom.address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
               _this.formCustom.longitude = parseInt((result.geocodes[0].location.lng)*1000000)
               _this.formCustom.latitude = parseInt((result.geocodes[0].location.lat)*1000000)
               _this.mapding = [result.geocodes[0].location.lng,result.geocodes[0].location.lat]
               _this.list()
            }
          })
        })
      }else{
        _this.formCustom.longitude = ""
        _this.formCustom.latitude = ""
        this.list()
      }

    },
    list () {
       let windows = [];
       let options = []
        let listdata = {
          token:this.$webapi.get('token'),
          districtNo:this.formCustom.districtNo,
          dockSiteName:this.formCustom.dockSiteName,
          districtName:this.formCustom.districtName,
          // address:this.formCustom.address,
          longitude:this.formCustom.longitude,
          latitude:this.formCustom.latitude
        }
        let _this =  this
        this.data = []
        this.$api.get('/bicycledocksite/nearby_site',listdata,reset => {
          if (reset.codeId === 1) {
                let resetdata = []
                // for (let i = reset.resData.length-1; i>=0; i--) {
                //    let item  = data[i]
                //   if(!item.latitude && !item.longitude){
                //     reset.resData.splice(i,1)
                //   }
                // }
                let data = reset.resData
                let idx = 0
                data.forEach((items,index)=>{
                    let gpsLatitude = items.latitude/1000000
                    let gpsLongitude = items.longitude/1000000
                    if(idx==0){
                      if(_this.formCustom.districtName=="" &&  _this.formCustom.dockSiteName=="" &&  _this.formCustom.longitude=="" &&  _this.formCustom.latitude==""){
                        if(items.status==1){
                          options = [gpsLongitude,gpsLatitude]
                          idx = 1
                        }
                      }else {
                        options = [gpsLongitude,gpsLatitude]
                        idx = 1
                      }
                    }
                    let item = {
                      show:true,
                      docksiteNo:items.docksiteNo,
                      docksiteName:items.docksiteName,
                      bicycleDocksiteName:items.bicycleDocksiteName,
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
                    if(items.status==1){
                      if(this.formCustom.address && this.formCustom.address!=""){
                        if(index==0){
                          item.icon = "/static/rebike.png"
                        }else {
                          item.icon = "/static/bike.png"
                        }
                      }else {
                        item.icon = "/static/bike.png"
                      }
                    }else {
                      item.icon = "/static/closebike.png"
                    }
                    resetdata.push(item)
                    windows.push({
                        position: [gpsLongitude,gpsLatitude],
                        content: `<div class="prompt">
                        <p>
                        站点名称：${ items.docksiteName }
                        </p>
                        <p>
                        片区名称：${ items.districtName?items.districtName:"" }
                        </p>
                        <p>
                        片区名称：${ items.longitude }
                        </p>
                        <p>
                        地址：${ items.address }
                        </p>
                        </div>`,
                        visible: false
                    });

                })
             setTimeout(()=>{
               _this.mapshow = true
               if(_this.formCustom.address&&_this.formCustom.address!=""){
                 _this.center = [_this.formCustom.longitude/1000000,_this.formCustom.latitude/1000000]
               }else{
                 _this.center = options
               }
               resetdata.push()
               _this.data = resetdata
               _this.windows = windows;
             },1000)
             if(data.length<1){
               _this.data = []
             }
          }
          else {
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
    // background: rgba(255,255,255,.5);
  }
  .cartip01{
    position: absolute;
    right:20px;
    top:10px;
    z-index: 1000
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
</style>
