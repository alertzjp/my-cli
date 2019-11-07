<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>新增车锁</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom"  :rules="ruleValidate" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁编号" prop="lockNo" >
                        <Input v-model="formCustom.lockNo" placeholder="车锁编号"  />
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁MAC">
                        <Input v-model="formCustom.lockMac" placeholder="车锁编号"  />
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="商户号">
                        <Input v-model="formCustom.merchantId" placeholder="车锁编号"  />
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="终端号">
                        <Input v-model="formCustom.termId" placeholder="车锁编号"  />
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                     <div class="">
                       <FormItem>
                          <Buttoncomponent title="保存"  icon="ios-search" @emitButton="handleSubmit('formCustom')"></Buttoncomponent>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
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
  props:{
    setectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{
        lockNo:'',
        lockMac:'',
        operatorId:'',
        merchantId:'',
        termId:''
      },
      show:true,
      ruleValidate: {
          lockNo: [
            { required: true, message: '车锁编号没有填写', trigger: 'blur' },
            { type: 'string', min: 2,max: 18, message: '车锁编号2-18位', trigger: 'blur' }
          ],
       }
     }
  },
  mounted() {
    //do something after mounting vue instance
  },
  methods: {
    cancel (e) {
      this.$emit("bikelockcomponent",e?true:false)
    },
    handleSubmit (name) {
      let _this = this
       this.$refs[name].validate((valid) => {
           if (valid) {
               _this.handlepost();
           }
       })
     },
    handlepost () {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            bicycleLock:{
                lockNo:this.formCustom.lockNo,
                lockMac:this.formCustom.lockMac,
                merchantId:this.formCustom.merchantId,
                termId:this.formCustom.termId
            },
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/bicyclelock/add',listdata,reset => {
        if (reset.codeId == 1) {
          _this.cancel(true)
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
