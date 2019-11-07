<template>
  <div class="">
    <Modal v-model="lockshow" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>智能设备调试日志上传设置</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="车载终端编号:" prop="purchase_order_no">
                     {{formCustom.terminalNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="充电桩编号:" prop="purchase_order_no">
                     {{formCustom.chargePileNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="车辆型号:" prop="purchase_order_no">
                     {{formCustom.bikeModel}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="车头锁状态:" prop="purchase_order_no">
                     {{formCustom.bikeStatus}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="车辆控制状态:" prop="purchase_order_no">
                      {{formCustom.bikeStatus}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="状态:" prop="purchase_order_no">
                     <span v-if="formCustom.status==1">待生产</span>
                     <span v-if="formCustom.status==2">已生产</span>
                     <span v-if="formCustom.status==3">合格</span>
                     <span v-if="formCustom.status==4">不合格</span>
                     <span v-if="formCustom.status==5">出厂</span>
                     <span v-if="formCustom.status==6">已投产</span>
                     <span v-if="formCustom.status==10">低电量充电</span>
                     <span v-if="formCustom.status==12">待租</span>
                     <span v-if="formCustom.status==21">临时停车</span>
                     <span v-if="formCustom.status==20">已借出</span>
                     <span v-if="formCustom.status==30">车辆故障</span>
                     <span v-if="formCustom.status==41">维修中</span>
                     <span v-if="formCustom.status==42">维修完成</span>
                     <span v-if="formCustom.status==49">报废</span>
                    </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
         <Button type="error" @click="cancel">取消</Button>
         <Button type="primary" @click="ok">保存</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    lockshow:{
      default:false,
    },
    itemdata:{
      default:()=>{}
    }
  },
  data () {
    return {
      upgradeAppType:'1',
      formCustom:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom = this.itemdata
  },
  watch:{
    lockshow:{
      handler(val,oldval){
        this.lockshow = val[0]
      },
      deep:true
    },
    itemdata:{
      handler(val,oldval){
      this.formCustom = val
      },
      deep:true
    }
  },
  methods: {
    ok() {
      let _this = this
      let data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          id:this.formCustom.id
        })
      }
      this.$api.post('/bike/loguploadset',data,reset => {
          if (reset.codeId === 1) {
              _this.$emit("lockemitcomponent",this.formCustom)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",this.formCustom)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
