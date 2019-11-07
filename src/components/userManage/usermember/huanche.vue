<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>手工还车</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
              <FormItem label="锁的时间">
                 <InputNumber :min="0" v-model="formValidate.overTime"></InputNumber>
                 <!-- <div class="mt10">
                    <Alert type="error">0不能锁车，1可以锁车，>1 可以锁车超时时间</Alert>
                 </div> -->
              </FormItem>
              <FormItem label="铃声几声" prop="callMobile">
                   <InputNumber :min="0" v-model="formValidate.beepCount"></InputNumber>
              </FormItem>
              <FormItem label="站点名称">
                   <site-component @EmitDocksiteComponent="EmitDocksiteComponent"></site-component>
                   <!-- <div class="" v-if="formValidate.type==2">
                      <Alert type="error">二代站点不能操作</Alert>
                   </div> -->
              </FormItem>
            <FormItem>
                <Button type="error" @click="handleReset()" style="margin-left: 8px">取消</Button>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
            </FormItem>
        </Form>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import timeComponent from "../../pub/timeonecomponent.vue"
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    timeComponent,
    siteComponent
  },
  props:{
    refundshow:{
      default:false
    },
    selectitem:{
      default () {
        return {}
      }
    },
    propsid:''
  },
  data () {
    return {
      title:"退款金额",
      show:false,
      loading:false,
      formValidate:{
        id:"",
        lockId:"",
        overTime:'0',
        beepCount:'0',
        dockditeNo:"",
        type:"1"
       },
       ruleValidate:{
       }
    }
  },
  mounted() {
    this.formValidate.lockId = this.selectitem.lockId
    this.formValidate.callMobile = this.selectitem.mobileNo
    this.show = true
  },
  watch:{
    refundshow:{
      handler (val,oldval) {
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
      cancel () {
        this.$emit("emitcomponent")
      },
      handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
            if (valid) {
               _this.addrolepost()
            }
        })

      },
      emitfault (e) {
        this.formValidate.fault_type = e.name
      },
      EmitDocksiteComponent (e) {
        this.formValidate.type = e.type
        this.formValidate.dockSiteNo =e.docksiteNo
      },
      addrolepost () {
        let _this = this
        let data = {
            token:this.$webapi.get('token'),
            lockId:this.formValidate.lockId,
            overTime:this.formValidate.overTime,
            beepCount:this.formValidate.beepCount,
            dockditeNo:this.formValidate.dockSiteNo,
         }
        _this.loading = true
        this.$api.post('/bicycle/order/setAccessStatusAndRinging',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.success('还车成功');
            _this.cancel()
          }else{
            _this.$netcode.getApiCode(reset)
          }
        })
      },
      handleReset () {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
</style>
