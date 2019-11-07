<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">月报表导出</div>
      <div class="tableListForm">
        <Form ref="formCustom" :model="formCustom" :label-width="90">
            <Row>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <FormItem label="站点名称">
                     <site-component @EmitDocksiteComponent="outSiteName"></site-component>
                   </FormItem>
                </Col>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <FormItem label="导出时间">
                    <time-component type="month" @timeEmit="timeEmit"></time-component>
                   </FormItem>
                </Col>
            </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit" style="margin-left: 8px" size="large">导出</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timeonecomponent.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent,
    siteComponent,
    timeComponent
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    selectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:false,
      loading:false,
      formCustom:{
        id:"",
        dockSiteNo:"",
        time:""
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
     }
  },
  mounted() {
    //do something after mounting vue instance
    this.show = true
   },
  methods: {
    handleSubmit () {
      if(this.formCustom.dockSiteNo==""){
        this.$Message.error("站点没有选择");
        return
      }
      if(this.formCustom.time==""){
        this.$Message.error("时间没有选择");
        return
      }
      let listdata = {
        token:this.$webapi.get('token'),
        dockSiteNo:this.formCustom.dockSiteNo,
        time:this.formCustom.time
     }
      let _this =  this
      this.$api.get('/statistic/export_all_docksite_mouth',listdata,reset => {
          if(reset.codeId==undefined || reset.codeId==null){
              window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/statistic/export_all_docksite_mouth',listdata)
          }else {
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    outSiteName (e) {
      this.formCustom.dockSiteNo = e.docksiteNo
    },
    timeEmit (e) {
      this.formCustom.time = e
    },
    cancel(e) {
      this.$emit("emitcomponent",e?true:false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
