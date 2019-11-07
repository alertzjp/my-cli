<template>
  <div class="">
    <Modal v-model="eshow" width="460" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>导入站点</span>
       </p>
       <div style="text-align:left">
          <Alert type="error">
            第一先选择仓库,再上传execl文件
          </Alert>
         <Form  :label-width="120">
              <FormItem label="站点execl:">
                <Upload
                :action="commonurl"
                :header="header"
                :show-upload-list ="false"
                :Accept="Accept"
                name="excelBicycleFile"
                :data="uploadData"
                :on-success="onsuccess"
                style="text-align:left;margin-bottom:10px">
                    <Button icon="ios-cloud-upload-outline">上传文件</Button>
                 </Upload>
                <Button type="error" icon="md-arrow-down" @click="exportfile">下载站点模版</Button>
               </FormItem>
        </Form>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
 export default {
  name: "",
  components: {},
  data () {
    return {
      stockintype:'2',
      uploadData:{
        warehouseId:""
      },
      title:"车辆入库",
      eshow:true,
      uploadnum:0,
      modelstyle:1,
      Progressshow:false,
      percent:0,
      items:[],
      commonurl:"",
      header: {
          'Content-Type': 'multipart/form-data'
      },
      Accept: "application/json"
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.uploadData.token = this.$webapi.get("token")
    this.commonurl = this.$webcommon + "/bicycledocksite/import"
  },
  watch:{
    addroleshow:{
      handler (val,oldval) {
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
      exportfile () {
        window.location.href = "/static/dnowdocksite.xls"
      },
      warehouseComponent (e) {
        this.uploadData.warehouseId = e.id
      },
      onsuccess (e) {
         if(e.codeId==1){
            this.$Message.info("导入成功")
            this.$emit("emitcomponent",true)
         }else{
           this.$Message.info(e.codeDes)
         }
      },
      cancel () {
        this.$emit("emitcomponent")
      },
      handleSubmit (name) {
        let _this = this;
          this.$refs[name].validate((valid) => {
              if (valid) {
                _this.addrolepost()
           }
        })
      },
      handleReset (name) {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
</style>
