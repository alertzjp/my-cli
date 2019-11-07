<template>
  <div class="h5sharepagebox">
    <div class="mapbox h5sharepage" id="container">
    </div>
    <div class="options">
      <ul>
        <li @click="typeclick(1)" :class="{cur:type==1}">驾车</li>
        <li @click="typeclick(3)" :class="{cur:type==3}">骑行</li>
        <li @click="typeclick(2)" :class="{cur:type==2}">步行</li>        
      </ul>
    </div>
  </div>
</template>
<script>
let mapObj,geolocation;
var map, route, marker;
let walking,riding,driving;
export default {
  name: "",
  data: () => ({
    icon:"/static/Mbike.png",
    eshow:false,
    path:[],
    start:[],
    end:[],
    type:1,
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
    let _this = this;
    let postdata = this.$webapi.getUrlParam("position").split(',')
    this.end = [parseFloat(postdata[0]),parseFloat(postdata[1])]
    setTimeout(()=>{
      mapObj = new AMap.Map('container', {
          resizeEnable: true
      });
      this.GETMAP()
    },1000)
 },
 methods: {
   GETMAP () {
      let _this = this;
      mapObj.plugin('AMap.Geolocation', function () {
       geolocation = new AMap.Geolocation({
           enableHighAccuracy: true,//是否使用高精度定位，默认:true
           // timeout: 100000,          //超过10秒后停止定位，默认：无穷大
           maximumAge: 0,           //定位结果缓存0毫秒，默认：0
           convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
           showButton: true,        //显示定位按钮，默认：true
           buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
           buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
           showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
           showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
           panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
           zoomToAccuracy:true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
       });
       mapObj.addControl(geolocation);
       geolocation.getCurrentPosition();

       AMap.event.addListener(geolocation, 'complete', (position)=>{
         // 打印定位信息
         _this.start=[position.position.lng,position.position.lat]
         _this.gettype()

       });//返回定位信息
       AMap.event.addListener(geolocation, 'error', (e)=>{
             // console.log(e);
       });      //返回定位出错信息
      });
   },
   gettype () {
     if(walking){
       walking.clear()
     }
     if(riding){
       riding.clear()
     }
     if(driving){
       driving.clear()
     }
     if(this.type == 1){
       this.drage()
     }
     if(this.type == 2){
       this.walkingpost()
     }
     if(this.type == 3){
       this.ridingpost()
     }
   },
   typeclick (e) {
     this.type = e;
     this.GETMAP()
   },
   walkingpost () {
     //步行导航
      walking = new AMap.Walking({
        map: mapObj,
      });
      //根据起终点坐标规划步行路线
      walking.search(this.start, this.end, function(status, result) {
        // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
        if (status === 'complete') {
            // log.success('绘制步行路线完成')
        } else {
            // log.error('步行路线数据查询失败' + result)
        }
      });
   },
   ridingpost () {
       //骑行导航
       riding = new AMap.Riding({
           map: mapObj,
       });
       //根据起终点坐标规划骑行路线
       riding.search(this.start, this.end,function(status, result) {
           // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
           if (status === 'complete') {
               // log.success('绘制骑行路线完成')
           } else {
               // log.error('骑行路线数据查询失败' + result)
           }
       });
   },
   drage () {
     //构造路线导航类
     driving = new AMap.Driving({
         map: mapObj,
         // panel: "panel"
     });
     // 根据起终点经纬度规划驾车导航路线
     driving.search(new AMap.LngLat(this.start[0],this.start[1]), new AMap.LngLat(this.end[0],this.end[1]), function(status, result) {
         // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
         if (status === 'complete') {
             //log.success('绘制驾车路线完成')
         } else {
             //log.error('获取驾车数据失败：' + result)
         }
     });
   }
 }
}
</script>
<style lang="less" scoped>
.h5sharepagebox{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.options{
  position: absolute;
  top:0;
  left:0;
  height: 44px;
  line-height: 44px;
  right: 0;
  background:#fff;
  ul{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li{
      flex: 1;
      text-align: center;
    }
    .cur{
      color:#06c;
      font-weight: bold;
    }
  }
}
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
