<template>
  <div class="">
    <Modal v-model="show" width="700" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>调用第三方车辆</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom" :label-width="100">
               <Row>
                 <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <FormItem label="站点名称">
                      {{formCustom.name}}
                    </FormItem>
                 </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <FormItem label="单车入驻企业">
                        <diaoyongcar-component @EmitComponent="EmitComponent" :id="formCustom.siteID" v-if="formCustom.siteID"></diaoyongcar-component>
                     </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="8">
                     <FormItem label="车辆数">
                       <InputNumber :min="0" v-model="formCustom.bikeNum"></InputNumber>
                     </FormItem>
                   </Col>
               </Row>
           </Form>
         </div>
       </div>
       <div slot="footer">
         <Button type="primary" @click="handleSubmit()" >保存</Button>
         <Button type="error" @click="handleError()" >取消</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import diaoyongcarComponent from '../../pub/diaoyongcar.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent,
    diaoyongcarComponent
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
      formCustom:{
        id:"",
        siteID:"",
        bikeNum:''
      },
      show:true,
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.siteID  = this.selectItem.id
    this.formCustom.name  = this.selectItem.docksiteName
  },
  methods: {
    handleError () {
      this.cancel()
    },
    handleSubmit (){
      this.list()
    },
    cancel () {
      this.$emit("bikeSitecomponent",false)
    },
    EmitComponent (e) {
      this.formCustom.id = e.id
      this.formCustom.bikeNum = e.bikeNum
    },
    list () {
      if(this.formCustom.bikeNum<0){
        this.$Message.info("车辆数不能为空")
        return
      }
      if(this.formCustom.id==""){
        this.$Message.info("入驻企业没有选择")
        return
      }
      let listdata = {
        data:JSON.stringify({
          id:""+this.formCustom.id,
          bikeNum:""+this.formCustom.bikeNum,
          token:this.$webapi.get("token"),
        })
      }
      let _this = this;
      this.$api.post('/bicycledocksite/update_bikeNum',listdata,reset => {
        if (reset.codeId == 1) {
          _this.$emit("bikeSitecomponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
