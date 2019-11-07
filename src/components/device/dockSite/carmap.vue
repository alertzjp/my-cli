<template>
  <div class="">
    <Modal v-model="mapshow" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>全部</span>
       </p>
       <div class="remapbox">
         <div class="remapbox-hd">
             <div class="">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                     <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent"></docksite-component>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <district-component @districtEmitComponent="districtEmitComponent"></district-component>
                   </Col>
               </Row>
             </div>
             <div class="">
             </div>
         </div>
         <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
             <!-- <el-amap-marker vid="component-marker" :icon="icon" :position="componentMarker.position" v-if="path.length<1"></el-amap-marker> -->
              <el-amap-marker v-for="(marker, index) in data" :position="marker.position" :icon="marker.icon" :events="marker.events" v-if="marker.show"></el-amap-marker>
              <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
          </el-amap>
       </div>
       <div slot="footer">
         <span>灰色图标【站点关闭】 绿色图标【运营中】</span>
       </div>
    </Modal>
  </div>
</template>
<script>
import districtComponent from '../../pub/districtcommon.vue'
import docksiteComponent from '../../pub/bicycledocksite.vue'
export default {
  name: "",
  components:{
    districtComponent,
    docksiteComponent
  },
  data () {
    return {
      mapshow:false,
      count: 1,
      data:[],
      model11:"",
      clicknum:0,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      windows: [],
      window: '',
      icon:"/static/bike.png",
      zoom: 8,
      path:[],
      center: [121.5273285, 31.21515044],
      componentMarker: {
        position: [121.5273285, 31.21315058],
      },
      formCustom:{
        bicycle_no:"",
        docksiteName:""
      }
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    districtEmitComponent (e) {
      if(this.windows.length>0){
        this.windows[this.clicknum].visible = false
        this.clicknum = 0
      }
      this.formCustom.districtNo = e.districtNo
      this.list()
    },
    EmitDocksiteComponent (e) {
      if(this.windows.length>0){
        this.windows[this.clicknum].visible = false
        this.clicknum = 0
      }
      this.formCustom.docksiteName = e.docksiteName
      this.list()
    },
    allcar () {
        let _this = this;
        _this.data.forEach((a)=>{
           if(_this.model11=="" || _this.model11==undefined || _this.model11==null){
              a.show = true
           }else {
             if(a.docksiteNo == _this.model11){
               a.show = true
               _this.center = a.position
             }else {
               a.show = false
             }
           }
        })
    },
    cancel () {
      this.$emit("EMITBIAOQIAN")
    },
    list () {
       let windows = [];
       let options = []
        let listdata = {
          data:{
            token:this.$webapi.get('token'),
            districtNo:this.formCustom.districtNo,
            docksiteName:this.formCustom.docksiteName
          }
        }
        let _this =  this
        this.$api.get('/bicycledocksite/set',listdata,reset => {
          if (reset.codeId === 1) {
                let resetdata = []
                // for (let i = reset.resData.length-1; i>=0; i--) {
                //    let item  = data[i]
                //   if(!item.latitude && !item.longitude){
                //     reset.resData.splice(i,1)
                //   }
                // }
                let data = reset.resData
                let idx = 0
                data.forEach((items,index)=>{
                    let gpsLatitude = items.latitude/1000000
                    let gpsLongitude = items.longitude/1000000
                    if(items.status == 1 && idx==0){
                      options = [gpsLongitude,gpsLatitude]
                      idx = 1
                    }
                    let item = {
                      show:true,
                      docksiteNo:items.docksiteNo,
                      docksiteName:items.docksiteName,
                      bicycleDocksiteName:items.bicycleDocksiteName,
                      position:[gpsLongitude,gpsLatitude],
                      events: {
                          click() {
                            _this.clicknum = index
                            _this.windows.forEach(window => {
                              window.visible = false;
                            });
                            _this.window = _this.windows[index];
                            _this.$nextTick(() => {
                              _this.window.visible = true;
                            });
                          }
                        }
                    }
                    if(items.status==1){
                      item.icon = "/static/bike.png"
                    }else {
                      item.icon = "/static/closebike.png"
                    }
                    resetdata.push(item)
                    windows.push({
                        position: [gpsLongitude,gpsLatitude],
                        content: `<div class="prompt">
                        <p>
                        站点名称：${ items.docksiteName }
                        </p>
                        <p>
                        片区名称：${ items.districtName?items.districtName:"" }
                        </p>
                        <p>
                        片区名称：${ items.longitude }
                        </p>
                        <p>
                        地址：${ items.address }
                        </p>
                        </div>`,
                        visible: false
                    });

                })
             setTimeout(()=>{
               _this.mapshow = true
                _this.center = options
               _this.data = resetdata
               _this.windows = windows;
             },1000)
             if(data.length<1){
               _this.data = []
             }
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
  .remapbox{
    display:flex;
    flex:1;
    width: 100%;
    height: 500px;
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
    // background: rgba(255,255,255,.5);
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
