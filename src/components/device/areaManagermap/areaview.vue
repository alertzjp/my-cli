<template>
  <div class="areaBox viewForm">
     <div class="areaTitle">
       <span></span> {{type==1?"片区建立":type==2?"片区编辑":"片区详情"}}
       <!-- {{areaviewData}} -->
     </div>
     <div class="areaCentent" v-if="show">       
        <Form :model="area" :label-width="90">
          <Row>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区名称:">
                    <div v-if="type==3">{{areaviewData.districtName}}</div>
                    <div v-else><Input v-model="area.districtName"  placeholder="片区名称"></Input></div>                    
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区编号:">                    
                    <div v-if="type==3">{{areaviewData.districtNo}}</div>
                    <div v-else><Input v-model="area.districtNo"  placeholder="片区编号"></Input></div> 
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24" v-if="type!=3">
                <FormItem label="片区中心点:">
                     <Button type="Default" size="large" long @click="AddMap">请在地图片区上点</Button>
                 </FormItem>
              </Col>          
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="片区负责人:">
                    <div>{{areaviewData.principalsName}}</div>                    
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <FormItem label="联系方式:">
                    <div >{{areaviewData.principalsTel}}</div>                
                </FormItem>
              </Col>             
               <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24" v-for="item in areaviewData.maintaintorList" v-if="type==3">
                <Row>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                      <FormItem label="片区分维护人:" >
                         {{item.maintaintorName}}
                      </FormItem>
                    </Col>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                        <FormItem label="联系方式" >
                          {{item.maintaintorTel}}
                        </FormItem>
                    </Col>  
                </Row>            
              </Col> 
            
              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24" v-if="type==3">
              <div class="areaTitle">
                  <span></span> 片区车辆
                  <!-- {{areaviewData}} -->
                </div>
                  <Row>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                      <FormItem label="片区总车辆:" >
                         {{areaviewData.bicycleTotalNum}}
                      </FormItem>
                    </Col>
                    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                        <FormItem label="共享单车：" >
                          {{areaviewData.shareBicyclelNum}}
                        </FormItem>
                    </Col>
                     <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                      <FormItem label="公共自行车:" >
                         {{areaviewData.bicyclelNum}}
                      </FormItem>
                    </Col>
                    <!-- <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                        <FormItem label="助力车：" >
                          {{areaviewData.mopedNum}}
                        </FormItem>
                    </Col>   -->
                </Row>      
              </Col> 

              <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">             
                <div style="margin-top:10px">         
                  <!-- <Button type="primary" size="large" style="margin-top:10px" long @click="saveClick" v-if="saveshow">编辑</Button>
                  <Button size="error" style="margin-top:10px" long @click="delClick">删除</Button>     -->
                  <Button type="error" size="large" style="margin-top:10px" long @click="emitClose">关闭</Button>                   
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
export default {
  name:"",   
  computed: {
    saveshow () {
      return this.districtItem.regionScope && this.districtItem.regionScope.length>0
    }
  },
  props:{
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
      areaviewData:{},     
    }
  },
  watch:{
    districtItem:{
      handler(val,oldval){        
        this.getview(val.id)
      },
      deep:true
    }
  },
   beforeDestroy() {
    this.$vm.$off("seleteView")
  },
  mounted (){
    console.log(this.districtItem)
    let _this = this;
        this.show = false
        this.getview(this.districtItem.id)            
  },
  methods:{
    AddMap () {

    },
    delClick () {
      this.$emit("delsavedraw",this.areaviewData) 
    },
    saveClick () {
      this.$emit("emitsavedraw",this.districtItem.id)
    },
    emitClose () {
      this.$emit('emitClosearea',false)
    },
    emitmaintainer (e) {     
      console.log(111)    
      this.area.principalsTel = e.mobile
      this.area.principalsId = e.userInfoId
    },
    emitmaintainerList (e,item) {   
     
      let userInfoId = e.userInfoId
      let reset = this.area.maintaintorList.filter(newitem=>newitem.userInfoId==userInfoId)    
      if(reset.length>0){
        this.$Message.info("【"+item.name+"】已存在，重新选择")
        return
      }      
      item.userTel = e.mobile
      item.userInfoId = e.userInfoId
    },
    addMain(){
      this.area.maintaintorList.push({
        userTel:"",
        userInfoId:""
      })
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
             _this.area = reset.resData;
           }else{
             _this.areaviewData = reset.resData; 
           }           
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
    min-height: 50vh;
    padding: 20px;
  }
</style>