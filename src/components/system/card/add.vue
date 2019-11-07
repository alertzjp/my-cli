<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="维护卡号:" prop="cardNo" required>
                   <Input v-model="formValidate.cardNo" placeholder="维护卡号" />
              </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="error" @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
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
  components: {
  },
  data () {
    const validatecardNo = (rule, value, callback) => {
      if (isNaN(Number(value))) {
            callback('维护卡号格式不对,只能是数字');
        } else {
            callback();
        }
   };
    return {
      title:"新增维修卡号",
      show:true,
      loading:false,
      formValidate:{
        cardNo:"",
       },
      ruleValidate: {
           cardNo: [
             { required: true, message: '维护卡号没有填写', trigger: 'blur' },
             { type: 'string', min:1,max:10,  message: '维护卡号最长10位最小1位',trigger: 'blur' },
             { validator: validatecardNo, trigger: 'blur' }
           ],
       }
    }
  },
  mounted() {
    //do something after mounting vue instance

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
      addrolepost () {
        let _this = this
        let data = {
            data:{
              token:this.$webapi.get('token'),
              cardNo:this.formValidate.cardNo
             }
        }
        data.data = JSON.stringify(data.data)
        _this.loading = true
        this.$api.post('/maintain/cardadd',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.success('新增成功');
            _this.cancel()
          }else{
            _this.$netcode.getApiCode(reset)
          }
        })
      },
      handleReset (name) {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
</style>
