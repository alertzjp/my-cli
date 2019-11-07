<template>
  <div class="remapbox" v-if="mapshow">
    <div class="remapbox-hd">
        <div class="">
          <Select v-model="model11" filterable @on-change="allcar" placeholder="全部车辆">
              <Option value="">全部车辆</Option>
              <Option v-for="item in data" :value="item.bicycleNo" :key="item.bicycleNo">{{ item.bicycleNo }}</Option>
          </Select>
        </div>
        <div class="">

        </div>
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
        <!-- <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position" v-if="path.length<1"></el-amap-marker> -->
        <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="icon" v-if="marker.show"></el-amap-marker>
     </el-amap>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      mapshow:false,
      count: 1,
      data:[],
      model11:"",
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      icon:"/static/bike.png",
      zoom: 14,
      path:[],
      center: [121.5273285, 31.21515044],
      componentMarker: {
        position: [121.5273285, 31.21315058],
      },
      formCustom:{
        bicycle_no:""
      }
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    allcar () {
        let _this = this;
        _this.data.forEach((a)=>{
           if(_this.model11=="" || _this.model11==undefined || _this.model11==null){
              a.show = true
           }else {
             if(a.bicycleNo == _this.model11){
               a.show = true
               _this.center = a.position
             }else {
               a.show = false
             }
           }
        })
    },
    back () {

    },
    list () {
        let  listdata = {
          data:{
            bicycle_no:this.formCustom.bicycle_no,
            pageNo:"1",
            pageSize:"100000",
            token:this.$webapi.get('token'),
          }
        }
        let  _this =  this
        this.$api.get('/bicycle/list',listdata,reset => {
          if (reset.codeId === 1) {
            let resetdata = []
            let  data = reset.resData.list
                data.forEach((items)=>{
                  if(items.gpsLatitude && items.gpsLongitude){
                    let  gpsLatitude = items.gpsLatitude/1000000
                    let  gpsLongitude = items.gpsLongitude/1000000
                    let  item = {
                      show:true,
                      bicycleNo:items.bicycleNo,
                      bicycleDocksiteName:items.bicycleDocksiteName,
                      position:[gpsLongitude,gpsLatitude]
                    }
                    resetdata.push(item)
                  }
                })
             setTimeout(()=>{
               _this.center = resetdata[0].position
               _this.data = resetdata
               _this.mapshow = true
             },1000)
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
    height: 100%;
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
    bottom: 0;
    // background: rgba(255,255,255,.5);
  }
  .amap-demo{
    display: flex;
    flex:1;
    width: 100%;
    height: 100vh!important;
    .el-vue-amap{
      width: 100%
    }
  }
</style>
