<template>
 <div class="mapboxlist">
   <div class="mapbox" id="amapvue"></div>
 </div>
</template>
<script>
let Map;
let mouseToolshow;
let polygonTick;
let polyEditor;
export default {
  name: "",
  components:{
  },
  data () {
    let self = this;
    return {
      loading:false,
      flagshow:false,
      backshow:false,
      spinshow:true,
      mapshow:false,
      itemindex:0,
      idx:1,//0-没有  1-有
      b11FenceDetailList:[],
      newFenceDetailList:[],
      num:1000000,
      newfence:[]
    }
  },
  mounted() {
     this.getnewdata()
  },
  methods: {
    map () {
       let _this = this;
       Map = new AMap.Map("amapvue", {
           resizeEnable: true,
           zoom: 14
       });
       polygonTick = new AMap.Polygon({
          path: this.newfence,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
      })
       Map.add(polygonTick)
       Map.setFitView([ polygonTick ])

    },
    getnewdata(){
      let id=this.$route.query.id
      if(!id){
          this.$Message.warning("没有找到公司信息,无法设置")
          return
      }
      let listdata={
        token:this.$webapi.get('token'),
        id,
      }
      let _this =  this
      this.loading = true
      this.$api.get('/bicycle_entering_company/getRegionScope',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          let newarr = []
          if(reset.resData&&reset.resData.length>0){
            reset.resData.map((a)=>{
              let item = a.regionScope?JSON.parse(a.regionScope):[]
              if(item && item.length>0){
                newarr.push(
                    item.map(item=>{
                       return [item.lng,item.lat]
                    })
                )
              }
            })
            _this.newfence=newarr
          }else{
            _this.$Message.info({
             content: "当前共享公司下还没有运营范围",
             duration: 5
            })
          }

          setTimeout(()=>{
            _this.map()
          },200)

        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mapboxlist{
  display: flex;
  flex-direction:column;
  flex:1;
  position:relative;
}
.mapbox{
  position: relative;
  flex: 1
}
.heanderFixed{
  width: 300px;
  padding-right: 15px;
  position:absolute;
  top: 0;
  left:0;
  bottom:0;
  z-index: 90;
  background: rgba(255,255,255,.9);
  padding-top: 15px;
}
.buttongroup{
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
