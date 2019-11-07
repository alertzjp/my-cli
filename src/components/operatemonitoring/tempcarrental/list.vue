<template>
  <div id="mapview"></div>
</template>
<script>
export default {
  name: "",
  components:{
  },
  data () {
    return {
      points:[],
      mapdata:{},
      heatmap:{}
    }
  },
  mounted() {
    if (!this.isSupportCanvas()) {
       this.$Message.warning('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~');
    }else{
       this.list();
    }
  },
  methods: {
    isSupportCanvas(){
      let elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },
    pile(){
      let _this=this;
      let map = new AMap.Map("mapview", {
          resizeEnable: true,
          zoom: 11
      });
      map.plugin(["AMap.Heatmap"], function() {
         _this.heatmap = new AMap.Heatmap(map, {
              radius: 25, //给定半径
              opacity: [0, 0.8]
         });
          //设置数据集：该数据为北京部分“公园”数据
          _this.heatmap.setDataSet({
              data: _this.points,
              max: 5
          });
      });
    },
    list () {
      let listdata = {
          data: JSON.stringify({
              token: this.$webapi.get('token'),
          })
      }
      let _this =  this
      this.$api.get('/stop/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.mapdata = reset.resData;
           for(let i=0;i<_this.mapdata.length;i++){
               let data={
                   lng:_this.mapdata[i].gdLongitude,
                   lat:_this.mapdata[i].gdLatitude,
                   count:_this.mapdata[i].countSum
               }
                 _this.points.push(data)
           }
           _this.pile();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
  #mapview{
    flex: 1
  }
</style>
