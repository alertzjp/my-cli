<template>
  <div class="">
    <Modal v-model="eshow" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate"  :label-width="80">
              <FormItem label="用户名:" >
                   {{formValidate.loginAccount}}
              </FormItem>
              <FormItem label="真名:">
                    {{formValidate.userName}}
              </FormItem>
              <FormItem label="角色名称:" >
                   <role-component @EmitroleComponent="EmitroleComponent" :flag="flag" :roleId="formValidate.roleId" v-if="roleshow"></role-component>
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
import roleComponent from "../../pub/rolecomponent.vue"
export default {
  name: "",
  components: {
    roleComponent
  },
  props:{
    setlectItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      title:"设置角色",
      eshow:true,
      roleshow:false,
      flag:3,
      formValidate:{
         accountId:"",
         roleId:"",
         name:"",
         userName:""
      },
    }
  },
  mounted() {
    //do something after mounting vue instance
    console.log(this.setlectItem)
    this.formValidate.loginAccount = this.setlectItem.loginAccount
    this.formValidate.userName = this.setlectItem.name
    this.formValidate.accountId = this.setlectItem.id
    this.formValidate.roleId = this.setlectItem.roleId 
    this.roleshow = true
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
      cancel () {
        this.$emit("emitcomponent")
      },
      handleSubmit (name) {
        this.addrolepost()
      },
      addrolepost () {
        let _this = this
        if(this.formValidate.roleId==""){
          this.$Message.info("角色名称没有选择")
          return
        }
        let data = {
            data:{
              maintainerId:this.formValidate.accountId,
              token:this.$webapi.get('token'),
              roleId:""+this.formValidate.roleId,
            }
        }
        data.data = JSON.stringify(data.data)
        this.$api.post('/maintain/maintainer_set_role',data,reset => {
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
