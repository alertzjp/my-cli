<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>设置GPS</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="150">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="锁车回报时间间隔:" prop="lockSecond">
                     <span>
                       <InputNumber :min="0" v-model="formCustom.lockSecond"></InputNumber>
                     </span>
                     <span>秒</span>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="开锁状态回报时间间隔:" prop="runSecond">
                     <span>
                       <InputNumber :min="0" v-model="formCustom.runSecond"></InputNumber>
                     </span>
                     <span>秒</span>
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
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    siteComponent
  },
  props:{
    itemdata:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:false,
      formCustom:{
        lockId:"",
        lockSecond:0,
        runSecond:0,
        type:1
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.lockId = this.itemdata.lockId
      this.show = true
  },
  watch:{
    itemdata:{
      handler(val,oldval){
        this.formCustom = val
      },
      deep:true
    }
  },
  methods: {
    EmitDocksiteComponent (e) {
      this.formCustom.dockditeNo = e.docksiteNo
    },
    ok() {
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        lockId:this.formCustom.lockId,
        lockSecond:this.formCustom.lockSecond,
        runSecond:this.formCustom.runSecond
      }
      this.$api.post('/bicycle/order/setGPSReturn',data,reset => {
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
