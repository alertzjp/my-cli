<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="用户名:" prop="name">
                   <Input v-model="formValidate.name" placeholder="用户名" />
              </FormItem>
              <FormItem label="真名:" prop="userName">
                   <Input v-model="formValidate.userName" placeholder="真名" />
              </FormItem>
              <FormItem label="手机号码:" prop="mobile" required>
                   <Input v-model="formValidate.mobile" placeholder="手机号码" />
              </FormItem>
              <FormItem label="密码:" prop="password" required>
                   <Input v-model="formValidate.password" icon="ios-eye" placeholder="密码" v-if="passwordshow"  @on-click="passwordicon"/>
                   <Input type="password" v-model="formValidate.password" icon="md-eye-off" placeholder="密码" v-if="!passwordshow"  @on-click="passwordicon"/>
              </FormItem>
              <FormItem label="确认密码:" prop="passwords" required>
                  <Input v-model="formValidate.passwords" icon="ios-eye" placeholder="密码" v-if="passwordshows"  @on-click="passwordicons"/>
                  <Input type="password" v-model="formValidate.passwords" icon="md-eye-off" placeholder="密码" v-if="!passwordshows"  @on-click="passwordicons"/>
               </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
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
    addroleshow:{
      default:false
    }
  },
  data () {
    let valid=/^[a-zA-Z0-9_]{1,}$/
    const validatename = (rule, value, callback) => {
      if (!valid.test(value)) {
            callback('用户名由字母数字组成');
        } else {
            callback();
        }
   };
    const validatePhone = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('手机号不能为空'));
        } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
            callback('手机号格式不正确');
        } else {
            callback();
        }
   };
     const validatePass = (rule, value, callback) => {
       if (value === '') {
           callback(new Error('密码没有填写'));
       }else if(!valid.test(value)) {
             callback('密码由字母数字组成');
         }else {
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
      title:"新增账号信息",
      show:true,
      passwordshow:false,
      passwordshows:false,
      formValidate:{
        name:"",
        password:"",
        passwords:"",
        userName:"",
        mobile:"",
        mechanismId:""
      },
      ruleValidate: {
           name: [
             { required: true, message: '用户没有填写', trigger: 'blur' },
             { type: 'string', min:5,max:20,message: '用户名长度在5-20位', trigger: 'blur' },
             { validator: validatename, trigger: 'blur' }
           ],
           userName: [
             { required: true, message: '真名名称没有填写', trigger: 'blur' },
             { type: 'string', min:2,max:30,message: '真名名称最小2个字符，最大30个字符',  trigger: 'blur' }
           ],
           mobile: [
             { validator: validatePhone, trigger: 'blur' }
           ],
           password: [
               { validator: validatePass, trigger: 'blur' },
               { type: 'string', min:8,max:20,message: '密码长度在8-20位', trigger: 'blur' },
           ],
           passwords: [
               { validator: validatePassCheck, trigger: 'blur' }
           ],
       }
    }
  },
  mounted() {

  },
  methods: {
      passwordicon () {
        this.passwordshow = !this.passwordshow
      },
      passwordicons () {
        this.passwordshows = !this.passwordshows
      },
      EmitoperatorComponent (e) {
         this.formValidate.mechanismId = e.id
      },
      cancel () {
        this.$emit("emitmembercomponent")
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
              name:this.formValidate.name,
              userName:this.formValidate.userName,
              mobile:this.formValidate.mobile,
              password:this.formValidate.password
            }
        }
        data.data = JSON.stringify(data.data)
        this.$api.post('/account/add',data,reset => {
          if (reset.codeId === 1) {
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
