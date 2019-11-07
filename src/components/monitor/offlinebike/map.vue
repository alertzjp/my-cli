<template>
  <div class="">
    <Modal v-model="show" :fullscreen="fullscreen" @on-cancel="cancel" width="800" :mask-closable="false">
          <div slot="header">
            车辆二维码【{{this.itemdata.bicycleNo}}】
          </div>
          <div style="text-align:center">
            <div class="remapbox01" v-if="mapshow">
              <!-- <div class="remapbox-hd">
                <Button type="error" @click="back">返回列表</Button>
              </div> -->
              <el-amap vid="amapDemo02" :zoom="zoom" :center="center" class="amap-demo02">
                  <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position" v-if="path.length<1"></el-amap-marker>
                  <el-amap-polyline  :path="path" v-if="path.length>1"></el-amap-polyline>
              </el-amap>
            </div>
          </div>
          <div slot="footer">
             <!-- <Buttoncomponent title="分享"  icon="ios-share-alt" @emitButton="handleShare"></Buttoncomponent> -->
          </div>
      </Modal>
      <Modal v-model="qrcodeshow" :fullscreen="fullscreen" @on-cancel="cancel01" width="400" :mask-closable="false" >
        <div slot="header">
        </div>
        <div class="qrcodecenter">
           <div id="qrcode"></div>
        </div>
        <div slot="footer" class="textalign">
           <span>手机扫码,即可分享车辆位置</span>
        </div>
      </Modal>
  </div>
</template>
<script>
  let axios = require('axios')
  import QRCode from 'qrcodejs2'
  let  qrcode={};
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
          qrcodeshow:false,
          count: 1,
          slotStyle: {
            padding: '2px 8px',
            background: '#eee',
            color: '#333',
            border: '1px solid #aaa'
          },
          icon:"/static/bike.png",
          zoom: 15,
          path:[],
          center: [121.5273285, 31.21515044],
          componentMarker: {
            position: [121.5273285, 31.21315058],
          },
        };
      },
      mounted() {
        //do something after mounting vue instance
        let gpsLongitude = this.itemdata.gpsLongitude/1000000 || 0
        let gpsLatitude = this.itemdata.gpsLatitude/1000000 || 0
        this.center = [gpsLongitude,gpsLatitude]
        this.list()
        // this.componentMarker.position = [gpsLongitude,gpsLatitude]
        // this.mapshow = true
      },
      methods: {
        getQrCode() {
             const rooturl = window.location.origin
             qrcode = new QRCode('qrcode', {
                  width: 180,
                  height: 180,
                  text: `http://webchat.rightsidetech.com/Location/?position=${this.componentMarker.position}`,
                  correctLevel : QRCode.CorrectLevel.H
             })
      	},
        list () {
          let _this = this
          axios.get('https://restapi.amap.com/v3/assistant/coordinate/convert', {
              params: {
                locations:_this.center[0]+','+_this.center[1],
                coordsys:"gps",
                output:"JSON",
                key:"c2c6d132f7e031f369ce94d7a1045a7c"
              }
            })
            .then(function (response) {
              let  data = response.data.locations.split(',')
              let  position = [data[0].substring(0,10),data[1].substring(0,9)]
                  _this.componentMarker.position = position
                  _this.mapshow = true
            })
            .catch(function (error) {
              // console.log(error);
            });
        },
        handleShare(){
          this.qrcodeshow=true;
          setTimeout(() => {
            this.getQrCode()
          }, 10)
        },
        handleClose(){
          this.qrcodeshow=false;
          //console.log(qrcode)
        },
        cancel () {
          this.$emit("mapemitcomponent")
        },
        cancel01 (){
          this.qrcodeshow=false;
        },
        back() {
          this.$router.back(-1)
        },
      }
    };
</script>
<style lang="less" scoped>
  .remapbox01{
   height: 450px;
  }
  #amapDemo02{
    display: flex;
    flex:1;
    width: 100%;
    height: 100%;
    .el-vue-amap{
      width: 100%
    }
  }
  .amap-demo02{
    height: 450px;
  }
  .qrcodecenter{
    display: flex;
    justify-content: center;
  }
</style>
