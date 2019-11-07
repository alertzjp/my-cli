<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
             <FormItem label="企业名称" >
               {{formValidate.companyName}}
              </FormItem>
              <FormItem label="规则类型" prop="bikeType" required>
                 <Select v-model="formValidate.bikeType" placeholder="请选择规则类型">
                     <Option value="1">自行车</Option>
                     <Option value="2">助力车</Option>
                 </Select>
              </FormItem>
              <FormItem label="规则详情:" prop="bikeNoRule" required>
                   <Input v-model="formValidate.bikeNoRule" placeholder="规则详情" />
              </FormItem>
               <FormItem label="二维码位置:" prop="noIndex" required>
                   <Input v-model="formValidate.noIndex" placeholder="二维码位置" />
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
    enteringCompanyId:{
      default() {
        return ''
      }
    },
    selectitem:{
      default() {
        return {}
      }
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
          let reg = /[1-9][0-9]{0,2}/ 
          if (value === '') {
              callback(new Error('二维码位置没有填写'));
          } else {
              if (!reg.test(this.formValidate.noIndex)) {
                  // 对第二个密码框单独验证
                  callback(new Error('二维码位置格式不对'));                   
              }
              callback();
          }
      };
    return {
      title:"修改规则",
      show:true,
      loading:false,
      formValidate:{
        bikeNoRule:"",
        bikeType:"",
        id:"",
        noIndex:"1",
        companyName:""
       },
      ruleValidate: {
           bikeType: [
             { required: true, message: '规则类型没有选择', trigger: 'blur' },
           ],
           bikeNoRule: [
             { required: true, message: '规则详情没有填写', trigger: 'blur' },
             { type: 'string', min:1,max:255,  message: '规则详情最长255位最小1位',trigger: 'blur' },
           ],
            noIndex: [
              { validator: validatePass, trigger: 'blur' }    
           ], 
       }
    }
  },
  mounted() {
    this.formValidate.id=this.selectitem.id
    this.formValidate.bikeType=this.selectitem.bikeType?''+this.selectitem.bikeType:""
    this.formValidate.bikeNoRule=this.selectitem.bikeNoRule
    this.formValidate.noIndex  = ''+this.selectitem.noIndex
    this.formValidate.companyName = this.$route.query.name || ""
  },
  methods: {
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
        if(!this.enteringCompanyId){
          this.$Message.info('没找到公司信息,无法修改');
          return
        }      
        let data = {
            data:{
              token:this.$webapi.get('token'),
              id:this.formValidate.id,
              enteringCompanyId:this.enteringCompanyId,
              bikeNoRule:this.formValidate.bikeNoRule,
              bikeType:this.formValidate.bikeType,
              noIndex:this.formValidate.noIndex
             }
        }
        data.data = JSON.stringify(data.data)
        _this.loading = true
        this.$api.post('/shared_bike_code_rule/update',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.$Message.success('修改成功');
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
