<template>
  <div class="page-component-view">
   <div class="page-component-bd">
    <Row>
     <Col :xs="24" :sm="24" :md="12" :lg="12">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="卡号" prop="nowCardNo">
            <Input v-model="formValidate.nowCardNo" placeholder="请输入卡号"></Input>
        </FormItem>
        <FormItem label="卡类型" prop="cardType" required>
            <Select v-model="formValidate.cardType" @on-change="cardType" placeholder="请选择卡类型">
                <Option value="1">会员卡</Option>
                <Option value="2">团体卡</Option>
            </Select>
        </FormItem>
        <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="性别" prop="sex" required>
            <RadioGroup v-model="formValidate.sex">
               <Radio label="1">
                    <span>男</span>
               </Radio>
               <Radio label="2">
                    <span>女</span>
               </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="卡费">
            <Input v-model="formValidate.amount" placeholder="请输入卡费" disabled></Input>
        </FormItem>
        <FormItem label="押金" :required="formValidate.cardType==1" v-if="formValidate.cardType==1" prop="foregift" >
            <Input v-model="formValidate.foregift" placeholder="请输入押金" ></Input>
        </FormItem>
        <FormItem label="证件号码" prop="identityCard">
            <Input v-model="formValidate.identityCard" placeholder="请输入证件号码"></Input>
        </FormItem>
        <FormItem label="出生日期" required>
            <DatePicker type="date" placeholder="出生日期" @on-change="getbirthday"></DatePicker>
        </FormItem>
        <FormItem label="学生" prop="student" required>
          <RadioGroup v-model="formValidate.student">
             <Radio label="1">
                  <span>是</span>
             </Radio>
             <Radio label="2">
                  <span>否</span>
             </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机" prop="mobile">
            <Input v-model="formValidate.mobile" placeholder="请输入手机"></Input>
        </FormItem>
        <FormItem label="固定号码">
            <Input v-model="formValidate.telephone" placeholder="请输入固定号码"></Input>
        </FormItem>

        <FormItem label="所在单位" prop="workUnit">
            <Input v-model="formValidate.workUnit" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入所在单位"></Input>
        </FormItem>
        <FormItem label="地址">
            <Input v-model="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem label="备注" >
            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem>
             <Buttoncomponent title="保存" @emitButton="handleSubmit('formValidate')"></Buttoncomponent>
         </FormItem>
    </Form>
     </Col>
   </Row>
  </div>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    const foregiftPass = (rule, value, callback) => {
         if(this.formValidate.cardType==2){
           callback();
         }else {
           if (value === '') {
               callback(new Error('押金没有填写'));
           } else {
               callback();
           }
         }
    };
    return {
      formValidate:{
         memberNo:'',
         name:"",
         sex:"1",
         cardType:"1",
         foregift:"",
         amount:"0",
         remark:"",
         identityCard:"",
         birthday:"",
         address:"",
         cardSerialNumber:"",
         mobile:"",
         telephone:"",
         student:"1",
         workUnit:"",
         orldCardNo:"",
         nowCardNo:""
      },
      ruleValidate: {
            name: [
              { required: true, message: '姓名没有填写', trigger: 'blur' },
              { type: 'string', min:1,max:50, message: '最小2个字符，最多50字符', trigger: 'blur' }
            ],
            nowCardNo: [
              { required: true, message: '卡号没有填写', trigger: 'blur' },
              { type: 'string', min:1,max:50, message: '最小2个字符，最多50字符', trigger: 'blur' }
            ],
            foregift: [
              { validator: foregiftPass, trigger: 'blur' }
            ],
            identityCard: [
              { required: true, message: '证件号码没有填写', trigger: 'blur' },
              { type: 'string', min:1,max:50, message: '最小2个字符，最多50字符', trigger: 'blur' }
            ],
            mobile: [
              { required: true, message: '手机没有填写', trigger: 'blur' },
              { type: 'string', min:1,max:50, message: '最小2个字符，最多50字符', trigger: 'blur' }
            ]
        }
    }
  },
  methods: {
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
           if (valid) {
               _this.post()
           }
     })
   },
   getbirthday (e){
     this.formValidate.birthday = e
   },
   cardType () {
   },
   post () {
    if(this.formValidate.birthday==""){
      this.$Message.info("生日没有填写")
      return
    }
    if(this.formValidate.cardType==2){
      this.formValidate.foregift = 0
    }
     let listdata = this.formValidate
       listdata.token = this.$webapi.get('token')
     let _this =  this
     this.formValidate.amount = 0
     this.$api.post('/universalCard/add',_this.$webapi.getdealElement(listdata),reset => {
         if (reset.codeId === 1) {
             _this.$Message.success("新增成功")
             _this.$router.push({
               path:"/admin/userManage/usermember/list"
             })
         } else {
             _this.$netcode.getApiCode(reset)
         }
     })

   }
  }
}
</script>
<style lang="less" scoped>
</style>
