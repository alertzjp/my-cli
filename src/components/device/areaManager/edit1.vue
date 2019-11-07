<template>
 <div class="mapboxlist">
   <div class="heanderFixed" v-if="show">
     <Form ref="b10Fence" :model="b10Fence" :label-width="90" :rules="ruleValidate">
         <Row>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="电子围栏">
                   <Button  type="text">{{$route.query.faceName||""}}</Button>
                   <!-- <fence-component :city="city" @fenceEmitComponent="fenceEmitComponent"></fence-component> -->
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="片区名称" prop="name">
                   <Input type="text" v-model="b10Fence.name"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="片区负责人">
                    <maintainerComponent @emitmaintainer="emitmaintainer" :propsid="b10Fence.principalsId"></maintainerComponent>
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
   <div class="buttongroup">
     <Button type="primary" id="polygon" @click="open()" v-if="!openshow">开始编辑</Button>
     <Button type="primary" id="eidtpolygon" @click="close()" v-if="openshow">结束编辑</Button>
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
let polygonTick,polygonTick1;
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
      show:false,
      openshow:false,
      itemindex:0,
      flag:false,
      b11FenceDetailList:[],
      newFenceDetailList:[],
      newdockdata:[],
      newb11FenceDetailList:[],
      city:[],
      bigarr:[],
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
    let _this = this;
    this.getfancelist();
    this.getArea();
  },
  methods: {
    getArea(){
      let _this = this
      let listdata = {
           data: JSON.stringify({
               token:this.$webapi.get('token'),
               districtId:""+this.$route.query.areaID,
               fenceId:this.$route.query.fenceId
           })
       }
      this.$api.get('/district/by_fenceId',listdata,reset => {
          if (reset.codeId === 1) {
              _this.show = true;
              reset.resData.map((a)=>{
                 if(a.id==this.$route.query.areaID){
                    _this.b10Fence=a;
                    setTimeout(function(){
                      _this.b10Fence.districtDetailList.map((b)=>{
                        let arr=[b.gpsLongitude/_this.num,b.gpsLatitude/_this.num];
                        _this.newb11FenceDetailList.push(arr);
                      })
                      _this.map([_this.newb11FenceDetailList[0].gpsLongitude,_this.newb11FenceDetailList[0].gpsLatitude])
                    },100)
                 }
                 setTimeout(function(){
                   _this.bigarr.push(a.districtDetailList)
                   _this.bigarr.map((b,index)=>{
                      let newarr=[];
                      b.map((c)=>{
                        let arr=[c.gpsLongitude/_this.num,c.gpsLatitude/_this.num];
                        newarr.push(arr)
                     })
                     _this.maparea(newarr,index)
                  })
                 },100)
              })
             //  reset.resData.map((a)=>{
             //     if(a.id==this.$route.query.areaID){
             //        _this.b10Fence=a;
             //        a.districtDetailList.map((b)=>{
             //          let arr=[b.gpsLongitude/_this.num,b.gpsLatitude/_this.num];
             //         _this.newb11FenceDetailList.push(arr);
             //       })
             //     }
             //  })
             // _this.map([_this.newb11FenceDetailList[0].gpsLongitude,_this.newb11FenceDetailList[0].gpsLatitude])
          }
      })
    },
    maparea(arr,i){
      console.log(arr,i)
      let _this = this;
      i= new AMap.Polygon({
          path: arr,
          strokeColor: "#000000",
          strokeWeight: 2,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#C7BFB2',
          zIndex: 50,
      })
      Map.add([i])
       //缩放地图到合适的视野级别
      Map.setFitView([i])
    },
    map () {
      // console.log(this.b11FenceDetailList)
      // console.log(this.newb11FenceDetailList)
      let _this = this;
      Map = new AMap.Map("amapvue", {
           resizeEnable: true,
           zoom: 14
       });
      //电子围栏
       polygonTick = new AMap.Polygon({
          path: this.b11FenceDetailList,
          strokeColor: "#0000FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#FAEFDC',
          zIndex: 50,
      })
      //片区
      polygonTick1 = new AMap.Polygon({
         path: this.newb11FenceDetailList,
         strokeColor: "#FF33FF",
         strokeWeight: 2,
         strokeOpacity: 0.8,
         fillOpacity: 0.6,
         fillColor: '#1791fc',
         zIndex: 50,
     })
      // Map.add(polygonTick)
      Map.add([polygonTick,polygonTick1])
       // 缩放地图到合适的视野级别
      Map.setFitView([ polygonTick,polygonTick1 ])
      polyEditor = new AMap.PolyEditor(Map, polygonTick1)
      polyEditor.on('addnode', function(event) {
          // console.log('触发事件：addnode')
          // console.log(event)
         _this.newFenceDetail(event)

      })
      polyEditor.on('adjust', function(event) {
          // console.log('触发事件：adjust')
          // console.log(event)
          _this.newFenceDetail(event)
      })

      polyEditor.on('removenode', function(event) {
          // console.log('触发事件：removenode')
          // console.log(event)
          _this.newFenceDetail(event)
      })

      polyEditor.on('end', function(event) {
          // console.log('触发事件： end')
          // console.log(event)
          _this.newFenceDetail(event)
          // event.target 即为编辑后的多边形对象
      })
    },
    emitmaintainer(e){
      this.b10Fence.principalsId=e.id;
    },
    fenceEmitComponent (e) {
      this.b10Fence.fenceId = e.id
      this.getfancelist(e)
    },
    newFenceDetail (event) {
      let _this = this;
      if(event.target.F.path.length>0){
        _this.newFenceDetailList = []
        event.target.F.path.forEach((a,index)=>{
          let str = {
             orderNo:parseInt(index)+1,
             gpsLongitude:a.lng*_this.num,
             gpsLatitude:a.lat*_this.num
          }
          _this.newFenceDetailList.push(str)
        })
      }
      //console.log(_this.newFenceDetailList)
    },
    open () {
      polyEditor.open()
      this.openshow = !this.openshow
    },
    close () {
      polyEditor.close()
      this.openshow = !this.openshow
    },
    delpolygon () {
       this.flagshow=false;
       this.b11FenceDetailList = []
       this.itemindex = 0
       // Map.remove();
       Map.clearMap();
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
    getfancelist(){
     let _this = this
     let data = {
         data:{
           token:this.$webapi.get('token'),
           id:this.$route.query.fenceId||""
         }
     }
     this.$api.get('/fence/toupdate',data,reset => {
         if (reset.codeId === 1) {
             let arr=[];
              _this.b11FenceDetailList= reset.resData.fenceDetailList.map((a)=>{
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
         console.log(status)
         console.log(result)
         alert(JSON.stringify(result))
       }
    });
    },
    add (name) {
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
      let _this=this;
      let newdistrictDetailList=[]
      if(this.newFenceDetailList.length>0){
        newdistrictDetailList=this.newFenceDetailList
      }else{
        this.newb11FenceDetailList.map((a)=>{
          let obj={
             gpsLongitude:a.lng*_this.num,
             gpsLatitude:a.lat*_this.num
          }
          newdistrictDetailList.push(obj)
        })
      }
      let listdata = {
         data:JSON.stringify({
            district:[
               {
                 id:""+this.$route.query.areaID,
                 name:this.b10Fence.name,
                 principalsId:this.b10Fence.principalsId,
                 districtDetailList:newdistrictDetailList,
               }
            ],
            token:this.$webapi.get('token'),
         })
      }
      this.loading = true
      this.$api.post('/district/updateList',listdata,reset => {
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
