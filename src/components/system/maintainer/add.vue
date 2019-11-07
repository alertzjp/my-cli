<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="姓名:" prop="name" required>
                   <Input v-model="formValidate.name" placeholder="姓名" />
              </FormItem>
              <FormItem label="角色:" required>
                   <role-component flag = "3" @EmitroleComponent="EmitroleComponent"></role-component>
              </FormItem>              
              <FormItem label="性别:" prop="sex">
                <RadioGroup v-model="formValidate.sex" type="button">
                  <Radio label="1">男</Radio>
                  <Radio label="2">女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="手机号码:" prop="mobileNo" required>
                   <Input v-model="formValidate.mobileNo" placeholder="手机号码" />
              </FormItem>
              <FormItem label="身份证号:" prop="idCard" required>
                   <Input v-model="formValidate.idCard" placeholder="身份证号" />
              </FormItem>
              <FormItem label="密码:" prop="password" required>
                <Input type="text" v-model="formValidate.password" v-if="formValidate.passwordshow" placeholder="请输入密码"   size="large" icon="md-eye" autocomplete="off" @on-click="password01()"></Input>
                <Input type="password" v-model="formValidate.password" v-else placeholder="请输入密码"  size="large" icon="md-eye-off" autocomplete="off" @on-click="password01()"></Input>
              </FormItem>
              <FormItem label="确认密码:" prop="passwords" required>
                  <Input type="text" v-model="formValidate.passwords" placeholder="请输入密码" v-if="formValidate.passwordsshow"  size="large" icon="md-eye" autocomplete="off" @on-click="password()"></Input>
                  <Input type="password" v-model="formValidate.passwords" v-else placeholder="请输入密码"  size="large" icon="md-eye-off" autocomplete="off" @on-click="password()"></Input>
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
import roleComponent from "../../pub/rolecomponent"
export default {
  name: "",
  components: {
    roleComponent
  },
  props:{
    addroleshow:{
      default:false
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
       }
       else if (value.length<4 || value.length>12) {
           return callback('密码长度最小4个字符，最多12字符');
       }
       else {
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
      title:"新增维修人员",
      show:true,
      loading:false,
      formValidate:{
        loginAccount:"",
        password:"",
        passwordshow:false,
        districtId:"",
        sex:"1",
        name:"",
        idCard:"",
        mobileNo:"",
        passwords:"",
        passwordsshow:false,
        roleId:""
       },
      ruleValidate: {
           name: [
             { required: true, message: '姓名没有填写', trigger: 'blur' },
             { type: 'string', min:2,max:10, message: '姓名长度在2-10位',trigger: 'blur' }
           ],
           idCard: [
              { validator: validateIDcard, trigger: 'blur' }
           ],
           mobileNo: [
             { validator: validatePhone, trigger: 'blur' }
           ],
           password: [
               { validator: validatePass, trigger: 'blur' }
           ],
           passwords: [
               { validator: validatePassCheck, trigger: 'blur' }
           ],
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.eshow = this.addroleshow
  },
  watch:{
    addroleshow:{
      handler (val,oldval) {
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
      EmitroleComponent (e) {
        this.formValidate.roleId = e.id
      },
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
        if(!this.formValidate.roleId){
          this.$Message.info("角色没有选择")
            return
        }
        let data = {
            data:{
              token:this.$webapi.get('token'),
              loginAccount:this.formValidate.mobileNo,
              loginPassword:this.formValidate.password,
              name:this.formValidate.name,
              sex:this.formValidate.sex,
              idCard:this.formValidate.idCard,
              mobileNo:this.formValidate.mobileNo,
              roleId:""+this.formValidate.roleId
             }
        }
        data.data = JSON.stringify(data.data)
        _this.loading = true
        this.$api.post('/maintain/maintaineradd',data,reset => {
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
