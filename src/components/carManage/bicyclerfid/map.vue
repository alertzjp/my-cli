<template>
  <div class="">
    <Modal v-model="show"  @on-cancel="cancel" width="800" :mask-closable="false">
        <div slot="header">
          {{status==1?"站点外车辆数":"站点内车辆数"}}
        </div>
          <div style="text-align:center;position: relative;" v-if="data.length>0">
            <div class="remapbox" v-if="mapshow">
              <div class="remapbox-hd">
              </div>
               <el-amap
               vid="amapDemo"
               :center="center"
               :zoom="zoom"
               class="amap-demo">
               <el-amap-marker v-for="marker in markers" :position="marker.position" :icon="icon"  :events="marker.events"></el-amap-marker>
               <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
             </el-amap>
            </div>
            <div class="amap-demo" v-else>
              <Spin size="large" fix></Spin>
            </div>
            <div style="text-align:center;position: relative;" v-if="data.length<1">
              暂无数据
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
    status:{
      default () {
        return 1
      }
    }
  },
  data () {
    return {
      mapshow:false,
      show:true,
      count: 1,
      data:[],
      model11:"",
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      icon:"/static/bike.png",
      zoom: 8,
      path:[],
      center: [121.5273285, 31.21515044],
      componentMarker: {
        position: [121.5273285, 31.21315058],
      },
      windows:[],
      window:'',
      formCustom:{
        bicycle_no:""
      }
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    newitem () {
      let markers = [];
       let windows = [];

       let num = this.data;
       let self = this;

       for (let i = 0 ; i < num.length ; i ++) {
         let str = num[i].bicycleNo
         markers.push({
           position: num[i].position,
           events: {
             click() {
               self.windows.forEach(window => {
                 window.visible = false;
               });

               self.window = self.windows[i];
               self.$nextTick(() => {
                 self.window.visible = true;
               });
             }
           }
         });

         windows.push({
           position: num[i].position,
           content: `<div class="prompt">二维码编号:${str}</div>`,
           visible: false
         });
       }

       this.markers = markers;
       this.windows = windows
       this.mapshow = true
    },
    cancel () {
      this.$emit("emitmap")
    },
    list () {
        let windows = [];
        let self = this;
        let  listdata = {
            pageNo:"1",
            pageSize:"100000",
            token:this.$webapi.get('token'),
            status:this.status
        }
        let  _this =  this
        this.$api.get('/tag/list',listdata,reset => {
          if (reset.codeId === 1) {
            let resetdata = []
            let data = reset.resData.list
                data.forEach((items)=>{
                  if(items.gpsLatitude && items.gpsLongitude){
                    let  gpsLatitude = items.gpsLatitude/1000000
                    let  gpsLongitude = items.gpsLongitude/1000000
                    let  item = {
                      show:true,
                      bicycleNo:items.bikeNo,
                      bicycleDocksiteName:items.bicycleDocksiteName,
                      position:[gpsLongitude,gpsLatitude],
                    }
                    resetdata.push(item)
                  }
                })
             setTimeout(()=>{
               _this.center = resetdata[0].position
               _this.data = resetdata
               _this.newitem()
             },1000)
          }
          else {
            _this.$netcode.getApiCode(reset)
         }
        })
    }
  }
}
</script>
<style lang="less">
  .prompt {
      background: white;
      width: 100px;
      height: 30px;
      text-align: center;
    }
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
    left: 0;
    z-index: 1000;
    width: 250px;
    bottom: 0;
    // background: rgba(255,255,255,.5);
  }
  .amap-demo{
    display: flex;
    flex:1;
    width: 100%;
    height: 400px!important;
    .el-vue-amap{
      width: 100%
    }
  }
</style>
