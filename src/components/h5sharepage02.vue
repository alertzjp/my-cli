<template>
  <div class="mapbox" v-show="eshow">
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo01" :style="amapStyle">
        <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position" v-if="path.length<1"></el-amap-marker>
        <el-amap-polyline  :path="path" v-if="path.length>1"></el-amap-polyline>
    </el-amap>
  </div>
</template>
<script>
export default {
  name: "",
  data: () => ({
    icon:"/static/Mbike.png",
    zoom: 14,
    eshow:false,
    path:[],
    amapStyle:{
      width:"100%",
      height:""
    },
    center: [121.5273285, 31.21515044],
    componentMarker: {
      position: [121.5273285, 31.21315058],
    },
  }),
  created() {
    //do something after creating vue instance
     this.amapStyle.height=window.screen.height+"px";
  },
  mounted() {
    //do something after mounting vue instance
    document.title = '分享车辆位置';
    let positionarr= this.GetQueryString("position");
    if(positionarr){
      this.eshow=true;
      this.center=positionarr.split(',');
      this.componentMarker.position=positionarr.split(',');
    }
 },
 methods: {
   GetQueryString(name) {
     let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     let r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
   }
 }
}
</script>
<style lang="less" scoped>
.mapbox{
  display: flex;
  flex-direction: column;
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0
}
// .amap-demo01{
//   width:100%;
//   height:800px;
// }
</style>
