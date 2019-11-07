<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">{{type==1?"添加":type==2?"修改":''}}低电预警值</div>
      <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="100">
          <!-- <FormItem label="低电预警值%:" prop="lowVoltage">
             <Input v-model="formCustom.lowVoltage" placeholder="低电预警值" />
          </FormItem> -->
          <FormItem label="低电预警值%:">
            <InputNumber
            style="width:100%"
            :max="100"
            :min="1"
            v-model="formCustom.lowVoltage"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"></InputNumber>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    selectitem:{
      default () {
        return {}
      }
    },
    type:{
      dafault () {
        return 0
      }
    }
  },
  data () {
    const validatelowVoltage = (rule, value, callback) => {
      if (isNaN(Number(value))) {
            callback('低电预警值格式不对,只能是数字');
        } else {
            callback();
        }
   }
    return {
      show:false,
      formCustom:{
        lowVoltage:1,
      },
      ruleValidate:{
        lowVoltage: [
         { required: true, message: '低电预警值没有填写', trigger: 'blur' },
         { type: 'string', min:1,max:4,  message: '低电预警值最长4位最小1位',trigger: 'blur' },
         { validator: validatelowVoltage, trigger: 'blur' }
       ],
      }
    }
  },
  mounted() {
     if(this.type==2){
      this.formCustom.lowVoltage=this.selectitem.lowVoltage?Number(this.selectitem.lowVoltage):1
     }
     this.show = true
  },
  methods: {
    handleSubmit (name) {
      let _this = this;
      // this.$refs[name].validate((valid) => {
      //     if (valid) {
      //         _this.pass()
      //     }
      // })
      this.pass()
    },
    pass () {
      let _this=this;
      let listdata={
          token:this.$webapi.get('token'),
          lowVoltage:this.formCustom.lowVoltage,
      }
      this.$api.post('/bicycledocksite/battery_warn/save',listdata,reset => {
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
