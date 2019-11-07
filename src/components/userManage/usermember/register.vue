<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>登记报障</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
              <FormItem label="来电时间">
                  <time-component :timevale="1" @timeEmit="timeEmit"></time-component>
              </FormItem>
              <FormItem label="来电用户" prop="callMobile">
                   <Input v-model="formValidate.callMobile" placeholder="来电用户" />
              </FormItem>
              <FormItem label="报障类型">
                   <faulttype-component @emitfault="emitfault"></faulttype-component>
              </FormItem>
              <FormItem label="问题描述">
                <Input v-model="formValidate.fault_content" type="textarea" placeholder="问题描述" />
              </FormItem>
              <FormItem label="客服记录" prop="detail">
                   <Input v-model="formValidate.detail" type="textarea" placeholder="客服记录" />
              </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="error" @click="handleReset()" style="margin-left: 8px">取消</Button>
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
import faulttypeComponent from "../../pub/faultTypecomponent.vue"
export default {
  name: "",
  components: {
    timeComponent,
    faulttypeComponent
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
        createdTime:"",
        rentId:'',
        fault_type:"",
        fault_content:"",
        detail:"",
        callMobile:""
       },
       ruleValidate:{
         detail: [
              { required: true, message: '客服记录没有填写', trigger: 'blur' },
              { type: 'string', min:1,max:100, message: '客服记录1-100个字符', trigger: 'blur' }
           ],
           callMobile: [
                { required: true, message: '来电用户没有填写', trigger: 'blur' },
                { type: 'string', min:6,max:12, message: '来电用户6-12个字符', trigger: 'blur' }
          ]
       }
    }
  },
  mounted() {
    this.formValidate.rentId = this.selectitem.id
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
      timeEmit (e) {
        this.formValidate.createdTime = e
      },
      addrolepost () {
        let _this = this
        let data = {
           data:JSON.stringify({
             token:this.$webapi.get('token'),
             rentId:this.formValidate.rentId,
             fault_type:this.formValidate.fault_type,
             createdTime:this.formValidate.createdTime==""?this.$webapi.gettime('time',new Date().getTime()/1000):this.formValidate.createdTime,
             fault_content:this.formValidate.fault_content,
             detail:this.formValidate.detail,
             callMobile:this.formValidate.callMobile
           })
         }
        _this.loading = true
        this.$api.post('/customerBicycle/addlightalk_rent',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.success('登记成功');
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
