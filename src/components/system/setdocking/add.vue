<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
            <span>升级站点</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="版本">
                        <version-component @EmitversionComponent="EmitversionComponent" ></version-component>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem label="">
                           <Button type="primary" @click="handleSubmit()" :loading="loading">升级</Button>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
         </div>
         <div class="">

         </div>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import versionComponent from "../../pub/versioncomponent.vue"
export default {
  name: "",
  components: {
    versionComponent
  },
  props:{
    setectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{
          type:"",
          lockId:"",
          equipmentNo:"",
          id:""
      },
      data:[],
      show:false,
      loading:false
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.equipmentNo =this.setectitem.equipmentNo
    this.show = true
  },
  methods: {
    cancel () {
      this.$emit("EmitversionComponent",false)
    },
    EmitversionComponent (e) {
      this.formCustom.id = e.id
    },
    handleSubmit () {
      let _this = this;
      this.loading = true
      let listdata = {
          token:this.$webapi.get("token"),
          id:this.formCustom.id,
          equipmentNo:this.formCustom.equipmentNo
      }
      this.$api.post('/site/order/upgrade',listdata,reset => {
        _this.loading = false
        if (reset.codeId == 1) {
          _this.$Message.info("操作成功")
          _this.$emit("EmitversionComponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      },falu=>{
        _this.loading = false
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
