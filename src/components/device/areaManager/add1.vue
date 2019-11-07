<template>
 <div class="mapboxlist">
   <div class="heanderFixed">
     <Form ref="b10Fence" :model="b10Fence" :label-width="90" :rules="ruleValidate">
         <Row>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="电子围栏">
                   <fence-component :city="city" @fenceEmitComponent="fenceEmitComponent"></fence-component>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="flagshow">
                 <FormItem label="片区名称" prop="name">
                   <Input type="text" v-model="b10Fence.name"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="flagshow">
                 <FormItem label="片区负责人">
                    <maintainerComponent @emitmaintainer="emitmaintainer"></maintainerComponent>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
               <div class="">
                 <FormItem>
                     <Button type="primary" :loading="loading" @click="add('b10Fence')">保存</Button>
                     <Button  @click="$router.go(-1)">返回</Button>
                 </FormItem>
               </div>
             </Col>
         </Row>
     </Form>
   </div>
   <div class="mapbox" id="amapvue"></div>
   <div class="buttongroup" v-show="b10Fence.fenceId">
     <Button type="primary" id="polygon" @click="polygon()" v-if="itemindex==0">鼠标绘制面</Button>
     <Button type="primary" id="eidtpolygon" @click="delpolygon()" >清除</Button>
   </div>
 </div>
</template>
<script>
import areaComponent from '../../pub/iviewarea.vue'
import fenceComponent from '../../pub/fencelistcommon.vue'
import maintainerComponent from '../../pub/maintainerIdcomponent.vue'
let Map;
let mouseToolshow;
let geocoder;
let polygonTick;
let polyEditor;
export default {
  name: "",
  components:{
    areaComponent,
    fenceComponent,
    maintainerComponent
  },
  data () {
    let self = this;
    return {
      plugins: ['Geocoder'],
      loading:false,
      flagshow:false,
      itemindex:0,
      b11FenceDetailList:[],
      newdockdata:[],
      city:[],
      num:1000000,
      b10Fence:{
        name:"",
        principalsId:"",
        fenceId:"",
      },
      ruleValidate: {
         name: [
            { required: true, message: '片区名称没有填写', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    // this.map()
    let _this = this;
    Map = new AMap.Map("amapvue", {
         resizeEnable: true,
         zoom: 14
     });
     mouseToolshow = new AMap.MouseTool(Map)
     mouseToolshow.on('draw', function(event) {
        // event.obj 为绘制出来的覆盖物对象
        _this.flagshow=true;
        if(event.obj.F.path.length>0){
          _this.b11FenceDetailList = []
          event.obj.F.path.forEach((a,index)=>{
            let str = {
               orderNo:parseInt(index)+1,
               gpsLongitude:a.lng*_this.num,
               gpsLatitude:a.lat*_this.num
            }
            _this.b11FenceDetailList.push(str)
          })
        }
        _this.itemindex = 1
      })
  },
  methods: {
    map () {
       let _this = this;
       // Map = new AMap.Map("amapvue", {
       //     resizeEnable: true,
       //     zoom: 14
       // });
       polygonTick = new AMap.Polygon({
          path: this.b11FenceDetailList,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
      })
       polygonTick.on('click', this.showInfoClick);
       Map.add(polygonTick)
      //  // 缩放地图到合适的视野级别
       Map.setFitView([ polygonTick ])

    },
    emitmaintainer(e){
      this.b10Fence.principalsId=e.id;
    },
    fenceEmitComponent (e) {
      this.b10Fence.fenceId = e.id
      this.getfancelist(e)
    },
    delpolygon () {
       this.flagshow=false;
       this.b11FenceDetailList = []
       this.itemindex = 0
       // Map.remove();
        mouseToolshow.close(true)
    },
    polygon () {
      this.itemindex = 1
      mouseToolshow.polygon({
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      })
    },
    showInfoClick (e) {
      this.b10Fence.gpsLongitude = e.lnglat.lng * this.num
      this.b10Fence.gpsLatitude = e.lnglat.lat * this.num
      let data = []
          data.push(e.lnglat.lng)
          data.push(e.lnglat.lat)
      this.changeLocation(data)
    },
    getfancelist(e){
     let _this = this
     let data = {
         data:{
           token:this.$webapi.get('token'),
           id:e.id
         }
     }
     this.$api.get('/fence/toupdate',data,reset => {
         if (reset.codeId === 1) {
            _this.b11FenceDetailList = reset.resData.fenceDetailList.map((a)=>{
              return [a.gpsLongitude/_this.num,a.gpsLatitude/_this.num]
            })
            _this.map([_this.b11FenceDetailList[0].gpsLongitude,_this.b11FenceDetailList[0].gpsLatitude])
         }
     })
     },
    getdock(){
     let _this = this
     let listdata = {
         data:{
           token:this.$webapi.get('token'),
         }
     }
     this.$api.get('/docksite/toadd',listdata,reset => {
         if (reset.codeId === 1) {
            _this.newdockdata = reset.resData
         }
     })
   },
    changeLocation(data){
     let _this = this;
     let geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    geocoder.getAddress(data,function(status, result){
      if (status === 'complete'&&result.regeocode) {
           let address = result.regeocode.formattedAddress;
            _this.b10Fence.address = address
       }else{
         // console.log(status)
         // console.log(result)
         // alert(JSON.stringify(result))
       }
    });
    },
  add (name) {
    if(!this.b10Fence.fenceId){
      this.$Message.info("电子围栏没有选择");
      return;
    }
    this.$refs[name].validate((valid) => {
        if (valid) {
          this.add1();
        }
    })
   },
  add1() {
    if(!this.b10Fence.fenceId){
      this.$Message.info("电子围栏没有选择");
      return;
    }
    if(!this.b10Fence.principalsId){
      this.$Message.info("片区负责人没有选择");
      return;
    }
    this.addpost();
  },
  addpost () {
      let listdata = {
         data:JSON.stringify({
            district:[
               {
                 name:this.b10Fence.name,
                 fenceId:this.b10Fence.fenceId,
                 principalsId:this.b10Fence.principalsId,
                 districtDetailList:this.b11FenceDetailList,
               }
            ],
            token:this.$webapi.get('token'),
         })
      }
      let _this =  this
      this.loading = true
      this.$api.post('/district/addList',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          _this.$router.push({path:"/admin/device/areaManager/list"})
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    },
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
