<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名:" prop="name" required class="none">
                   <Input v-model="formValidate.name" placeholder="姓名"/>
              </FormItem>
              <FormItem label="性别:" prop="sex" class="none">
                <RadioGroup v-model="formValidate.sex" type="button">
                  <Radio label="1">男</Radio>
                  <Radio label="2">女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="手机号码:" prop="mobileNo" required>
                   <Input v-model="formValidate.mobileNo" placeholder="手机号码" />
              </FormItem>
              <FormItem label="身份证号:" prop="idCard" required class="none">
                   <Input v-model="formValidate.idCard" placeholder="身份证号" />
              </FormItem>
              <FormItem label="密码:" >
                <div class="" v-if="formValidate.passwordshow">
                  <Input type="text" v-model="formValidate.password" placeholder="请输入密码"   size="large" icon="md-eye" autocomplete="off" @on-click="password01()"></Input>
                </div>
                <div class="" v-else>
                  <Input type="password" v-model="formValidate.password" placeholder="请输入密码"  size="large" icon="md-eye-off" autocomplete="off" @on-click="password01()"></Input>
                </div>
                </FormItem>
              <FormItem label="确认密码:">
                <div class="" v-if="formValidate.passwordsshow">
                  <Input type="text" v-model="formValidate.passwords" placeholder="请输入密码"   size="large" icon="md-eye" autocomplete="off" @on-click="password()"></Input>
                </div>
                <div class="" v-else>
                  <Input type="password" v-model="formValidate.passwords" placeholder="请输入密码"  size="large" icon="md-eye-off" autocomplete="off" @on-click="password()"></Input>
                </div>
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
  props:{
    selectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    const validatePhone = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('手机号不能为空'));
        } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
            callback('手机号格式不正确');
        } else {
            callback();
        }
   };
   const validateIDcard = (rule, value, callback) => {
     let reg = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
       if (!value) {
           return callback(new Error('身份证不能为空'));
       } else if (!reg.test(value)) {
           return callback('身份证格式不正确');
       } else {
           callback();
       }
  };
  const validatePass = (rule, value, callback) => {
       if (value === '') {
           callback(new Error('密码没有填写'));
       } else {
           callback();
       }
   };
   const validatePassCheck = (rule, value, callback) => {
       if (value === '') {
           callback(new Error('确认密码没有填写'));
       } else if (value !== this.formValidate.password) {
           callback(new Error('密码不一致'));
       } else {
           callback();
       }
   };
    return {
      title:"修改维修人员",
      show:true,
      loading:false,
      formValidate:{
        passwordshow:false,
        passwordsshow:false,
        loginAccount:"",
        password:"",
        districtId:"",
        sex:"1",
        name:"",
        idCard:"",
        mobileNo:"",
        passwords:""
       },
      ruleValidate: {
           name: [
             { required: true, message: '姓名没有填写', trigger: 'blur' },
             { type: 'string', min:1,max:50, trigger: 'blur' }
           ],
           idCard: [
              { validator: validateIDcard, trigger: 'blur' }
           ],
           mobileNo: [
             { validator: validatePhone, trigger: 'blur' }
           ]
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formValidate.loginAccount = this.selectitem.loginAccount || ""
    this.formValidate.name = this.selectitem.name || ""
    this.formValidate.idCard = this.selectitem.idCard || ""
    this.formValidate.mobileNo = this.selectitem.mobileNo || ""
    this.formValidate.sex = this.selectitem.sex || ""
    this.formValidate.id = this.selectitem.id || ""
  },
  methods: {
      password01 () {
        this.formValidate.passwordshow = !this.formValidate.passwordshow
      },
      password () {
          this.formValidate.passwordsshow = !this.formValidate.passwordsshow
      },
      EmitoperatorComponent (e) {
         this.formValidate.mechanismId = e.id
      },
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
        // let data = {
        //     data:{
        //       id:this.formValidate.id,
        //       token:this.$webapi.get('token'),
        //       loginAccount:this.formValidate.mobileNo,
        //       name:this.formValidate.name,
        //       sex:this.formValidate.sex,
        //       idCard:this.formValidate.idCard,
        //       mobileNo:this.formValidate.mobileNo,
        //      }
        // }
        let listdata={
            data:{
              id:this.formValidate.id,
              token:this.$webapi.get('token'),
              districtId:"",
              mobileNo:this.formValidate.mobileNo
            }
        }
        if(this.formValidate.password!=""){
          if(this.formValidate.password==this.formValidate.passwords){
            if(this.formValidate.password.length>=4 && this.formValidate.password.length<=12){
                  listdata.data.loginPassword = this.formValidate.password
            }else{
              this.$Message.info("密码字符不能小于4个字符大于12个字符")
              return
            }
          }else{
              this.$Message.info("密码不一致")
              return
          }
        }
        listdata.data = JSON.stringify(listdata.data)
        _this.loading = true
        this.$api.post('/maintain/maintainerUpdate',listdata,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.info('已修改');
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
