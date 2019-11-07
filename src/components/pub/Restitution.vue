<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">租车调整费用</div>
        <Form :label-width="100" ref="formCustom" :model="formCustom" :rules="ruleValidate">
          <FormItem label="租车费用(元)">
            <span v-if="lockprice==0">
               <Input type="text" v-model="formCustom.rentCharge"></Input>
            </span>
            <span v-else>{{formCustom.rentCharge}}</span>
          </FormItem>
          <FormItem label="调整后费用(元)" prop="restitutionCharge">
             <Input type="text" v-model="formCustom.restitutionCharge"></Input>
          </FormItem>
          <FormItem label="调整原因" prop="cause">
            <Input v-model="formCustom.cause" type="textarea" :rows="4" placeholder="调整原因" />
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default"  @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" :loading="loading" style="margin-left: 8px" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  name: "",
  props: {
    selectitem:{
      default () {
        return {}
      }
    },
    lockprice:{
      default () {
        return 0
      }
    },
    idshow:{
      default(){
        return 0
      }
    }
  },
  data () {
    const validaterentCharge = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('原来金额不能为空'));
        } else if (!/^[0-9]+(.[0-9]{0,2})?$/.test(value)) {
            callback('原来金额格式不正确');
        } else {
            callback();
        }
   };
   const validaterestitutionCharge = (rule, value, callback) => {
       if (!value) {
           return callback(new Error('调整金额不能为空'));
       } else if (!/^[0-9]+(.[0-9]{0,2})?$/.test(value)) {
           callback('调整金额格式不正确');
       } else {
           callback();
       }
  };
    return {
      show:true,
      loading:false,
      formCustom:{
        id:"",
        rentCharge:"",
        restitutionCharge:"",
        cause:""
      },
      ruleValidate:{
        rentCharge: [
            { validator: validaterentCharge, trigger: 'blur' }
        ],
        restitutionCharge: [
            { validator: validaterestitutionCharge, trigger: 'blur' }
        ],
        cause: [
            { required: true, message: '调整原因没有填写', trigger: 'blur' },
            { type: 'string', min: 2, max:100,message: '调整原因限制2-100字符', trigger: 'blur' }
         ]
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.rentCharge = this.selectitem.rentCharge?this.selectitem.rentCharge:this.selectitem.tradeAmount
  },
  methods: {
    startTime (e) {
        this.formCustom.returnTime = e
    },
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
             _this.post()
          }
      })
    },
    post () {
      let listdata = {
          data:{
            token:this.$webapi.get('token'),
            bikeType:"1",
            rentCharge:""+(this.formCustom.rentCharge?this.formCustom.rentCharge:0),
            restitutionCharge:this.formCustom.restitutionCharge,
            cause:this.formCustom.cause,
            id:""+(this.idshow==0?this.selectitem.id:this.selectitem.rentId)
          }
      }
      if(this.formCustom.distance==""){
        listdata.data.returnTime = this.formCustom.returnTime
      }
      listdata.data = JSON.stringify(listdata.data)
      let _this =  this
      this.loading = true
      this.$api.post('/customerBicycle/addRestitution',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.pass()
        }else {
          _this.$netcode.getApiCode(reset)
       }
     },fll=>{
       _this.loading = false
     })
    },
    pass () {
      this.$emit("emitendcomponent")
    },
    cancel() {
      this.$emit("emitendcomponent")
    }
  }
}
</script>
<style lang="less" scoped>
</style>
