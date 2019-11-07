<template>
  <div class="remapbox" v-if="mapshow">
    <div class="remapbox-hd">
      <Button type="error" @click="back">返回列表</Button>
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
        <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position"></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>
  export default {
      name: 'amap-page',
      data() {
        return {
          mapshow:false,
          count: 1,
          slotStyle: {
            padding: '2px 8px',
            background: '#eee',
            color: '#333',
            border: '1px solid #aaa'
          },
          icon:"/static/bike.png",
          zoom: 14,
          center: [121.5273285, 31.21515044],
          componentMarker: {
            position: [121.5273285, 31.21315058],
          },
        };
      },
      mounted() {
        //do something after mounting vue instance
        this.list()
      },
      methods: {
        back() {
          this.$router.back(-1)
        },
        list () {
          let _this = this;
          let listdata = {
              data:JSON.stringify({
                token:this.$webapi.get("token"),
                condition:this.$route.query.terminalNo
              })
          }
          this.$api.get('/bikeTrace/list',listdata,reset => {
            if (reset.codeId === 1) {
              let data = reset.resData
              let gpsLongitude = data.gdLongitude/1000000 || 0
              let gpsLatitude = data.gdLatitude/1000000 || 0
              _this.center = [gpsLongitude,gpsLatitude]
              _this.componentMarker.position = [gpsLongitude,gpsLatitude]
              _this.mapshow = true
            }
          })
        }
      }
    };
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
    left:0;
    z-index: 100
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
