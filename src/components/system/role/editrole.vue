<template>
  <div class="">
    <Modal v-model="eshow" width="360" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:center">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="角色名称:" prop="name">
                   <Input v-model="formValidate.name" placeholder="角色名称" />
              </FormItem>
              <FormItem label="角色类型:" prop="flag">
                  <Select v-model="formValidate.flag">
                      <!-- <Option value="">全部</Option> -->
                      <Option  value="2">运营商</Option>
                      <Option  value="3">维护人员</Option>
                  </Select>
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
  props:{
    editroleshow:{
      default:false
    },
    seleteItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading:false,
      title:"编辑角色名称",
      eshow:false,
      formValidate:{
        id:"",
        name:"",
        flag:""
      },
      ruleValidate: {
           name: [
             { required: true, message: '角色名称没有填写', trigger: 'blur' },
             { type: 'string', min:2,max:30,message: '角色名称最小2个字符,最大值30个字符', trigger: 'blur' }
           ],
           flag: [
             { required: true, message: '角色类型没有选择', trigger: 'blur' },
           ],
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.eshow = this.editroleshow
    this.formValidate.id = this.seleteItem.id
    this.formValidate.name = this.seleteItem.name
    this.formValidate.flag = ''+this.seleteItem.flag
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
      cancel () {
        this.$emit("emitrolecomponent")
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
        let data = {
            token:this.$webapi.get('token'),
            name:this.formValidate.name,
            flag:this.formValidate.flag,
            id:this.formValidate.id,
            status:1
        }
        let _this = this
        _this.loading = true
        this.$api.post("/role/update", data, reset => {
          _this.loading = false
          if (reset.codeId == 1) {
            _this.$Message.success('编辑成功');
            _this.cancel()
          }else {
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
