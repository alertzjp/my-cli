<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>更改服务器地址</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formCustom" :model="formCustom"  :rules="ruleValidate"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="服务器地址:" prop="address">
                      <Input v-model="formCustom.address" placeholder="服务器地址"  />
                      <p>例子:255.255.255.255</p>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="服务器端口:" prop="port">
                      <Input v-model="formCustom.port" placeholder="服务器端口"  />
                      <p>例子:*.*.*.*:8080 8080就是端口</p>
                   </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
         <Button type="error" @click="cancel">取消</Button>
         <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    itemdata:{
      default () {
        return {}
      }
    }
  },
  data () {
    let IPREG = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
    const addressPass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('服务器地址没有填写'));
        } else {
            if(!IPREG.test(value)){
                callback(new Error('服务器地址格式不对'));
                return
            }
            callback();
        }
    }
    return {
      unlockHandleBarType:'1',
      show:false,
      formCustom:{
        id:"",
        address:"",
        port:""
      },
      ruleValidate: {
            address: [
              { validator: addressPass, trigger: 'blur' }
            ],
            port: [
              { required: true, message: '服务器端口没有填写', trigger: 'blur' },
              { type: 'string', min: 1,max: 6, message: '服务器端口1-6位字符', trigger: 'blur' }
            ],
        }
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.id = this.itemdata.lockId
      this.show = true
  },
  methods: {
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
            _this.ok()
          }
      })
     },
    ok() {
      let _this = this
      let data = {
          token:this.$webapi.get("token"),
          address:this.formCustom.address,
          lockId:this.formCustom.id,
          port:this.formCustom.port
      }
      this.$api.post('/bicycle/order/updateServerAddress',data,reset => {
          if (reset.codeId === 1) {
              _this.$emit("lockemitcomponent",true)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
