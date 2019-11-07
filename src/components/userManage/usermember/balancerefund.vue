<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">余额退款</div>
        <Form :label-width="100" ref="formCustom" :model="formCustom" :rules="ruleValidate">
          <FormItem label="帐号">
              {{formCustom.loginAccount}}
          </FormItem>
          <FormItem label="退款金额"  required  prop="amount">
             <Input type="text" v-model="formCustom.amount"></Input>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default"  @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" :loading="loading" style="margin-left: 8px" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  name: "",
  props: {
    selectitem:{
      default () {
        return {}
      }
    }
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
      show:true,
      formCustom:{
        id:"",
        amount:"",
        loginAccount:""
      },
      ruleValidate:{
        amount: [
            { validator: validaterentCharge, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.id = this.selectitem.id
    this.formCustom.loginAccount = this.selectitem.loginAccount
    this.formCustom.rentCharge = this.selectitem.rentCharge
  },
  methods: {
    startTime (e) {
        this.formCustom.returnTime = e
    },
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
             _this.post()
          }
      })
    },
    post () {
      alert(this.formCustom.amount)
      let listdata = {
        token:this.$webapi.get('token'),
        amount:this.formCustom.amount,
        id:""+this.formCustom.id
      }
      let _this =  this
      this.loading = true
      this.$api.post('/rider/balance_refund',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.pass()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    pass () {
      this.$emit("emitendcomponent")
    },
    cancel() {
      this.$emit("emitendcomponent")
    }
  }
}
</script>
<style lang="less" scoped>
</style>
