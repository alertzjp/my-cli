<template>
  <div class="">
    <Modal v-model="lockshow" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>新增报废</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="二维码编号:" prop="purchase_order_no">
                      {{formCustom.bicycleNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="报废人:">
                      <maintainer-component @emitmaintainer="emitmaintainer"></maintainer-component>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="原因:">
                     <Input v-model="cause" :rows="4" type="textarea" placeholder="原因" />
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
import maintainerComponent from "../../pub/maintainerIdcomponent.vue"
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
  components: {
    maintainerComponent
  },
  data () {
    return {
      maintainerId:'',
      cause:"",
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
    emitmaintainer (e) {
      this.maintainerId = e.id
    },
    ok() {
      if(!this.maintainerId){
        this.$Message.info('请选择维护人员');
        return;
      }
      if(!this.cause){
        this.$Message.info('警告原因没有填写');
        return;
      }
      let _this = this
      let data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          maintainerId:this.maintainerId,
          cause:this.cause,
          bikeNo:this.formCustom.bicycleNo
        })
      }
      this.$api.post('/bicycle/scrap',data,reset => {
          if (reset.codeId === 1) {
              _this.$Message.info('报废成功');
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
