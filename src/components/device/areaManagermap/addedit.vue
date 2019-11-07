<template>
  <div class="areaBox">
     <div class="areaTitle">
       <span></span> {{type==1?"片区建立":type==2?"片区编辑":"片区详情"}}
       <!-- {{areaviewData}} -->
     </div>
     <div class="areaCentent" v-if="show">       
        <Form :model="area" :label-width="90">
          <Row>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区名称:">                    
                    <div><Input v-model="area.districtName"  placeholder="片区名称"></Input></div>                    
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区编号:">
                    <div><Input v-model="area.districtNo"  placeholder="片区编号数字格式"></Input></div>                     
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区中心点:">
                     <!-- <Button type="Default" size="large" long @click="AddMap">请在地图片区上点</Button> -->
                     {{area.longitude}} {{area.latitude}} 
                     <div class="red" v-if="type==1">现绘画的片区上点击获取</div>
                     <div class="red" v-if="type==2">现编辑的片区上点击获取</div>
                      <!-- <Input v-model="area.latitude"  placeholder="请在地图片区上点"></Input> -->
                </FormItem>
              </Col>          
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区负责人:">                                  
                    <div><maintain-component @emitmaintainer="emitmaintainer" :propsid="area.principalsId"></maintain-component></div>                     
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="联系方式:">                
                    <div ><Input v-model="area.principalsTel"  disabled  placeholder="联系方式"></Input></div>     
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <Row>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                      <FormItem label="片区分维护人:" >                           
                          <maintainm-component @emitmaintainer="emitmaintainerList" :newItem="area.maintaintorList"></maintainm-component>                          
                       </FormItem>
                    </Col> 
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                      <FormItem label="联系方式:" >  
                          <Tooltip :content="maintaintorList" placement="top" max-width="200">
                              <div ><Input v-model="maintaintorList" disabled placeholder="联系方式"></Input></div> 
                          </Tooltip>
                       </FormItem>
                    </Col> 
                </Row>            
              </Col>     

              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <div style="margin-top:10px">
                  <Button type="primary" size="large" long @click="areaSave" >保存</Button>
                  <Button type="error" size="large" style="margin-top:10px" long @click="emitClose">取消</Button>                   
                </div>
              </Col>  
            </Row>
        </Form>
     </div>
     <div v-if="!show" class="areaCententfix">
         <Spin fix>加载中...</Spin>
     </div>    
  </div>
</template>
<script>
import { mapState,mapGetters } from 'vuex'
import maintainComponent from "../../pub/maintainerIdcomponentnew.vue"
import maintainmComponent from "../../pub/maintainerIdMcomponentnew.vue"
export default {
  name:"",
  components:{
    maintainComponent,
    maintainmComponent
  },
  inject: ['reload'],
  computed: {
    maintaintorList () {
      let data = this.area.maintaintorList.map(item=>{
        let str = "" +item.mobileNo
        return str
      })
      return data.join(";")
    } 
  },
  props:{
    AllPolygon:{       
      default () {
        return {}
      }
    },
    cursiteshow:{
      default () {
        return false
      }
    },
    type:{
      default(){
        return 1
      }
    },
    regionScope: {
      type: Array,
      default () {
          return []
      }
    },   
    districtItem:{
      default(){
        return {}
      }
    }
  }, 
  data () {
    return {
      show:false,
      areaID:"",
      area:{
        districtName:"",
        districtNo:"",
        latitude:"",
        longitude:"", 
        maintaintorList:[],
        principalsId:"",
        principalsTel:"",
        regionScopedata:[]
      },
      areaviewData:{},     
    }
  },   
  watch:{
    area:{
      handler (val) {
          this.$webapi.save('addItem',JSON.stringify(val))
      },
      deep:true
    },
    regionScope:{
      handler (val) {           
          this.area.regionScopedata = this.geshiDataList(val)
          this.$webapi.save('addItem',JSON.stringify(this.area))
      },
      deep:true
    }
  },
  mounted (){
    let _this = this; 
    let areaData = this.$webapi.get('addItem')    
    if(areaData){  
     var data = JSON.parse(areaData)         
       this.area = data  
    }      
    this.show = true  
    this.$vm.$on("mapCenter",e=>{      
      _this.area.latitude = e.lat;
      _this.area.longitude = e.lng;
    })
    this.area.regionScopedata = this.geshiDataList(_this.regionScope)
  },
  methods:{
     geshiDataList (res) {
      var reset = []
      if(res && res.length>0){
        if(res[0] && res[0].length>0){
          if(res[0][0]==null && res[0][1]==null){
            reset = []
          }else{
            reset = res 
          }         
        }else{
          reset = res.map(item=>{
            return [item.lng,item.lat]
          })          
        }
      }
       return reset
    },
    AddMap () {

    },
    emitClosearea () {
      this.emitClose(false)
    },
    emitClose (e) {
      this.resetItem()   
      this.$emit("emitarea",e)
    },
    emitmaintainer (e) {   
      this.area.principalsTel = e.mobileNo
      this.area.principalsId = e.id
    },
    resetItemS (e) {
       var reset = [];       
       if(e&&e.length>0){
         e.forEach((a)=>{
            console.log(111)
          if(reset.length>0){
           var idx = 0          
            reset.forEach((b)=>{
              if(a.id == b.id){
                idx = 1
              }
            })
            if(idx == 0){
              reset.push(a)
            }
          }else{
            reset.push(a)
          }
         })
       }         
       return reset    
    },
    emitmaintainerList (e) {   
       this.area.maintaintorList = this.resetItemS(e)
    },
    addMain(){
      this.area.maintaintorList.push({
        userTel:"",
        userInfoId:""
      })
    },
    Addarea (Newdata) {          
      let _this = this;
      let reg = /^[0-9]*$/; 
      if(!this.area.districtName){
         this.$Message.info("片区名称没有填写")
            return
      }
      if(!this.area.districtNo){
         this.$Message.info("片区编号没有填写")
         return
      }
      if(this.area.districtName.length>30){
        this.$Message.info("片区名称长度不能超过30字符")
        return
      }     
      if(this.area.districtNo.length>16){
         this.$Message.info("片区编号不能超过16个字符")
         return
      }
      if(!reg.test(this.area.districtNo)){
          this.$Message.info("片区编号不是数字类型")
         return
      }
      if(!this.area.principalsId){
          this.$Message.info("片区负责人没有选择")
          return
      }
      if(this.area.maintaintorList.length<1){
        this.$Message.info("维护人员没有添加")
          return
      } 
      let reset = this.area.maintaintorList.filter(item=>item.userInfoId=="")
          if(reset.length>0){
            this.$Message.info("维护人员的没有填写完成")
            return
          }
      if(!this.area.latitude || !this.area.longitude){
        this.$Message.info("片区中心点没有选择")
        return
      }   
      let NewdataList =  Newdata.map((item)=>{
        return [item.lng,item.lat]
      })      
      let mdata = this.area.maintaintorList.map((item)=>{
        return item.id
      })
      let latitude = this.area.latitude?parseInt((this.area.latitude)*1000000):0
      let longitude =this.area.longitude?parseInt((this.area.longitude)*1000000):0
      let data = {
          data:JSON.stringify({
            token:this.$webapi.get("token"),
            districtName:this.area.districtName,
            districtNo:this.area.districtNo,
            latitude:""+latitude,
            longitude:""+longitude,
            maintaintorIds:mdata,
            principalsId:this.area.principalsId,            
            regionScope:JSON.stringify(_this.geshiDataList(Newdata)),
          })
      }
      this.$api.post("/district/save",data,reset=>{
        if(reset.codeId==1){
           _this.$Message.info("片区添加成功")                
           _this.emitClose(true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    resetItem () {
      this.$webapi.removeItem("addItem")
      this.$webapi.removeItem("areaType")
      this.$webapi.removeItem("emitData")
    },
    areaSave () {   
        let _this = this;            
        let regionScope = _this.geshiDataList(_this.area.regionScopedata)
        if(regionScope && regionScope.length<1){
          this.$Message.info("【当前你还没有绘画片区,请你绘画片区】")
          return
        }  
        this.compute(regionScope,reset=>{
          if(!reset){            
            let data = regionScope  
            _this.Addarea(data)
          }else{             
            var str = "" + reset.Uh.extData.districtName;
            _this.$Message.info("当前片区和【"+str+"】片区之间有重叠,请调整")
          }
        })   
    },
    compute(data,callback,e){
      let _this = this;
      // data 是当前传过来的片区
      var polygon1_path = data;
      var flag = false; 
      this.AllPolygon.forEach((a, index) => {  
          if(a.Uh.extData.id!=_this.districtItem.id){
              var polygon2_path = a.getPath();
            if(polygon2_path.length>0){
              // 小圈是否在大圈内
              var isRingInRing = AMap.GeometryUtil.isRingInRing(polygon2_path,polygon1_path);
              // 两圈是否交叉
              var doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon2_path,polygon1_path);
              var ringRingClip = AMap.GeometryUtil.ringRingClip(polygon2_path,polygon1_path);
              var ringArea = parseInt(AMap.GeometryUtil.ringArea(ringRingClip))                  
              var text = '两圈关系：在大圈外';
              if(isRingInRing){
                  flag = a
                  text = '两圈关系：在大圈内';
              }else if(doesRingRingIntersect){
                  flag = a
                  text = '两圈关系：两圈相交, 交叉区域面积为'+ringArea+'平方米';
              } 
            }              
          }           
    });      
     setTimeout(()=>{
       callback(flag)
     },200)
    },
    delItem (e) {     
      this.area.maintaintorList.splice(e,1)
    },  
  }
}
</script>
<style lang="less" scoped>
   .areaCententfix{
       position: relative;
       min-height: 300px;
    }
   .areaTitle{     
     position: relative;  
     padding: 10px 0; 
     font-size: 16px;  
     span{
       width: 2px;       
       background: #007AFF;
       float: left;
       padding: 10px 0;
       margin-right: 10px;
     }
   }
  .areaBox{
    position: absolute;
    left:0px;
    top:50px;
    background: #fff;
    width: 300px;
    min-height: 50vh;
    padding: 20px;
  }
  .maintainerListtext{
    display: block;
    overflow: hidden;
    height: 25px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 150px;
    margin-top: 10px;
  }
</style>