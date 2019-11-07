<template>
  <div class="warpbox">
      <div class="loginbox" >
         <div class="loginbox-hd">
           自行车运营商管理
         </div>
         <div class="loginbox-bd">
           <Form :model="formItem"  ref="formItem"  :rules="ruleCustom" :label-width="0">
            <div class="login-item">
               <FormItem label="" prop="mobile">
                 <Input v-model="formItem.mobile" placeholder="用户名" size="large" style="margin-bottom:10px"></Input>
               </FormItem>
            </div>
            <div class="login-item">
              <div class="" v-if="passwordshow">
                <FormItem label="" prop="password">
                  <Input type="password" v-model="formItem.password" placeholder="请输入密码"  size="large" icon="md-eye" autocomplete="off" @on-click="password01()"></Input>
                </FormItem>
              </div>
              <div class="" v-else>
                <FormItem label="" prop="password">
                  <Input v-model="formItem.password" placeholder="请输入密码" icon="md-eye-off"  size="large" @on-click="password01()"></Input>
                </FormItem>
              </div>
             </div>
            <div class="loginBtn">
              <span @click="handleSubmit('formItem')"><Button type="primary" size="large"  long >登录</Button></span>
             </div>
             </Form>
         </div>
      </div>
      <div class='showbikeinfo'>
     </div>
  </div>
</template>

<script>
let axios = require('axios')
export default {
  name: 'login',
  data () {
    return {
      passwordshow:true,
      formItem:{
        mobile: "",
        password: "",
      },
      ruleCustom: {
          mobile: [
              { required: true, message: '用户名称没有填写', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '密码没有填写', trigger: 'blur' }
          ],
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.enter()
  },
  methods: {
    enter () {
      let _this = this;
      document.onkeydown = function(e) {
          e = e || window.event;
          if(e.keyCode == 13) {
              if(_this.$route.path=="/login/"){
                _this.login()
              }
              return false
          }
      }
    },
    password01 () {
      this.passwordshow = !this.passwordshow
    },
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
              _this.login()
          }
      })
    },
    login (e) {
      let _this = this
      let data = {
        data:JSON.stringify({
          name:this.formItem.mobile,
          password:this.formItem.password
        })
      }
      this.$api.post("/login", data, reset => {
        if (reset.codeId === 1) {
            let data = reset.resData
            _this.$webapi.save('token',data.token)
            _this.$webapi.save('status',data.status)
            _this.$webapi.save('accountType',data.flag)
            _this.$webapi.save('name',data.name)
            _this.$router.push({path:'/admin/index/'})
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
    .loginBtn{
      display:flex;
      flex-direction: row;
      width: 100%;
      margin-top: 20px;
      span{
        flex:1;
        padding: 0 5px;
      }
      .ivu-btn-large{
        height: 50px
      }
    }
    .warpbox{
      width: 100%;
      height: 100vh;
      background: #2c3a4c;
      display: flex;
      flex: 1;
      justify-content:center;
      align-items: center;
    }
    .loginbox{
       border-radius:2px;
       width: 400px;
      .loginbox-hd{
        text-align: left;
        height: 60px;
        line-height: 60px;
        text-align:center;
        border-radius: 15px 15px 0 0;
        font-size: 24px;
        font-weight: normal;
        color: #fff;
        padding: 0 50px;
      }
      .loginbox-bd{
        padding: 30px;
        .ivu-input{
          background: #263342!important;
          border: #49525c 1px solid!important;
          color: #fff!important;
        }
        .login-item{
          margin-bottom: 20px;
        }
      }
    }
</style>
