<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>【{{formCustom.docksiteName}}({{formCustom.docksiteNo}})】获取标签数量</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Row>
             <div style="min-height:100px; position: relative;width:100%">
                <Spin size="large" fix v-if="tipshow && !resetshow"></Spin>
                <div v-if="!tipshow&&data!=null">
                  <Form ref="formCustom" :label-width="140">
                      <Row>
                        <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                           <FormItem label="站点总车辆数" >
                             {{data.beforeBikeNum}}辆
                           </FormItem>
                        </Col>
                          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12" >
                             <FormItem label="统计总车辆数">
                               {{data.bikeNum}}辆
                             </FormItem>
                          </Col>
                          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                             <FormItem label="站点公共自行车">
                               {{data.beforePublicBicycleNum}}辆
                             </FormItem>
                          </Col>
                          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                             <FormItem label="统计公共自行车">
                               {{data.publicBicycleNum}}辆
                             </FormItem>
                          </Col>
                          <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" :xxl="12">
                             <FormItem label="站点共享单车">
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
              <div class="" v-if="resetshow" style="text-align:center">
                <Button type="primary" @click="resetclick">重新获取</Button>
              </div>
           </Row>
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
  components: {
  },
  props:{
    selectItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{},
      data:[],
      resetshow:false,
      loading:false,
      tipshow:true,
      show:true,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom = this.selectItem
    this.list()
  },
  methods: {
    resetclick () {
      this.resetshow = false
      this.list()
    },
    handleSubmit () {
      this.loading = true
      this.list()
    },
    cancel () {
      this.$emit("EMITBIAOQIAN")
    },
    districtEmitComponent (e) {
      this.district.bikeDockSiteId = e.id
    },
    list () {
      let listdata = {
        equipmentNo:this.formCustom.equipmentNo,
        token:this.$webapi.get("token")
      }
      let _this = this;
      this.$api.post('/site/order/statistics_tag',listdata,reset => {
        _this.loading = false
        if (reset.codeId == 1) {
          _this.data = reset.resData
          _this.tipshow = false
        }else{
          _this.$netcode.getApiCode(reset)
          _this.tipshow = true
          _this.resetshow = true
        }
      },failure=>{
        _this.loading = false
        _this.tipshow = true
        _this.resetshow = true
      })
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
