<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">{{type==1?"新增片区":"编辑片区"}}</div>
      <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="80">
        <FormItem label="片区编号:" prop="districtNo" required>
              <Input v-model="formCustom.districtNo" placeholder="片区编号" />
              <div>
                片区编号格式为数字
              </div>
          </FormItem>
          <FormItem label="片区名称:" prop="name" >
              <Input v-model="formCustom.name" placeholder="片区名称" />
          </FormItem>           
          <FormItem label="维护人员:" required>
              <maintainer-component :propsid="formCustom.principalsId" @emitmaintainer="emitmaintainer"></maintainer-component>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" size="large" v-if="type==1">保存</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" size="large" v-if="type==2">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import maintainerComponent from "../../pub/maintainerIdcomponent.vue"
export default {
  name: "",
  components: {
    maintainerComponent
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    setlectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
     const validatePass = (rule, value, callback) => {
       console.log(1111)
       let reg = /^[0-9]*$/;
        if (value === '') {
            callback(new Error('片区编号没有填写'));
        } else {
            if (!reg.test(value)) {
                // 对第二个密码框单独验证
                callback(new Error('片区编号格式不对'));
            }
            callback();
        }
    };
    return {
      show:false,
      formCustom:{
        id:"",
        name:"",
        districtNo:"",
        principalsId:""
      },
      ruleValidate:{
        name: [
          { required: true, message: '片区名称没有填写', trigger: 'blur' },
          { type: 'string', min: 2,max:16, message: '片区名称2-16个字符', trigger: 'blur' }
         ],
          districtNo: [
            { validator: validatePass, trigger: 'blur' }
          ]         
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(this.type==2){
      this.formCustom.id = this.setlectitem.id
      this.formCustom.name = this.setlectitem.name    
      this.formCustom.districtNo = this.setlectitem.districtNo       
      this.formCustom.principalsId = this.setlectitem.principalsId
    }
    this.show = true
  },
  methods: {
    handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(_this.type==1){
                  _this.pass()
                }else if(_this.type==2){
                  _this.editpass()
                }
            }
        })
     },
    emitmaintainer (e) {
      this.formCustom.principalsId = e.id
    },
    pass () {
      let _this=this;
      if(this.formCustom.principalsId==""){
        this.$Message.info("维护人员没有选择")
        return
      }
      let listdata={
         data:JSON.stringify({
             district:[{
                name:this.formCustom.name,
                districtNo:this.formCustom.districtNo,
                principalsId:this.formCustom.principalsId
             }],
             token:this.$webapi.get('token'),
           })
      }
      this.$api.post('/district/batch_add',listdata,reset => {
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    editpass () {
      let _this=this;
      if(this.formCustom.principalsId==""){
        this.$Message.info("维护人员没有选择")
        return
      }
      let listdata={
         data:JSON.stringify({
             district:[{
                id:this.formCustom.id,
                name:this.formCustom.name,
                districtNo:this.formCustom.districtNo,
                principalsId:this.formCustom.principalsId
             }],
             token:this.$webapi.get('token'),
           })
      }
      this.$api.post('/district/batch_update',listdata,reset => {
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    cancel(e) {
      this.$emit("emitcomponent",e?true:false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
