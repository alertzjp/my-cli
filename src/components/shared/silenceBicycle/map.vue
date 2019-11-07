<template>
  <div class="">
    <Modal v-model="show"  @on-cancel="cancel" width="800" :mask-closable="false">
        <div slot="header">
          车辆二维码【{{this.selectitem.bikeNo}}】
        </div>
        <div class="demo-spin-container" v-if="!mapshow">
         <Spin fix></Spin>
        </div>
        <div style="position: relative;">
          <!-- <Alert class="text">大图标为当前共享车辆位置,小图标为其他共享车辆位置</Alert> -->
          <div class="remapbox01" >
            <el-amap vid="amapDemo02" :zoom="zoom" :center="center" class="amap-demo02">
                <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="marker.icon" v-if="marker.show"></el-amap-marker>
            </el-amap>
          </div>
        </div>
        <div slot="footer">

        </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    listdata:{
      default:[],
    },
    selectitem:{
      default:()=>{}
    }
  },
  data () {
    return {
      show:true,
      mapshow:false,
      count: 1,
      data:[],
      fullscreen:false,
      model11:"",
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      icon:"/static/bike.png",
      curicon:"/static/Mbike.png",
      zoom: 14,
      path:[],
      center: [121.5273285, 31.21515044],
      componentMarker: {
        position: [121.5273285, 31.21315058],
      },
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.map()
  },
  methods: {
    cancel () {
      this.$emit("mapemitcomponent")
    },
    map(){
      let resetdata = []
      let center = []
      if(this.listdata.length>0){
        this.listdata.forEach((item)=>{
          if(item.gpsLatitude && item.gpsLongitude){
            let  gpsLatitude = item.gpsLatitude/1000000
            let  gpsLongitude = item.gpsLongitude/1000000
            let  items = {
              show:true,
              bicycleNo:item.bikeNo,
              position:[gpsLongitude,gpsLatitude]
            }
            if(item.bikeNo==this.selectitem.bikeNo){
             items.icon=this.curicon
             if(this.selectitem.gpsLatitude&&this.selectitem.gpsLongitude){
               center=[this.selectitem.gpsLongitude/1000000,this.selectitem.gpsLatitude/1000000]
             }
            }
            else{
             items.icon=this.icon
             items.show=false
            }
            resetdata.push(items)
          }
        })
        setTimeout(()=>{
          this.center = center
          this.data = resetdata
          this.mapshow = true
        },1000)
      }else{
       this.mapshow = true
      }
    },
  }
}
</script>
<style lang="less">

  .remapbox01{
    height:500px
  }
  .text{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    color: #17233d;
    opacity: 0.6;
    font-weight: bold
  }
</style>
