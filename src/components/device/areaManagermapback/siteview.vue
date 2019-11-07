<template>
  <div class="sitebox" v-if="show">
     <div class="sitebox-hd">
          {{siteItemList.docksiteName?siteItemList.docksiteName:""}}
     </div>
     <div class="sitebox-bd">
          <div class="siteboxTitle">
            <span class="clumn"></span> <span>站点信息</span>
          </div>
     </div>
      <Form label-position="left" :label-width="100">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
              <FormItem label="站点名称:">
                  {{sitedata.docksiteName?sitedata.docksiteName:""}}
              </FormItem>
              <FormItem label="站点编号:">
                  {{sitedata.docksiteNo}}
              </FormItem>
            </Col>
          </Row>
      </Form>
      <div class="sitebox-bd">
          <div class="siteboxTitle">
            <span class="clumn"></span> <span>站点属性</span>
          </div>
     </div>
     <Form label-position="left" :label-width="100">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
              <FormItem label="站点状态:">
                 {{sitedata.status==1?"有效":sitedata.status==-1?"无效":""}}
              </FormItem>
              <FormItem label="站点类型:">
                  {{sitedata.siteType==1?"无桩站点":sitedata.siteType==2?"综合站点":""}}
              </FormItem>
              <FormItem label="设备类型:">
                {{sitedata.type==1?"一代站点":sitedata.type==2?"二代站点":""}}
              </FormItem>
              <FormItem label="低频号:">
                 {{sitedata.triggerNo}}
              </FormItem>             
            </Col>
          </Row>
      </Form>
      <div class="sitebox-bd">
          <div class="siteboxTitle">
            <span class="clumn"></span> <span>站点车辆</span>
          </div>
     </div>
     <Form label-position="left" :label-width="100">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
              <FormItem label="站点总车辆:">
                  {{sitedata.totalBikeNum?sitedata.totalBikeNum:0}}         
              </FormItem>
              <FormItem label="共享单车:">
                  {{(sitedata.totalBikeNum)-(sitedata.bikeNum)}}
              </FormItem>
              <FormItem label="公共自行车:">
                  {{sitedata.bikeNum?sitedata.bikeNum:0}}
              </FormItem>              
            </Col>
          </Row>
      </Form>
      <Button type="error" size="large" style="margin-top:10px" long @click="emitClose">关闭</Button>     
  </div>
</template>
<script>
export default {
  name:"",
  props:{
    siteItemList:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
        params:{},
        show:false,
        sitedata:{}
    };
  },
  watch:{
    siteItemList:{
      handler(val,oldval){
        if(val){
          this.params = val
          this.list()
        }
      },
      deep:true
    }
  },
  mounted () {
    this.params = this.siteItemList
    this.list()
  },
  methods:{
    emitClose () {
      this.$emit('emitSite')
    },
    list () {
      let _this = this;
      let data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          id:""+this.params.id
        })
      }
      this.show = false
      this.$api.get("/bicycledocksite/findOne",data,reset=>{
         if(reset.codeId==1){
           _this.sitedata = reset.resData || {}
           _this.show = true
         }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .sitebox{
    position: absolute;
    top:50px;
    right:10px;
    min-height: 100px;
    background: #fff;
    width: 260px;
    min-height: 50vh;
    padding: 20px 30px;
    .ivu-form-item{
      margin-bottom:0px;
    }
    .sitebox-hd{
      font-size: 18px
    }
   .sitebox-bd{
     .siteboxTitle{
        position: relative;
        padding: 10px 0;
        font-size: 16px;
        margin-bottom: 10px;
        overflow: hidden;
        span{
          float: left;
          height: 18px;
          line-height: 18px;
          font-size: 14px;
          font-weight: bold;
        }
        .clumn{
          width: 2px;
          background: #007AFF;
          float: left;
          padding: 5px 0;
          margin-right: 5px;
        }
     }
   }
  }
</style>
