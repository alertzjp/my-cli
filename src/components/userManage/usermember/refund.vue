<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
               <FormItem label="会员名">
                 {{formValidate.riderName}}
               </FormItem>
              <FormItem label="退款金额" required  prop="amount">
                   <Input v-model="formValidate.amount" placeholder="退款金额" />
              </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">退款</Button>
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
export default {
  name: "",
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
    const validaterentCharge = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('退款金额不能为空'));
        } else if (!/^[0-9]+(.[0-9]{0,2})?$/.test(value)) {
            callback('退款金额格式不正确');
        } else {
            callback();
        }
   };
    return {
      title:"退款金额",
      show:false,
      loading:false,
      formValidate:{
        refundnum:"",
        id:'',
        riderName:""
       },
       ruleValidate:{
         amount: [
             { validator: validaterentCharge, trigger: 'blur' }
         ]
       }
    }
  },
  mounted() {
    this.formValidate.id = this.propsid||"";   
    this.formValidate.riderName = this.selectitem.name
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
        // if(!this.formValidate.refundnum){
        //    this.$Message.warning('退款金额没有填写');
        //    return;
        // }
        // if(!(/(^[1-9]\d*$)/.test(this.formValidate.refundnum))){
        //    this.$Message.warning('退款金额是正整数');
        //    return;
        // }

      },
      addrolepost () {
        let _this = this
        let data = {
              token:this.$webapi.get('token'),
              id:this.formValidate.id,
              amount:this.formValidate.amount,
        }
        _this.loading = true
        this.$api.post('/rider/balance_refund',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.success('退款成功');
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
