<template>
  <div class="">
    <Modal v-model="eshow" width="360" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:center">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <FormItem label="资源名称:" prop="name">
                   <Input v-model="formValidate.name" placeholder="资源名称" />
              </FormItem>
              <FormItem label="接口路径:">
                   <Input v-model="formValidate.url" placeholder="接口路径" />
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
    selectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading:false,
      title:"修改资源名称",
      eshow:false,
      formValidate:{
        name:"",
        url:"",
        id:"",
        flag:2
      },
      ruleValidate: {
           name: [
             { required: true, message: '资源名称没有填写', trigger: 'blur' },
             { type: 'string', min:2,max:30,message: '资源名称最小2个字符,最大值30个字符', trigger: 'blur' }
           ],
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.eshow = this.editroleshow
    this.formValidate.id = this.selectitem.id
    this.formValidate.name = this.selectitem.name
    this.formValidate.url = this.selectitem.url
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
         this.addrolepost()
      },
      addrolepost () {
        let data = {
            token:this.$webapi.get('token'),
            name:this.formValidate.name,
            url:this.formValidate.url,
            id:this.formValidate.id,
            flag:2
        }
        let _this = this
        _this.loading = true
        this.$api.post("/pub_resources/update", data, reset => {
          _this.loading = false
          if (reset.codeId == 1) {
            _this.$Message.success('新增成功');
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
