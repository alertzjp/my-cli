<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>设置震动开关</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="二维码编号:" prop="purchase_order_no">
                     {{formCustom.bicycleNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="车锁编号:" prop="purchase_order_no">
                     {{formCustom.lockNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="电子标签:" prop="purchase_order_no">
                     {{formCustom.bicycleSensorsNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="震动开关:">
                     <Select v-model="formCustom.status">
                         <Option value="1">开启</Option>
                         <Option value="0">关闭</Option>
                      </Select>
                   </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
         <Button type="error" @click="cancel">取消</Button>
         <Button type="primary" :loading="loading" @click="ok">保存</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    itemdata:{
      default:()=>{}
    }
  },
  data () {
    return {
      show:false,
      upgradeAppType:'1',
      loading:false,
      formCustom:{
        bicycleNo:"",
        lockNo:"",
        bicycleSensorsNo:"",
        enquiriesNo:"",
        lockId:"",
        status:"0"
      }
    }
  },
  mounted() {
    //do something after mounting vue instance    
      this.formCustom.bicycleNo = this.itemdata.bicycleNo
      this.formCustom.lockNo = this.itemdata.lockNo
      this.formCustom.bicycleSensorsNo = this.itemdata.bicycleSensorsNo
      this.formCustom.enquiriesNo = this.itemdata.enquiriesNo
      this.formCustom.lockId = this.itemdata.lockId
      this.show = true
  },
  methods: {
    ok() {
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        lockId:this.formCustom.lockId,
        status:parseInt(this.formCustom.status)
      }
      this.loading = true
      this.$api.post('/bicycle/order/updateVibrationSetting',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
              _this.$emit("lockemitcomponent",true)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      },failure=>{
        _this.loading = false
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
