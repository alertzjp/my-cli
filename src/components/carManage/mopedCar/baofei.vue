<template>
  <div class="">
    <Modal v-model="eshow" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>报废详情</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="二维码编号:" prop="bicycleNo">
                      {{formCustom.bicycleNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="12">
                 <div class="">
                   <FormItem label="维护人:">
                      {{formCustom.maintainerName}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="警告原因:">
                     {{formCustom.cause}}
                   </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
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
      eshow:false,
      maintainerId:'',
      cause:"",
      bikeNo:'',
      formCustom:{}
    }
  },
  mounted() {
      this.eshow=this.lockshow;
      this.getdata()
  },
  watch:{
    lockshow:{
      handler(val,oldval){
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
    emitmaintainer (e) {
      this.maintainerId = e.id
    },
    getdata(){
      let  _this=this;
      let  listdata = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          bikeNo:this.itemdata.frameNo,
        })
      }
      this.$api.get('/bike/scrapDetail',listdata,reset => {
          if (reset.codeId === 1) {
              _this.eshow = true;             
              _this.formCustom=reset.resData;
          }else{
            _this.$netcode.getApiCode(reset)
            this.$emit("lockemitcomponent",this.formCustom)
          }
      })
    },
    ok() {
      let _this = this
      let  data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          maintainerId:this.maintainerId,
          cause:this.cause,
          bikeNo:this.formCustom.frameNo
        })
      }
      this.$api.post('/bike/warningbike',data,reset => {
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
