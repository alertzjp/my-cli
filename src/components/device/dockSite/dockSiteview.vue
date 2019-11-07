<template>
 <div class="mapboxlist">
   <div class="heanderFixed">
     <Form ref="b10Fence" :model="b10Fence" :label-width="90" :rules="ruleValidate">
         <Row>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点状态" prop="status">
                {{b10Fence.status==1?"运营中":"关闭"}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点类型"  prop="type">
                 {{b10Fence.siteType==1?"无桩站点":"综合站点"}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="设备类型"  prop="type">
                 {{b10Fence.type==1?"一代站点":"二代站点"}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点名称"  prop="docksiteName">
                   {{b10Fence.docksiteName}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点编号"  prop="docksiteNo">
                 {{b10Fence.docksiteNo}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="设备号"  prop="equipmentNo">
                 {{b10Fence.equipmentNo}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="低频号" prop="triggerNo">
                 {{b10Fence.triggerNo}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="总车辆"  prop="totalBikeNum">
                 {{b10Fence.totalBikeNum}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="车位数"  prop="totalPileNum">
                 {{b10Fence.totalPileNum}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="车辆数"  prop="bikeNum">
                 {{b10Fence.bikeNum}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="具体地址" prop="address">
                 {{b10Fence.address}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="纬度" prop="gpsLatitude">
                 {{b10Fence.latitude}}
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="经度" prop="gpsLongitude">
                  {{b10Fence.longitude}}
               </FormItem>
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
let Map;
let mouseToolshow;
let geocoder;
let polygonTick;
let polyEditor;
let marker
let district=null
export default {
  name: "",
  components:{
    areaComponent,
    fenceComponent
  },
  data () {
    let self = this;
    return {
      plugins: ['Geocoder'],
      loading:false,
      disabled:true,
      show:false,
      dearalldata:[],
      b11FenceDetailList:[],
      newdockdata:[],
      city:[],
      citylist:[],
      disgps:[],
      areaData:[],
      num:1000000,
      b10Fence:{
        id:"",
        docksiteName:'',
        countyCode:'',
        countryCode:'156',
        provinceCode:'',
        cityCode:'',
        address:'',
        longitude:'',
        latitude:'',
        totalPileNum:'0',
        freePileNum:'0',
        totalBikeNum:'0',
        bikeNum:'0',
        docksiteNo:'',
        equipmentNo:'',
        status:'1',
        type:'1',
        triggerNo:''
      },
      ruleValidate: {
      }
    }
  },
  mounted() {
    setTimeout(()=>{
      this.getdistlist()
    },300)
  },
  methods: {
    map () {
      let _this = this;
       Map = new AMap.Map("amapvue", {
           resizeEnable: true,
           center:_this.disgps,
           zoom: 14
       });
      Map.on('click', _this.showInfoClick);
      if(!district){
          //实例化DistrictSearch
          let opts = {
              subdistrict: 0,   //获取边界不需要返回下级行政区
              extensions: 'all',  //返回行政区边界坐标组等具体信息
              level: 'city'  //查询行政级别为 市
          };
          district = new AMap.DistrictSearch(opts);
      }
      marker = new AMap.Marker({
          icon: "/static/bike.png",
          position: this.disgps,
          offset: new AMap.Pixel(-13, -30)
        });
      marker.setMap(Map);
    },
    getcity (e) {
      let city = e
      let _this = this;
      district.search(city, function(status, result) {
            if(result){
              let center = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              Map = new AMap.Map("amapvue", {
                  resizeEnable: true,
                  zoom: 14,
                  center:center, //初始地图中心点
              });
              Map.on('click', _this.showInfoClick);
              marker = new AMap.Marker({
                  icon: "/static/bike.png",
                  position: _this.disgps,
                  offset: new AMap.Pixel(-13, -30)
                });
              marker.setMap(Map);
            }
        });
    },
    areaEmit(e){
     if(e){
       this.b10Fence.provinceCode=e[0].code||"";
       this.b10Fence.provinceName=e[0].name||"";
       this.b10Fence.cityCode=e[1].code||"";
       this.b10Fence.cityName=e[1].name||"";
       this.b10Fence.countyCode=e[2].code||"";
       this.b10Fence.countyName=e[2].name||"";
       this.city = []
       this.city.push(e[0].code.substr(0,2))
       this.city.push(e[1].code.substr(0,4))
       this.city.push(e[2].code)
       this.citylist = []
       this.citylist.push(e[0].code.substr(0,2))
       this.citylist.push(e[1].code.substr(0,4))
       this.citylist.push(e[2].code)
       this.b10Fence.provinceCode=this.b10Fence.provinceCode.substr(0,2)
       this.b10Fence.cityCode=this.b10Fence.cityCode.substr(0,4);
       let str=this.b10Fence.provinceName+this.b10Fence.cityName+this.b10Fence.countyName;
       this.getcity(this.b10Fence.cityName)
     }else{
       this.city = []
       this.city.push(e[0].code)
       this.city.push(e[1].code)
       this.city.push(e[2].code)
       this.citylist = []
       this.citylist.push(e[0].code)
       this.citylist.push(e[1].code)
       this.citylist.push(e[2].code)
     }
    },
    fenceEmitComponent (e) {
      this.b10Fence.fenceId = e.id
      this.getfancelist(e)
    },
    showInfoClick (e) {
      this.b10Fence.gpsLongitude = e.lnglat.lng * this.num
      this.b10Fence.gpsLatitude = e.lnglat.lat * this.num
      let data = []
          data.push(e.lnglat.lng)
          data.push(e.lnglat.lat)
          Map.remove(marker)
          Map.setFitView();
          marker = new AMap.Marker({
              icon: "/static/bike.png",
              position: data,
              offset: new AMap.Pixel(-13, -30)
            });
          marker.setMap(Map);
      this.changeLocation(data)
    },
    getdistlist(){
     let _this = this
     let data = {
         data:{
           token:this.$webapi.get('token'),
           id:""+this.$route.query.dockID
         }
     }
     this.$api.get('/bicycledocksite/findOne',data,reset => {
         if (reset.codeId === 1) {
             _this.b10Fence.id = reset.resData.id
             _this.b10Fence.docksiteName = reset.resData.docksiteName
             _this.b10Fence.countyCode = reset.resData.countyCode
             _this.b10Fence.countryCode = reset.resData.countryCode
             _this.b10Fence.provinceCode = reset.resData.provinceCode
             _this.b10Fence.cityCode = reset.resData.cityCode
             _this.b10Fence.address = reset.resData.address
             _this.b10Fence.longitude = reset.resData.longitude
             _this.b10Fence.latitude = reset.resData.latitude
             _this.b10Fence.totalPileNum = reset.resData.totalPileNum
             _this.b10Fence.freePileNum = reset.resData.freePileNum
             _this.b10Fence.totalBikeNum = reset.resData.totalBikeNum
             _this.b10Fence.bikeNum = reset.resData.bikeNum
             _this.b10Fence.docksiteNo = reset.resData.docksiteNo
             _this.b10Fence.equipmentNo = reset.resData.equipmentNo
             _this.b10Fence.status = ''+reset.resData.status
             _this.b10Fence.type = ''+reset.resData.type
             _this.b10Fence.triggerNo = ''+reset.resData.triggerNo
             _this.b10Fence.siteType = ''+reset.resData.siteType
             _this.disgps = [reset.resData.longitude/1000000,reset.resData.latitude/1000000]
             _this.areaData = []
             _this.areaData.push(reset.resData.provinceCode+"0000")
             _this.areaData.push(reset.resData.cityCode+"00")
             _this.areaData.push(reset.resData.countyCode)
             _this.map()
             _this.show = true
         }
     })
   },
   getfancelist(e){
    let _this = this
    let data = {
        data:{
          token:this.$webapi.get('token'),
          id:""+e
        }
    }
    this.$api.get('/bicycledocksite/findOne',data,reset => {
        if (reset.codeId === 1) {
           _this.b11FenceDetailList = reset.resData.fenceDetailList.map((a)=>{
             return [a.gpsLongitude/_this.num,a.gpsLatitude/_this.num]
           })
           _this.citylist.push(reset.resData.provinceCode)
           _this.citylist.push(reset.resData.cityCode)
           _this.citylist.push(reset.resData.countyCode)
           _this.city.push(reset.resData.provinceCode+"0000")
           _this.city.push(reset.resData.cityCode+"00")
           _this.city.push(reset.resData.countyCode)
           _this.b10Fence.fenceId = reset.resData.id
           _this.b10Fence.fenceName = reset.resData.name
           _this.map([_this.b11FenceDetailList[0].gpsLongitude,_this.b11FenceDetailList[0].gpsLatitude])
           _this.show = true
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

       }
    });
  },
  add (name) {
    this.$refs[name].validate((valid) => {
        if (valid) {
          this.addpost();
        }
    })
   },
  addpost () {
      let listdata = {
         data:JSON.stringify({
           dockSiteList:{
             id:this.b10Fence.id,
             docksiteName:this.b10Fence.docksiteName,
             provinceCode:this.b10Fence.provinceCode,
             cityCode:this.b10Fence.cityCode,
             countyCode:this.b10Fence.countyCode,
             address:this.b10Fence.address,
             longitude:this.b10Fence.gpsLongitude,
             latitude:this.b10Fence.gpsLatitude,
             totalPileNum:this.b10Fence.totalPileNum,
             freePileNum:this.b10Fence.freePileNum,
             bikeNum:this.b10Fence.bikeNum,
             docksiteNo:this.b10Fence.docksiteNo,
             equipmentNo:this.b10Fence.equipmentNo,
             status:parseInt(this.b10Fence.status),
             type:this.b10Fence.type,
             totalBikeNum:this.b10Fence.totalBikeNum,
             triggerNo:this.b10Fence.triggerNo,
           },
           token:this.$webapi.get('token'),
         })
      }
      let _this =  this
      this.loading = true
      this.$api.post('/bicycledocksite/add',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          _this.$router.push({path:"/admin/device/dockSite/list"})
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    }
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
  flex: 1;
  z-index: 50
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
  z-index: 110
}
.buttongroup{
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
