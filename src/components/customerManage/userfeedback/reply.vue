<template>
  <div id="">
    <div class="">
      <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
         <p slot="header">
             <Icon type="information-circled"></Icon>
             <span>新增回复</span>
         </p>
         <div style="text-align:center">
           <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80">
             <Row>
               <Col  :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem label="回复内容" prop="reply">
                    <Input v-model="formItem.reply" type="textarea" placeholder="回复内容" />
                 </FormItem>
               </Col >
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <FormItem>
                     <Button type="primary" @click="handleSubmit('formItem')">保存</Button>
                    <!-- <Buttoncomponent title="保存"  @emitButton="handleSubmit('formItem')"></Buttoncomponent> -->
                 </FormItem>
               </Col>
             </Row>
           </Form>
         </div>
         <div slot="footer">
         </div>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    selectItem:{
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      title:'关联卡号',
      show:true,
      formItem:{
        feedbackId:'',
        reply:''
      },
      ruleInline:{
        reply: [
            { required: true, message: '回复内容没有填写', trigger: 'blur' },
            { type: 'string', min:1,max:200, message: '最小为1个字，最大200个字', trigger: 'blur' }
         ]
      },
      loading:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formItem.feedbackId = this.selectItem.id
  },
  methods: {
    handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
            if (valid) {
              _this.post()
            }
        })
    },
    cancel (e) {
      this.$emit("emitreplycomponent",e?true:false)
    },
    post () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        feedbackId:this.formItem.feedbackId,
        reply:this.formItem.reply
      }
      let _this =  this
      this.$api.post('/advice_reply/add',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },

  }
}
</script>
<style lang="less" scoped>
</style>
