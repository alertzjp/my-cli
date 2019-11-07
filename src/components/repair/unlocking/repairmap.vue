<template>
  <div class="remapbox">
    <div class="remapbox-hd">
      <Button type="error" @click="back">返回列表</Button>
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
      <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position"></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>
    module.exports = {
      name: 'amap-page',
      data() {
        return {
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
        let gpsLongitude = this.$route.query.gpsLongitude/1000000 || 0
        let gpsLatitude = this.$route.query.gpsLatitude/1000000 || 0
        this.center = [gpsLongitude,gpsLatitude]
        this.componentMarker.position = [gpsLongitude,gpsLatitude]
      },
      methods: {
        back() {
          this.$router.back(-1)
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
