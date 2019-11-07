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
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24" v-if="type!=3">
                <FormItem label="片区中心点:">
                      {{area.longitude}} {{area.latitude}}                     
                     <div class="red">现编辑的片区上点击获取</div>
                </FormItem>
              </Col>          
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区负责人:">  
                    <div ><maintain-component @emitmaintainer="principals" :propsid="area.principalsId" :newItem="propsnewItem"></maintain-component></div>                     
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="联系方式:">                   
                    <div><Input v-model="area.principalsTel" disabled  placeholder="联系方式"></Input></div>     
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
                  <Button type="primary" size="large" long @click="areaSave">保存</Button>
                  <Button type="error" size="large" style="margin-top:10px" long @click="emitClosearea">取消</Button>                   
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
        let str =  "" +item.mobileNo
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
    emitIndex:{
      default () {
        return -1
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
      area:{},
      propsnewItem:[],
      propsnewItem01:[],
      areaviewData:{},     
    }
  },  
  watch:{
     area:{
      handler (val) {
          this.$webapi.save('emitData',JSON.stringify(val))
      },
      deep:true
    }   
  },
  mounted (){
    let _this = this;
    this.area = this.districtItem
    // this.show = true     
    this.getview(this.districtItem.id)    
    this.$vm.$on("mapCenter",e=>{      
      _this.area.latitude = e.lat;
      _this.area.longitude = e.lng;
    })
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
    emitClosearea () {
      this.emitClose()
    },    
    emitClose (e) {
      let _this = this;
      this.resetItem()   
      let Type = this.$route.query.type || 0
      if(Type!=0){
        this.$router.push({
            path:"/admin/device/areaManagermap/list"
        })    
        this.$router.push({
          path:"/admin/device/areaManager/list"
        })
      }else{
        this.$router.push({
            path:"/admin/device/areaManagermap/list"
          })    
        setTimeout(() => {
          _this.reload()
        }, 200);
      }      
    },
     resetItem () {
      this.$webapi.removeItem("addItem")
      this.$webapi.removeItem("areaType")
      this.$webapi.removeItem("emitData")
    },
    principals (e) {   
      this.area.principalsTel = e.mobileNo
      this.area.principalsId = e.id
    },
    emitmaintainerList (e) {         
      this.area.maintaintorList = e
    },
    addMain(){
      this.area.maintaintorList.push({
        maintaintorTel:"",
        maintaintorId:""
      })
    },   
    delItem (e) {     
      this.area.maintaintorList.splice(e,1)
    },
    areaSave () {
      // this.areaSaveupdate()    
         let _this = this; 
        let newItem = this.geshiDataList(this.districtItem.regionScope)
        
        this.compute(newItem,reset=>{
          if(!reset){            
            let data =  newItem
            _this.areaSaveupdate(data)
          }else{
            var str = "" + reset.Uh.extData.districtName;
            _this.$Message.info("当前片区和【"+str+"】片区之间有重叠,请调整")
          }
        })   
    },
    areaSaveupdate(e) {     
        let _this = this; 
        let reg = /^[0-9]*$/;         
        let reset = this.area.maintaintorList.filter(item=>item.userInfoId=="")
            if(reset.length>0){
              this.$Message.info("维护人员的没有填写完成")
              return
        }
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
        let maintaintorList = this.area.maintaintorList.map((item)=>{
          return {
              maintaintorTel:item.maintaintorTel,
              maintaintorId:item.maintaintorId
          }
        })
        if(!this.area.latitude || !this.area.longitude || this.area.longitude==0 || this.area.latitude==0){
          this.$Message.info("片区中心点没有选择")
          return
        }   
        let regionScope =  this.districtItem.regionScope.map((item)=>{
            return [item.lng,item.lat]
          })
        if(this.cursiteshow){
            this.$Message.info("片区有重复，请你调整")
            return
        }      
        
        let mdata = this.area.maintaintorList.map((item)=>{
          return item.id
        })
        let latitude = parseInt((this.area.latitude)*1000000) || 0
        let longitude = parseInt((this.area.longitude)*1000000) || 0
        if(e.length<2){
           this.$Message.info("片区的点数不能少2个点")
           return
        }
        let data = {
            data:JSON.stringify({
              id:""+this.area.id,
              token:this.$webapi.get("token"),
              districtName:this.area.districtName,
              districtNo:this.area.districtNo,
              latitude:""+latitude,
              longitude:""+longitude,
              maintaintorIds:mdata,
              principalsId:this.area.principalsId,
              principalsTel:this.area.principalsTel,
              regionScope:JSON.stringify(e),
            })
        } 
       this.$api.post("/district/update",data,reset=>{
        if(reset.codeId==1){
           _this.$Message.info("保存成功")  
           _this.emitClose()
        }else{
          _this.$Message.info(reset.codeDes)   
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
    getview(id){
      let _this = this;
      let data = {
        token:this.$webapi.get("token"),
        id:id
      }
      this.$api.get("/district/getOneOnMap",data,reset=>{
        if(reset.codeId==1){
           if(_this.type==2){   
             reset.resData.maintaintorList =  reset.resData.maintaintorList || []  
             reset.resData.maintaintorList = reset.resData.maintaintorList.map(item=>{
               return {
                 id:item.maintaintorId,
                 name:item.maintaintorName,
                 mobileNo:item.maintaintorTel,
                 show:true
               }
             })
             //console.log( reset.resData.maintaintorList)
             reset.resData.longitude = ((reset.resData.longitude)/1000000).toFixed(6) || 0
             reset.resData.latitude = ((reset.resData.latitude)/1000000).toFixed(6) || 0
            //  reset.resData.regionScope = (_this.districtItem.regionScope).length>0?_this.districtItem.regionScope:reset.resData.regionScope
            //  console.log(reset.resData)
             _this.area.maintaintorList = reset.resData.maintaintorList;
             _this.area.principalsId = reset.resData.principalsId;
             _this.area.principalsName = reset.resData.principalsName;
             _this.area.principalsTel = reset.resData.principalsTel;
             _this.area.principalsTel = reset.resData.principalsTel;              
           }else{
             _this.areaviewData = reset.resData;            
           }     
           _this.propsnewItem01 = reset.resData.maintaintorList.map(item=>{
             return {
                id:item.maintaintorId,
                name:item.maintaintorName,
                mobileNo:item.maintaintorTel,
             }
           })
            _this.propsnewItem = [{
                id:reset.resData.principalsId,
                name:reset.resData.principalsName,
                mobileNo:reset.resData.principalsTel,
            }] 
            _this.show = true         
        }
      }) 
    }
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
    height: calc(100vh - 170px);
    padding: 20px;
    overflow-y: auto;
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