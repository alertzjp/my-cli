<template>
  <div id="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           【{{siteitem.docksiteName}}({{siteitem.docksiteNo}})】统计标签数量
       </p>
       <div>
         <div style="height:250px; position: relative;width:100%">
            <Spin size="large" fix v-if="tipshow"></Spin>
            <div v-if="!tipshow&&data!=null">
              <Form ref="formCustom" :label-width="140">
                  <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                       <FormItem label="系统运营站点总车辆数" >
                         {{data.beforeBikeNum}}辆
                       </FormItem>
                    </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12" >
                         <FormItem label="统计运营站点总车辆数">
                           {{data.bikeNum}}辆
                         </FormItem>
                      </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                         <FormItem label="系统公共自行车">
                           {{data.beforePublicBicycleNum}}辆
                         </FormItem>
                      </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                         <FormItem label="统计公共自行车">
                           {{data.publicBicycleNum}}辆
                         </FormItem>
                      </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                         <FormItem label="系统共享单车">
                           {{data.beforeSharedBikeNum}}辆
                         </FormItem>
                      </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                         <FormItem label="统计共享单车" >
                           {{data.sharedBikeNum}}辆
                         </FormItem>
                      </Col>
                  </Row>
              </Form>
            </div>
            <div class="widthimgbox" v-else>
              暂无数据
            </div>
         </div>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    siteitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data:{},
      tipshow:true,
      show:true
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list () {
      let listdata = {
            token:this.$webapi.get('token'),
            siteId:this.siteitem.id
      }
      var _this =  this
      this.$api.get('/site/check_bike/getBySiteId',listdata,reset => {
        if (reset.codeId === 1) {
          _this.data = reset.resData
          _this.tipshow = false
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    cancel() {
      this.$emit("bysiteEmit")
    }
  }
}
</script>
<style lang="less" >
    .loader {
      width: 30px;
      height: 30px;
      position: relative;
      margin: 0 auto;
    }
   .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
