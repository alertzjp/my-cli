<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
            <span>编辑帐号和密码</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="登录账号" prop="loginName">
                        <Input type="text" v-model="formCustom.loginName" placeholder="登录账号"></Input>
                      </FormItem>
                   </Col>
                </Row>
                <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="12">
                       <FormItem label="登录密码" prop="loginPassword">
                         <Input type="text" v-model="formCustom.loginPassword" placeholder="登录密码" ></Input>
                       </FormItem>
                    </Col>
                </Row>
                <Row>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem label="">
                           <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
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
import areaComponent from '../../pub/iviewarea.vue'
export default {
  name: "",
  components: {
    areaComponent
  },
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
          id:"",
          loginPassword:"",
          loginName:"",
      },
      area:[],
      data:{},
      show:false,
      loading:false,
      ruleValidate: {
         loginName: [
             { required: true, message: '登录账号没有填写', trigger: 'blur' }
         ],
         loginPassword: [
             { required: true, message: '登录密码没有填写', trigger: 'blur' }
         ]
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
     this.formCustom.id = this.setectitem.id
     this.list()
  },
  methods: {
    list () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        id:this.formCustom.id
      }
      let _this =  this
      this.$api.get('/bicycle_entering_company/getOne',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.formCustom.loginName = reset.resData.loginName
           _this.show = true
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    cancel () {
      this.$emit("EmitComponent",false)
    },
    EmitversionComponent (e) {
      this.formCustom.id = e.id
    },
    areaEmit (e) {
      this.formCustom.provinceCode = e[0].code
      this.formCustom.cityCode = e[1].code
      this.formCustom.areaCode = e[2].code
      this.formCustom.provinceName = e[0].name
      this.formCustom.cityName = e[1].name
      this.formCustom.areaName = e[2].name
    },
    handleSubmit (name) {
      let _this = this;
       this.$refs[name].validate((valid) => {
           if (valid) {
               _this.addpost()
           }
       })
     },
    addpost () {
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token"),
          loginName:this.formCustom.loginName,
          loginPassword:this.formCustom.loginPassword,
          id:this.formCustom.id
      }
      this.$api.post('/bicycle_entering_company/update/loginName_password',listdata,reset => {
        if (reset.codeId == 1) {
          _this.$emit("EmitComponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
