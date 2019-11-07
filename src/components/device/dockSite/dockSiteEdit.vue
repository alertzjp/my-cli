<template>
 <div class="mapboxlist">
   <div class="heanderFixed">
     <Form ref="b10Fence" :model="b10Fence" :label-width="90" :rules="ruleValidate">
         <Row>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点编号"  prop="docksiteNo">
                   <Input type="text" v-model="b10Fence.docksiteNo"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点名称"  prop="docksiteName">
                   <Input type="text" v-model="b10Fence.docksiteName"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="设备号"  prop="equipmentNo">
                   <Input type="text" v-model="b10Fence.equipmentNo"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="车位数"  prop="totalPileNum">
                   <InputNumber v-model="b10Fence.totalPileNum"></InputNumber>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="总车辆数"  prop="totalBikeNum">
                 <InputNumber v-model="b10Fence.totalBikeNum"></InputNumber>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="公共自行车数"  prop="bikeNum">
                 <InputNumber v-model="b10Fence.bikeNum"></InputNumber>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点类型"  prop="type">
                  <div class="" style="z-index:1002;position: relative;">
                    <Select v-model="b10Fence.siteType">
                         <Option value="">全部</Option>
                         <Option value="1">无桩站点</Option>
                         <Option value="2">综合站点</Option>
                    </Select>
                  </div>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="设备类型"  prop="type">
                 <div class="" style="z-index:1001;position: relative;">
                   <Select v-model="b10Fence.type">
                        <Option value="">全部</Option>
                        <!-- <Option value="1">一代站点</Option> -->
                        <Option value="2">二代站点</Option>
                   </Select>
                 </div>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="b10Fence.type==2">
               <FormItem label="低频号" required prop="triggerNo">
                 <Input type="text" v-model="b10Fence.triggerNo"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="省市区">
                  <area-component @areaEmit="areaEmit" :areaData="areaData" v-if="show"></area-component>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="具体地址" prop="address">
                 <Input type="text" v-model="b10Fence.address"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="纬度" prop="gpsLatitude">
                 <Input type="text" v-model="b10Fence.latitude"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="经度" prop="gpsLongitude">
                 <Input type="text" v-model="b10Fence.longitude"></Input>
               </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="24" :lg="24">
               <FormItem label="站点状态" prop="status">
                 <Select v-model="b10Fence.status">
                      <Option value="">全部</Option>
                      <Option  value="1">运营中</Option>
                      <Option  value="-1">关闭</Option>
                 </Select>
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
    const validateAge = (rule, value, callback) => {
          if(this.b10Fence.type==2){
            if (value === '') {
                callback(new Error('低频号没有传'));
            }else if(value.length<4 || value.length>8){
              callback(new Error('低频号编号4-8位'));
            }
            else {
              callback();
            }
          }
    };
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
      areadata:[],
      num:1000000,
      cityindex:0,
      idx:0,
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
        totalPileNum:0,
        freePileNum:'0',
        totalBikeNum:0,
        bikeNum:0,
        docksiteNo:'',
        equipmentNo:'',
        status:'1',
        type:'1',
        triggerNo:''
      },
      ruleValidate: {
        docksiteName: [
            { required: true, message: '站点名称没有填写', trigger: 'blur' }
        ],
        docksiteNo: [
            { required: true, message: '站点编号没有填写', trigger: 'blur' }
        ],
        address: [
            { required: true, message: '具体地址没有填写', trigger: 'blur' }
        ],
        triggerNo: [
           { validator: validateAge, trigger: 'blur' }
        ]
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
            if(result&&JSON.stringify(result) != "{}"){
              let center = [result.districtList[0].center.lng,result.districtList[0].center.lat]
              if(_this.cityindex!=0){
                Map = new AMap.Map("amapvue", {
                  resizeEnable: true,
                  zoom: 14,
                  center:center, //初始地图中心点
              });

              _this.areadata=[];
              result.districtList[0].boundaries.forEach((item)=>{
                item.forEach((a)=>{
                  _this.areadata.push([a.lng,a.lat])
                })
              })
              _this.mappolygon()

              marker = new AMap.Marker({
                  icon: "/static/bike.png",
                  position: _this.disgps,
                  offset: new AMap.Pixel(-13, -30)
                });
              marker.setMap(Map);

              }
              _this.cityindex = 1
            }
        });
    },
   mappolygon(){
      let _this = this;
      Map = new AMap.Map("amapvue", {
          resizeEnable: true,
          zoom: 14
      });
      polygonTick = new AMap.Polygon({
         path: this.areadata,
         strokeColor: "#0CBE52",
         strokeWeight: 6,
         strokeOpacity: 0.2,
         fillOpacity: 0.4,
         fillColor: '#000',
         zIndex: 50,
     })
      Map.add(polygonTick)
      Map.setFitView([ polygonTick ])
      polygonTick.on('click', this.showInfoClick);
    },
   areaEmit(e){
     if(e){
       this.b10Fence.provinceCode=e[0].code||"";
       this.b10Fence.provinceName=e[0].name||"";
       this.b10Fence.cityCode=e[1].code||"";
       this.b10Fence.cityName=e[1].name||"";
       this.b10Fence.countyCode=e[2]?e[2].code:"";
       this.b10Fence.countyName=e[2]?e[2].name:"";
       this.city = []
       this.city.push(e[0].code.substr(0,2))
       this.city.push(e[1].code.substr(0,4))
       // this.city.push(e[2].code)
       if(e[2]){
         this.city.push(e[2].code)
       }
       this.citylist = []
       this.citylist.push(e[0].code.substr(0,2))
       this.citylist.push(e[1].code.substr(0,4))
       // this.citylist.push(e[2].code)
       if(e[2]){
         this.citylist.push(e[2].code)
       }
       this.b10Fence.provinceCode=this.b10Fence.provinceCode.substr(0,2)
       this.b10Fence.cityCode=this.b10Fence.cityCode.substr(0,4);
       // let str=this.b10Fence.provinceName+this.b10Fence.cityName+this.b10Fence.countyName;

       // this.getcity(this.b10Fence.cityName)
       this.b10Fence.countyCode?this.getcity(this.b10Fence.countyCode):this.getcity(this.b10Fence.cityCode+"00")

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
      this.idx=1
      this.b10Fence.longitude = e.lnglat.lng * this.num
      this.b10Fence.latitude = e.lnglat.lat * this.num
      let data = []
          data.push(e.lnglat.lng)
          data.push(e.lnglat.lat)
          // Map.remove(marker)
          if(marker){
              Map.remove(marker)
          }
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
             _this.b10Fence.siteType = ''+reset.resData.siteType
             _this.b10Fence.triggerNo = ''+reset.resData.triggerNo=="null"?'':reset.resData.triggerNo?reset.resData.triggerNo:''
             _this.disgps = [reset.resData.longitude/1000000,reset.resData.latitude/1000000]
             _this.areaData = []
             _this.areaData.push(reset.resData.provinceCode+"0000")
             _this.areaData.push(reset.resData.cityCode+"00")
             _this.areaData.push(reset.resData.countyCode)
             _this.show = true
             _this.map()
             _this.b10Fence.countyCode?this.getcity(this.b10Fence.countyCode):this.getcity(this.b10Fence.cityCode+"00")
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
          let point = marker.getPosition();
          let isPointInRing = AMap.GeometryUtil.isPointInRing(point,this.areadata);
          if(!isPointInRing){
            this.$Message.warning("所选站点不在所选区域内")
            return
          }
          this.addpost();
        }
    })
   },
   addpost () {
      let listdata = {
         data:{
           dockSiteList:{
             id:this.b10Fence.id,
             docksiteName:this.b10Fence.docksiteName,
             provinceCode:this.b10Fence.provinceCode,
             cityCode:this.b10Fence.cityCode,
             countyCode:this.b10Fence.countyCode,
             address:this.b10Fence.address,
             longitude:this.b10Fence.longitude,
             latitude:this.b10Fence.latitude,
             totalPileNum:this.b10Fence.totalPileNum,
             // freePileNum:parseInt(this.b10Fence.totalPileNum)-parseInt(this.b10Fence.totalBikeNum),
             bikeNum:this.b10Fence.bikeNum,
             docksiteNo:this.b10Fence.docksiteNo,
             equipmentNo:this.b10Fence.equipmentNo,
             status:parseInt(this.b10Fence.status),
             type:this.b10Fence.type,
             totalBikeNum:this.b10Fence.totalBikeNum,
             siteType:this.b10Fence.siteType
           },
           token:this.$webapi.get('token'),
         }
      }
      if(this.b10Fence.type==2){
        listdata.data.dockSiteList.triggerNo = this.b10Fence.triggerNo
      }
      listdata.data = JSON.stringify(listdata.data)

      let _this =  this
      this.loading = true
      this.$api.post('/bicycledocksite/update',listdata,reset => {
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
