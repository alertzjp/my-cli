<template>
  <div class="">
    <Modal v-model="eshow" width="460" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <FormItem label="来电时间:" prop="createdTime">
                  <!-- <time-component :timevale="2" @timeEmit="timeEmit"></time-component> -->
                  {{this.$webapi.gettime('time',new Date().getTime()/1000)}}
               </FormItem>
              <FormItem label="车辆二维码:">
                  <div class="" v-if="selectitemshow">
                  【{{selectitem.bikeNo}}】
                    <span @click="delectIcon" class="pointer"><Icon type="md-close-circle" /></span>
                  </div>
                  <div v-if="carshow && !selectitemshow">
                    <Buttoncomponent type="default" title="选择车辆二维码" @emitButton="ClickNumber"></Buttoncomponent>
                  </div>
                  <div class="" v-if="!carshow && !selectitemshow">
                    <callnumber-component @emitCarComponent="emitCarComponent"></callnumber-component>
                  </div>
              </FormItem>
              <FormItem label="来电用户:">
                  <Input v-model="formValidate.callMobile" placeholder="来电用户" />
              </FormItem>
              <FormItem label="报障类型:">
                  <faultTypecomponent @emitfault="emitfault"></faultTypecomponent>
              </FormItem>
              <FormItem label="是否急修">
                <!-- <Select v-model="formValidate.type" placeholder="请选择问题类型">
                   <Option value="">全部</Option>
                   <Option value="1">急修</Option>
                   <Option value="0">非急修</Option>
               </Select> -->
               <RadioGroup v-model="formValidate.type">
                   <Radio label="1">急修</Radio>
                   <Radio label="0">非急修</Radio>
               </RadioGroup>
              </FormItem>
              <FormItem label="问题描述:" prop="fault_content">
                  <Input v-model="formValidate.fault_content" placeholder="问题描述" />
              </FormItem>
              <FormItem label="客服记录:">
                  <Input v-model="formValidate.detail" placeholder="客服记录" />
              </FormItem>
            <FormItem>
              <Buttoncomponent title="保存"  @emitButton="handleSubmit('formValidate')"></Buttoncomponent>
              <Buttoncomponent title="取消" type="error"  @emitButton="handleReset('formValidate')"></Buttoncomponent>
            </FormItem>
        </Form>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import timeComponent from "../../pub/timeonecomponent.vue"
import faultTypecomponent from '../../pub/faultTypecomponent.vue'
import rentcarComponent from "../../pub/rentcarcomponent.vue"
import callnumberComponent from "./callNumber.vue"
export default {
  name: "",
  components: {
   faultTypecomponent,
   timeComponent,
   rentcarComponent,
   callnumberComponent
  },
  props:{
    addroleshow:{
      default:false
    },
    revisiondata:{}
  },
  data () {
    let han = /^[\u4e00-\u9fa5]+$/;
    const validataddress = (rule, value, callback) => {
        if (!value) {
            callback(new Error('详细地址没有填写'));
        } else if (!han.test(value)) {
            callback(new Error('请输入中文汉字'));
        } else {
            callback();
        }
    };
    return {
      title:"新增来电客户",
      eshow:false,
      carshow:true,
      selectitem:{},
      selectitemshow:false,
      formValidate:{
        mobileNo:"",
        fault_type:"",
        faultcontent:"",
        fault_content:"",
        detail:"",
        callMobile:"",
        createdTime:"",
        rentId:"",
        type:'1'
      },
      ruleValidate: {
           // createdTime: [
           //   { required: true, type: 'date', message: '时间没有选择', trigger: 'change' }
           // ],
           mobileNo: [
             { required: true, message: '租车用户没有填写', trigger: 'blur' },
             { type: 'string', min:1,max:50, trigger: 'blur' }
           ],
           // detail: [
           //   { required: true, message: '客服记录没有填写', trigger: 'blur'},
           // ],
       }
    }
  },
  mounted() {
    this.eshow = this.addroleshow;
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
      delectIcon () {
        this.selectitemshow = false
        this.selectitem = {}
        this.formValidate.callMobile = ""
      },
      emitCarComponent (e) {
        if(e){
          this.selectitem = e
          this.formValidate.mobileNo = e.mobileNo
          this.formValidate.callMobile= e.mobileNo
          this.formValidate.rentId = e.id
          this.selectitemshow = true
        }else{
          this.selectitemshow = false
        }
          this.carshow = true
      },
      ClickNumber () {
        this.carshow = false
      },
      createdTime01 (e) {
        this.formValidate.createdTime = e
      },
      cancel () {
        this.$emit("emitrolecomponent")
      },
      emitfault(e){
        this.formValidate.fault_type = e.id||"";
        this.formValidate.faultcontent = e.name||"";
      },
      timeEmit (e) {
        this.formValidate.createdTime = e
      },
      handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
              if (valid) {
                _this.addrolepost()
              }
          })
      },
      rentcarEmit (e) {
          this.formValidate.mobileNo = e.mobileNo
          this.formValidate.callMobile =e.mobileNo
      },
      addrolepost () {
        if(!this.formValidate.fault_type){
           this.$Message.warning('报障类型没有选择');
           return;
        }
        let newitem = []
            newitem.push(this.formValidate.faultcontent)
            newitem.push(this.formValidate.fault_content)
        let listdata = {
             data:{
                token:this.$webapi.get('token'),
                createdTime:this.formValidate.createdTime==""?this.$webapi.gettime('time',new Date().getTime()/1000):this.formValidate.createdTime,
                mobileNo:this.formValidate.mobileNo,
                fault_type:''+this.formValidate.fault_type,
                fault_content:newitem.join(","),
                detail:this.formValidate.detail,
                callMobile:this.formValidate.callMobile,
                rentId:this.formValidate.rentId
             }
        }
        if(this.formValidate.rentId == "" || !this.formValidate.rentId){
           this.$Message.info("车辆二维码没有选择")
           return
        }
        listdata.data = JSON.stringify(listdata.data)
        let _this = this
        this.$api.post("/customerBicycle/addlightalk_rent", listdata, reset => {
          if (reset.codeId == 1) {
            if(_this.formValidate.type==1){
                _this.$router.push({
                  path:"/admin/customerManage/urgencybike/list"
                })
            }else{
              _this.cancel()
            }
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
