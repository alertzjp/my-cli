<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>手工还车</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="锁的时间:" prop="overTime">
                     <InputNumber :min="0" v-model="formCustom.overTime"></InputNumber>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="铃声几声:" prop="beepCount">
                     <InputNumber :min="0" v-model="formCustom.beepCount"></InputNumber>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="站点名称:" prop="purchase_order_no">
                     <site-component @EmitDocksiteComponent="EmitDocksiteComponent" status="1"></site-component>
                   </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
         <Button type="error" @click="cancel">取消</Button>
         <Button type="primary" @click="ok">保存</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    siteComponent
  },
  props:{
    itemdata:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:true,
      formCustom:{
        lockId:"",
        overTime:'0',
        beepCount:'0',
        dockditeNo:"",
        type:1
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.lockId = this.itemdata.lockId
  },
  watch:{
    itemdata:{
      handler(val,oldval){
        this.formCustom = val
      },
      deep:true
    }
  },
  methods: {
    EmitDocksiteComponent (e) {
      this.formCustom.dockditeNo = e.docksiteNo
    },
    ok() {
      let _this = this
      let  data = {
        token:this.$webapi.get("token"),
        lockId:this.formCustom.lockId,
        overTime:this.formCustom.overTime,
        beepCount:this.formCustom.beepCount,
        dockditeNo:''+this.formCustom.dockditeNo
      }
      this.$api.post('/bicycle/order/setAccessStatusAndRinging',data,reset => {
          if (reset.codeId === 1) {
              _this.$Message.success('发送成功');
              _this.$emit("lockemitcomponent",this.formCustom)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",this.formCustom)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
