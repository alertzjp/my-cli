<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>编辑自行车</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="车辆二维码:" prop="purchase_order_no">
                      {{formCustom.bicycleNo}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="自行车型号:" prop="model">
                     <Input v-model="formCustom.model" size="large" placeholder="自行车型号" />
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="电子标签:" prop="purchase_order_no">
                     <Input v-model="formCustom.bicycleSensorsNo" size="large" placeholder="电子标签" />
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="show">
                 <div class="">
                   <FormItem label="站点名称:" prop="bicycleDocksiteNo">
                     <site-component :docksiteNo="formCustom.bicycleDocksiteNo" @EmitDocksiteComponent="EmitDocksiteComponent"></site-component>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="车锁编号:" prop="lockNo">
                      <Input v-model="formCustom.lockNo" size="large" placeholder="车锁编号" />
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="车架号:" prop="enquiriesNo">
                     <Input v-model="formCustom.enquiriesNo" size="large" placeholder="车架号" />
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
  components:{
    siteComponent
  },
  props:{
    itemdata:{
      default:()=>{}
    }
  },
  data () {
    return {
      show:false,
      formCustom:{
          model:"",
          id:"",
          bicycleDocksiteNo:"",
          bicycleSensorsNo:"",
          bicycleDocksiteId:'',
          lockNo:"",
          enquiriesNo:"",
          bicycleNo:""
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.id = this.itemdata.id
      this.formCustom.bicycleNo = this.itemdata.bicycleNo
      this.formCustom.model = this.itemdata.model
      this.formCustom.bicycleDocksiteNo = this.itemdata.bicycleDocksiteNo
      this.formCustom.bicycleDocksiteId = this.itemdata.bicycleDocksiteId
      this.formCustom.bicycleSensorsNo = this.itemdata.bicycleSensorsNo
      this.formCustom.lockNo = this.itemdata.lockNo
      this.formCustom.enquiriesNo = this.itemdata.enquiriesNo
      this.formCustom.token = this.$webapi.get("token")
      setTimeout(()=>{
        this.show = true
      },300)
  },
  methods: {
    EmitDocksiteComponent (e) {
      this.formCustom.bicycleDocksiteNo = e.docksiteNo
    },
    ok() {
      let _this = this
      let  data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          bicycleList:this.formCustom
        })
      }
      this.$api.post('/bicycle/update',data,reset => {
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
