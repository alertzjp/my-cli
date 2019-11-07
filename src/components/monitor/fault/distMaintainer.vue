<template>
  <div class="">
    <Modal v-model="lockshow" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>分配维护人员</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="维护人员:">
                      <maintainer-component @emitmaintainer="emitmaintainer" :propsid="selectitem.principalsId" v-if="show"></maintainer-component>
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
      default:true,
    },
    selectitem:{
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
      show:false,
      formCustom:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom = this.selectitem
      this.maintainerId = this.selectitem.principalsId
      this.show = true
  },
  watch:{
    selectitem:{
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
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        maintainerId:this.maintainerId,
        id:this.formCustom.id
      }
      this.$api.post('/fault_monitor/distMaintainer',data,reset => {
          if (reset.codeId === 1) {
              _this.$Message.info('分配成功');
              _this.$emit("emitcomponent",true)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("emitcomponent",false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
