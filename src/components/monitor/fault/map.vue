<template>
  <div class="remapbox">
    <div class="cartip">
      <p>站点位置:<img :src="bikeicon"  style="vertical-align: middle;"/></p>
      <p>车辆位置:<img :src="icon" style="vertical-align: middle;"/></p>
      <p>车辆编号:【{{formCustom.bikeNo}}】</p>
      <p>站点名称:【{{formCustom.docksiteName}}】</p>
      <p>误 差 值:【{{formCustom.distance}}】米</p>
    </div>
    <el-amap vid="amapDemo01" :zoom="zoom" :center="center" class="amap-demo01" v-if="mapshow">
         <el-amap-marker :position="mapding" :icon="icon" v-if="mapding.length>0"></el-amap-marker>
         <!-- <el-amap-circle  vid="circle"
          :center="center"
          :radius="radius"
          fill-opacity="0.2"
          strokeColor="#38f"
          strokeOpacity="0.8"
          strokeWeight="1"
          fillColor="#38f"
          >
        </el-amap-circle> -->
         <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="marker.icon" :events="marker.events" v-if="marker.show"></el-amap-marker>
         <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
     </el-amap>
  </div>
</template>
<script>
// import districtComponent from '../../pub/districtcommon.vue'
// import docksiteComponent from '../../pub/bicycledocksite.vue'
export default {
  name: "",
  components:{
    // districtComponent,
    // docksiteComponent
  },
  data () {
    return {
      mapshow:false,
      count: 1,
      data:[],
      model11:"",
      clicknum:0,
      radius:50,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      windows: [],
      window: '',
      icon:"/static/curmap.png",
      bikeicon:"/static/site.png",
      zoom: 16,
      path:[],
      center: [],
      componentMarker: {
        position: [],
      },
      mapding:[],
      formCustom:{
        bicycle_no:"",
        docksiteNo:"",
        districtName:"",
        dockSiteName:"",
        address:"",
        longitude:"",
        latitude:"",
        docksiteLongitude:"",
        docksiteLatitude:"",
        docksiteName:""
      }
    };
  },
  mounted() {
    //do something after mounting vue instance
    // this.list()
    this.formCustom.longitude = parseInt(this.$route.query.Longitude) || 0
    this.formCustom.latitude = parseInt(this.$route.query.Latitude) || 0
    this.formCustom.docksiteLongitude = parseInt(this.$route.query.docksiteLongitude) || 0
    this.formCustom.docksiteLatitude = parseInt(this.$route.query.docksiteLatitude) || 0
    this.formCustom.docksiteName = this.$route.query.docksiteName || ""
    this.formCustom.distance = this.$route.query.distance || ""
    this.formCustom.bikeNo = this.$route.query.bikeNo || ""
    // this.center = [Longitude/1000000,Latitude/1000000]
    // this.componentMarker.position = [Longitude/1000000,Latitude/1000000]
    let _this = this;
    //this.mapshow = true
    setTimeout(()=>{
      _this.longlist()
    },300)
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
      var gps = [parseInt(this.$route.query.Longitude)/1000000, parseInt(this.$route.query.Latitude)/1000000];
      AMap.convertFrom(gps, 'gps', function (status, result) {
        if (result.info === 'ok') {
          var lnglats = result.locations; // Array.<LngLat>
            _this.formCustom.Longitude = lnglats[0].lng
            _this.formCustom.Latitude = lnglats[0].lat
            _this.list()
        }
      });



      // let _this = this;
      // if(this.formCustom.address &&this.formCustom.address!==""){
      //   AMap.plugin('AMap.Geocoder', function() {
      //     var geocoder = new AMap.Geocoder({
      //       // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      //       city: ''
      //     })
      //     geocoder.getLocation(""+_this.formCustom.address, function(status, result) {
      //       if (status === 'complete' && result.info === 'OK') {
      //          // _this.formCustom.longitude = parseInt((result.geocodes[0].location.lng)*1000000)
      //          // _this.formCustom.latitude = parseInt((result.geocodes[0].location.lat)*1000000)
      //          _this.mapding = [_this.formCustom.longitude,_this.formCustom.latitude]
      //          _this.list()
      //       }
      //     })
      //   })
      // }else{
      //   this.list()
      // }
    },
    list () {
       let windows = [];
       let options = []
        let listdata = {
          data:{
            token:this.$webapi.get('token')
          }
        }
        let _this =  this
        this.data = []
        let resetdata = []
          let data = [{
            longitude:parseInt(this.$route.query.docksiteLongitude)/1000000,
            latitude:parseInt(this.$route.query.docksiteLatitude)/1000000,
            docksiteName:this.$route.query.docksiteName,
            docksiteNo:this.$route.query.docksiteNo,
            status:1
          }]
          data.push({
             longitude:this.formCustom.Longitude,
             latitude:this.formCustom.Latitude,
             status:1,
             curshow:true
          })
        let idx = 0
        data.forEach((items,index)=>{
            let gpsLatitude = items.latitude
            let gpsLongitude = items.longitude
            if(idx==0){
              if(_this.formCustom.dockSiteName=="" &&  _this.formCustom.longitude=="" &&  _this.formCustom.latitude==""){
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
                    if(!_this.windows[index].show){
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
            }
            if(items.status==1){
              if(items.curshow){
                  item.icon = "/static/curmap.png"
              }else{
                item.icon = "/static/site.png"
              }
            }else {
              item.icon = "/static/site.png"
            }
            resetdata.push(item)
            console.log(resetdata)
            windows.push({
                position: [gpsLongitude,gpsLatitude],
                show:items.curshow?true:false,
                content: `<div class="prompt">
                <p>
                站点名称：${ items.docksiteName }
                </p>
                <p>
                站点编号：${ items.docksiteNo }
                </p>
                </div>`,
                visible: false
            });
        })
       setTimeout(()=>{
         _this.center = [_this.formCustom.docksiteLongitude/1000000,_this.formCustom.docksiteLatitude/1000000]
         resetdata.push()
         _this.data = resetdata
         _this.windows = windows;
         _this.mapshow = true
       },1000)
       if(data.length<1){
         _this.data = []
       }
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
  .cartip{
    position: absolute;
    left:20px;
    top:10px;
    z-index: 1000;
    background: #f30;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
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
