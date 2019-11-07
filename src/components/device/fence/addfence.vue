<template>
   <div class="mapboxlist">
     <div class="heanderFixed">
       <div class="" style="z-index:10000;padding:0 20px">
         <Alert type="error">先选择省市区,然后才会加载地图</Alert>
       </div>
       <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="围栏名称" prop="name">
                       <Input type="text" v-model="formCustom.name"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="24" :md="12" :lg="6" required>
                   <FormItem label="省市区">
                      <area-component @areaEmit="areaEmit"></area-component>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <Button type="primary" @click="add('formCustom')" :loading="loading">保存</Button>
                       <Button  @click="$router.go(-1)">取消</Button>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <div class="mapbox" id="amapvue">
     </div>
     <div class="buttongroup">
       <Button type="primary" id="polygon" @click="polygon()" v-if="itemindex==0">鼠标绘制面</Button>
       <Button type="primary" id="eidtpolygon" @click="delpolygon()" v-if="itemindex!=0">清除</Button>
     </div>
   </div>
</template>
<script>
import areaComponent from '../../pub/iviewarea.vue'
let Map;
let mouseToolshow;
let geocoder;
let district=null
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
      b11FenceDetailList:[],
      num:1000000,
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
    Map = new AMap.Map("amapvue", {
         resizeEnable: true,
         zoom: 10
     });
     mouseToolshow = new AMap.MouseTool(Map)
     mouseToolshow.on('draw', function(event) {
        // event.obj 为绘制出来的覆盖物对象
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
      if(!district){
          //实例化DistrictSearch
          let opts = {
              subdistrict: 0,   //获取边界不需要返回下级行政区
              extensions: 'all',  //返回行政区边界坐标组等具体信息
              level: 'city'  //查询行政级别为 市
          };
          district = new AMap.DistrictSearch(opts);
      }
  },
  methods: {
    map (e) {
      let _this = this
        setTimeout(()=>{
          _this.map()
        },500)
    },
    getcity (e) {
      let city = e
      district.search(city, function(status, result) {
            if(result){
              let center = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              Map.setCenter(center)
              Map.setFitView()
              this.b11FenceDetailList = []
              this.itemindex = 0
              mouseToolshow.close(true)
            }
        });
    },
    delpolygon () {
       this.b11FenceDetailList = []
       this.itemindex = 0
       // Map.remove();
       mouseToolshow.close(true)
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
       this.getcity(this.formCustom.countyName)
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
             name:this.formCustom.name,
             provinceCode:this.formCustom.provinceCode,
             cityCode:this.formCustom.cityCode,
             countyCode:this.formCustom.countyCode,
             totalPileNum:""
           },
           b11FenceDetailList:this.b11FenceDetailList,
           token:this.$webapi.get('token'),
         })
      }
      let _this = this
      _this.loading = true
      this.$api.post('/fence/add',listdata,reset => {
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
  top: 150px;
  right: 20px;
}
</style>
