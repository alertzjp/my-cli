<template>
  <div class="">
    <Modal v-model="show" :fullscreen="fullscreen" @on-cancel="cancel" width="800" :mask-closable="false">
          <div style="text-align:center">
            <div class="remapbox01" v-if="mapshow">
              <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo01">
                  <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position" v-if="path.length<1"></el-amap-marker>
                  <el-amap-polyline  :path="path" v-if="path.length>1"></el-amap-polyline>
              </el-amap>
            </div>
            <div class="remapbox" v-else>
                <Spin fix></Spin>
            </div>
          </div>
          <div slot="footer">
          </div>
      </Modal>
  </div>
</template>
<script>
  export default {
      name: 'amap-page',
      props:{
        itemdata:{
          default () {
            return {}
          }
        }
      },
      data() {
        return {
          show:true,
          fullscreen:false,
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
          path:[],
          center: [],
          componentMarker: {
            position: [],
          },
        };
      },
      mounted() {
        //do something after mounting vue instance
        //this.list()
        // let gpsLongitude = this.itemdata.gpsLongitude/1000000 || 0
        // let gpsLatitude = this.itemdata.gpsLatitude/1000000 || 0
        // this.center = [gpsLongitude,gpsLatitude]
        // this.componentMarker.position = [gpsLongitude,gpsLatitude]
        // this.mapshow = true

        this.list()
      },
      methods: {
        cancel () {
          this.$emit("mapemitcomponent")
        },
        back() {
          this.$router.back(-1)
        },
        list () {
          let _this = this;
          let listdata = {
              data:JSON.stringify({
                token:this.$webapi.get("token"),
                bicycleId:""+this.itemdata.id
              })
          }
          this.$api.get('/bicycletrace/list',listdata,reset => {
            if (reset.codeId === 1) {
              let resetitem = []
              let data = reset.resData
              if(data && data.length>1){
                let gpsLongitude = data[0].gpsLongitude || 0
                let gpsLatitude = data[0].gpsLatitude || 0
                _this.center = [gpsLongitude,gpsLatitude]
                _this.componentMarker.position = [gpsLongitude,gpsLatitude]
                  data.forEach((a)=>{
                    let long = a.gpsLongitude
                    let gdLat = a.gpsLatitude
                    resetitem.push([long,gdLat])
                  })
                  _this.path = resetitem
              }else if(data) {
                let gpsLongitude = data[0].gpsLongitude || 0
                let gpsLatitude = data[0].gpsLatitude || 0
                _this.center = [gpsLongitude,gpsLatitude]
                _this.componentMarker.position = [gpsLongitude,gpsLatitude]
              }
              setTimeout(()=>{
                _this.mapshow = true
              },1000)
            }else {
                 _this.mapshow = true
                _this.$netcode.getApiCode(reset)
            }
          })
        }
      }
    };
</script>
<style lang="less">
  .remapbox01{
   height: 450px;
  }
  .amap-demo01{
    display: flex;
    flex:1;
    width: 100%;
    height: 100%;
    .el-vue-amap{
      width: 100%
    }
  }
</style>
