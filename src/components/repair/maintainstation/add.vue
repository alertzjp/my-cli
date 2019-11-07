<template>
 <div class="mapboxlist">
   <div class="heanderFixed">
     <Form ref="maintainSite" :model="maintainSite" :label-width="100" :rules="ruleValidate">
         <Row>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="维修站点名称" prop="maintainSiteName">
                   <Input type="text" v-model="maintainSite.maintainSiteName"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="维修站点地区" required >
                    <area-component @areaEmit="areaEmit"></area-component>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="具体地址" prop="address">
                   <Input type="text" v-model="maintainSite.address"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="站点负责人" required>
                    <maintainerComponent @emitmaintainer="emitmaintainer"></maintainerComponent>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="经度" required>
                    <Input type="text" v-model="maintainSite.Longitude"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="纬度" required>
                    <Input type="text" v-model="maintainSite.Latitude"></Input>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="24" :md="24" :lg="24">
               <div class="">
                 <FormItem>
                     <Button type="primary" :loading="loading" @click="add('maintainSite')">保存</Button>
                     <Button  @click="$router.go(-1)">返回</Button>
                 </FormItem>
               </div>
             </Col>
         </Row>
     </Form>
   </div>
   <div class="mapbox" id="amapvue"></div>
 </div>
</template>
<script>
import areaComponent from '../../pub/iviewarea.vue'
import fenceComponent from '../../pub/fencelistcommon.vue'
import maintainerComponent from '../../pub/maintainerIdcomponent.vue'
let Map,marker;
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
      loading:false,
      flagshow:false,
      itemindex:0,
      b11FenceDetailList:[],
      newdockdata:[],
      city:[],
      num:1000000,
      maintainSite:{
          maintainSiteName:"",
          provinceCode:"" ,
           cityCode:"",
           countyCode:"",
           address:"",
           Longitude:"",
           Latitude:"",
           principalsId:""
      },
      ruleValidate: {
         maintainSiteName: [
            { required: true, message: '维修名称没有填写', trigger: 'blur' },
            { type: 'string', min:1,max:16, message: '维修站点名称最小1个字，最大16个字', trigger: 'blur' }
        ],
        address: [
           { required: true, message: '具体地址没有填写', trigger: 'blur' },
           { type: 'string', min:1,max:100, message: '具体地址最小1个字，最大100个字', trigger: 'blur' }
       ],
      }
    }
  },
  mounted() {
    // this.map()
    let _this = this;
    marker,Map = new AMap.Map("amapvue", {
         resizeEnable: true,
         zoom: 14
     });
     Map.on('click', this.showInfoClick);
    this.savemap()
  },
  methods: {
    savemap () {
      geocoder = new AMap.Geocoder({
          city:"120101", //城市设为北京，默认：“全国”
       });
    },
    areaEmit (e) {
      this.maintainSite.provinceCode = (e[0].code).substr(0,2)
      this.maintainSite.cityCode = (e[1].code).substr(0,4)
      this.maintainSite.countyCode = e[2].code
      this.maintainSite.provinceName = e[0].name
      this.maintainSite.cityName = e[1].name
      this.maintainSite.countyName = e[2].name
      this.savemap()
    },
    map () {
       let _this = this;
    },
    emitmaintainer(e){
      this.maintainSite.principalsId=e.id;
    },
    showInfoClick (e) {
      if (marker) {
           marker.setMap(null);
           marker = null;
       }
       this.maintainSite.Longitude = e.lnglat.lng * this.num
       this.maintainSite.Latitude = e.lnglat.lat * this.num
      marker = new AMap.Marker({
           icon: "/static/bike.png",
           position: [e.lnglat.lng,e.lnglat.lat],
           offset: new AMap.Pixel(-13, -30)
       });
       marker.setMap(Map);
       let data = [e.lnglat.lng,e.lnglat.lat]
       this.changeLocation(data)
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
            _this.maintainSite.address = address
       }else{
         // console.log(status)
         // console.log(result)
         // alert(JSON.stringify(result))
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
    if(this.maintainSite.principalsId==""){
      this.$Message.info("站点负责人没有选择");
      return;
    }
    if(this.maintainSite.Longitude==""){
      this.$Message.info("纬度没有填写");
      return;
    }
    if(this.maintainSite.Latitude==""){
      this.$Message.info("纬度没有填写");
      return;
    }
    if(this.maintainSite.provinceCode=="" && this.maintainSite.cityCode=="" && this.maintainSite.countyCode==""){
      this.$Message.info("地区没有填写");
      return;
    }
    this.addpost();
  },
  addpost () {
      let listdata = {
         data:JSON.stringify({
            maintainSite:{
                maintainSiteName:this.maintainSite.maintainSiteName,
                provinceCode:this.maintainSite.provinceCode,
                cityCode:this.maintainSite.cityCode,
                countyCode:this.maintainSite.countyCode,
                address:this.maintainSite.address,
                principalsId:this.maintainSite.principalsId,
                longitude:parseInt(this.maintainSite.Longitude),
                latitude:parseInt(this.maintainSite.Latitude),
            },
            token:this.$webapi.get('token')
         })
      }
      let _this =  this
      this.loading = true
      this.$api.post('/maintainsite/add',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          _this.$router.push({path:"/admin/repair/maintainStation/list"})
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
