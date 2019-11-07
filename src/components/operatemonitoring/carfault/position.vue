<template>
  <div id="mapview" style="height:800px;width:100%;"></div>
</template>
<script>
export default {
  name: "",
  components:{
  },
  data () {
    return {
      loading:false,
      item:{},
      mapdata:{},
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
    }
  },
  mounted() {
     this.item=this.$route.query.item;
     // console.log(this.item)
     this.list();
  },
  methods: {
    goback(){
      this.$router.go(-1)
    },
    setmap:function(){
     let _this = this;
     let map = new AMap.Map("mapview", {
         resizeEnable: true,
         zoom: 10
     });
     let lg = (this.mapdata.gdLongitude) / 1000000,
         lt = (this.mapdata.gdLatitude) / 1000000;
     map.setCenter([lg,lt])
     new AMap.Marker({
         map: map,
         position:[lg,lt],
         icon: new AMap.Icon({
             size: new AMap.Size(60, 60),  //图标大小
             image: "/static/bike.png",
             imageOffset: new AMap.Pixel(0, 0)
         })
     });
    },
    list () {
      let getdata = {
          data: JSON.stringify({
             token:this.$webapi.get('token'),
             condition: '' + this.item.terminalNo
          })
      }
      let _this =  this
      this.$api.get('/bikeTrace/list',getdata,reset => {
        if (reset.codeId === 1) {
           _this.mapdata=reset.resData
           _this.setmap()
        }else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
