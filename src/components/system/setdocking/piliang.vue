<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
            <span>站点设备批量升级</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="版本">
                        <version-component @EmitversionComponent="EmitversionComponent"></version-component>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem label="导入文件">
                        <upfile-component @fileComponent="fileComponent" :mainid="formCustom.id" v-if="formCustom.id>0"></upfile-component>
                        <div class="mt10">
                          <Button type="error" @click="dnowSubmit()">下载模版</Button>
                        </div>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem>
                        <div class="upfizered">
                          <p>1.先选择版本，才会显示上传按钮</p>
                          <p>2.选择导入文件自动会提交,</p>
                        </div>
                      </FormItem>
                   </Col>
               </Row>
           </Form>
         </div>
       </div>
       <div slot="footer">
         <!-- <Button type="primary" @click="handleSubmit()">保存</Button> -->
       </div>
    </Modal>
  </div>
</template>
<script>
import versionComponent from "../../pub/versioncomponent.vue"
import upfileComponent from "./upfilecomponent.vue"
export default {
  name: "",
  components: {
    versionComponent,
    upfileComponent
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
    dnowSubmit () {
      window.location.href = "/static/sitev.xlsx"
    },
    cancel () {
      this.$emit("EmitversionComponent",false)
    },
    EmitversionComponent (e) {
      this.formCustom.id = e.id
    },
    fileComponent (e) {
      this.$emit("EmitversionComponent",true)
    }   
  }
}
</script>
<style lang="less" scoped>
.upfizered{
  color:#f30
}
</style>
