<template>
   <div class="mapboxlist">
     <div class="heanderFixed" v-if="show">
       <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="围栏名称" prop="name">
                       <Input type="text" v-model="formCustom.name"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="24" :md="12" :lg="6" required>
                   <FormItem label="省市区">
                      <area-component @areaEmit="areaEmit" :areaData="areaData"></area-component>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <Button type="primary" @click="add('formCustom')">保存</Button>
                       <Button  @click="$router.go(-1)">取消</Button>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <div class="mapbox" id="amapvue"></div>
     <div class="buttongroup">
       <Button type="primary" id="polygon" @click="open()" :loading="loading" v-if="!openshow">开始编辑</Button>
       <Button type="primary" id="eidtpolygon" @click="close()" v-if="openshow">结束编辑</Button>
     </div>
   </div>
</template>
<script>
import areaComponent from '../../pub/iviewarea.vue'
let Map;
let mouseToolshow;
let geocoder;
let polygonTick;
let polyEditor;
export default {
  name: "",
  components:{
    areaComponent,
  },
  data () {
    let self = this;
    return {
      loading:false,
      itemindex:0,
      openshow:false,
      newFenceDetailList:[],
      b11FenceDetailList:[],
      num:1000000,
      show:false,
      areaData:[],
      formCustom:{
          name:"",
          provinceCode:"",
          cityCode:"",
          countyCode:"",
          provinceName:"",
          cityName:"",
          countyName:"",
      },
      ruleValidate: {
         name: [
             { required: true, message: '围栏名称沒有填写', trigger: 'blur' }
         ]
      }
    }
  },
  mounted() {
    let _this = this;
        this.list()
  },
  methods: {
    list () {
      let _this = this;
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          id:this.$route.query.id
        })
      }
      this.$api.get('/fence/toupdate',listdata,reset => {
        if (reset.codeId === 1) {
            _this.formCustom = reset.resData
            _this.b11FenceDetailList = reset.resData.fenceDetailList.map((a)=>{
              return [a.gpsLongitude/_this.num,a.gpsLatitude/_this.num]
            })
            _this.areaData.push(reset.resData.provinceCode+"0000")
            _this.areaData.push(reset.resData.cityCode+"00")
            _this.areaData.push(reset.resData.countyCode)
            _this.show = true
            _this.map([_this.b11FenceDetailList[0].gpsLongitude,_this.b11FenceDetailList[0].gpsLatitude])
        }else {
           _this.$netcode.getApiCode(reset)
        }
      })
    },
    map () {
      let _this = this;
      Map = new AMap.Map("amapvue", {
           resizeEnable: true,
           zoom: 14
       });
       polygonTick = new AMap.Polygon({
          path: this.b11FenceDetailList,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
      })
      Map.add(polygonTick)
       // 缩放地图到合适的视野级别
      Map.setFitView([ polygonTick ])
      polyEditor = new AMap.PolyEditor(Map, polygonTick)
      polyEditor.on('addnode', function(event) {
         // console.log('触发事件：addnode')
         //  console.log(event)
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
       this.b11FenceDetailList = []
       this.itemindex = 0
       Map.remove();
    },
    polygon () {
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
    add(name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
           if (valid) {
               _this.addpost();
           }
       })
    },
    test(){
      this.$router.push({
        path:"/admin/device/fence/test"
      })
    },
    areaEmit(e){
     if(e){
       this.formCustom.provinceCode=e[0].code||"";
       this.formCustom.provinceName=e[0].name||"";
       this.formCustom.cityCode=e[1].code||"";
       this.formCustom.cityName=e[1].name||"";
       this.formCustom.countyCode=e[2].code||"";
       this.formCustom.countyName=e[2].name||"";
       this.formCustom.provinceCode=this.formCustom.provinceCode.substr(0,2)
       this.formCustom.cityCode=this.formCustom.cityCode.substr(0,4);
       let str=this.formCustom.provinceName+this.formCustom.cityName+this.formCustom.countyName;
       this.changeLocation(str);
     }
   },
   changeLocation(data){
    let _this = this;
      geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    geocoder.getLocation(data,function(status, result){
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.geocodes) {               
                let arr=[result.geocodes[0].location.lng,result.geocodes[0].location.lat];
                Map.setCenter([result.geocodes[0].location.lng,result.geocodes[0].location.lat])
                //Map.setPosition = (result.geocodes[0].location.lng,result.geocodes[0].location.lat);
            }
        }
    });
  },
  addpost () {
      let listdata = {
         data:JSON.stringify({
           b10Fence:{
             id:this.$route.query.id,
             name:this.formCustom.name,
             provinceCode:this.formCustom.provinceCode,
             cityCode:this.formCustom.cityCode,
             countyCode:this.formCustom.countyCode,
             totalPileNum:""
           },
           b11FenceDetailList:this.newFenceDetailList,
           token:this.$webapi.get('token'),
         })
      }
      let _this = this
      this.loading = true
      this.$api.post('/fence/update',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
            _this.$router.push({
              path:"/admin/device/fence/list"
            })
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
  position:absolute;
  top: 0;
  left:0;
  right:0;
  z-index: 90;
  background: rgba(255,255,255,.9);
  padding-top: 15px;
}
.buttongroup{
  position: absolute;
  top: 100px;
  right: 20px;
}
</style>
