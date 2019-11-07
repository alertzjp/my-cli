<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>车锁详情</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom"  :rules="ruleValidate" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁编号" prop="lockNo" >
                        {{formCustom.lockNo}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁MAC">
                         {{formCustom.lockMac}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="商户号">
                        {{formCustom.merchantId}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="终端号">
                        {{formCustom.termId}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁类型">
                         {{formCustom.type==1?"旧锁":"新锁"}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁状态">
                         {{formCustom.type==1?"旧锁":"新锁"}}
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="车锁类型">
                         {{formCustom.status | changestatus}}
                       </FormItem>
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
    selectitem:{
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
      show:false,
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
    this.formCustom = this.selectitem
    this.show = true
  },
  methods: {
    cancel () {
      this.$emit("bikelockcomponent")
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
          _this.cancel()
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
