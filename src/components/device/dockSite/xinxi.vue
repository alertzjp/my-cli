<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>获取{{formCustom.type==1?"一代":"二代"}}站点【{{formCustom.docksiteName}}】信号强度</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
             <Row v-if="formCustom.type==2">
                 <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <FormItem label="状态">
                     <Select v-model="formCustom.status" @on-change="status">
                        <Option value="">全部</Option>
                        <Option value="00">信号强度</Option>
                        <Option value="01">网络状态</Option>
                       </Select>
                       <p>选择状态值,直接会请求返回结果数据</p>
                   </FormItem>
                 </Col>
                 <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <div class="">
                     <FormItem label="获取内容">
                          {{msg}}
                     </FormItem>
                   </div>
                 </Col>
             </Row>
            <Row v-if="formCustom.type==1">
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <FormItem label="状态">
                  <Select v-model="formCustom.status" @on-change="status">
                     <Option value="">全部</Option>
                     <Option value="1">信号强度</Option>
                     <Option value="2">网络状态</Option>
                    </Select>
                    <p>选择状态值,直接会请求返回结果数据</p>
                </FormItem>
              </Col>
              <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="">
                  <FormItem label="获取内容">
                    {{msg}}
                  </FormItem>
                </div>
              </Col>
             </Row>
           </Form>
         </div>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import versionsetComponent from "../../pub/versionset.vue"
export default {
  name: "",
  components: {
    versionsetComponent
  },
  props:{
    selectItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{
        status:'',
        type:'1',
        equipmentNo:"",
        siteId:""
      },
      msg:"",
      show:false,
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.equipmentNo = this.selectItem.equipmentNo
    this.formCustom.type = this.selectItem.type
    this.formCustom.docksiteName = this.selectItem.docksiteName
    this.formCustom.siteId = this.selectItem.id
    this.show = true
  },
  methods: {
    status () {
      //先判断是否一代还是二代
      if(this.formCustom.type==1){
          this.siteinfo()
      }else {
          this.networksignal()
      }
    },
    cancel () {
      this.$emit("EMITXINXICOMPONENT")
    },
    EmitversionComponent (e) {
      this.formCustom.equipmentNo = e.version
    },
    networksignal () {
      let _this = this;
      let listdata = {
        equipmentNo:""+this.formCustom.equipmentNo,
        token:this.$webapi.get("token"),
        status:""+this.formCustom.status,
      }
      this.msg = "数据获取中..."
      this.$api.post('/site/order/network_signal',listdata,reset => {
        if (reset.codeId == 1) {
           if(this.formCustom.status=='00'){
             this.msg = "信息强度"+ reset.resData
           }else {
             this.msg = _this.$webapi.getitemkey(reset.resData)
           }
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    siteinfo () {
      let _this = this;
      let listdata = {
        siteId:parseInt(this.formCustom.siteId),
        token:this.$webapi.get("token"),
        type:parseInt(this.formCustom.status),
      }
      this.msg = "数据获取中..."
      this.$api.post('/bicycle/order/site/info',listdata,reset => {
        if (reset.codeId == 1) {
           if(this.formCustom.status==1){
             this.msg = "信息强度"+ reset.resData
           }else {
             this.msg = _this.$webapi.getitemkey(reset.resData)
           }
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    opensite () {
      let _this = this;
      if(this.formCustom.activate==0){
        this.$webapi.getMessinfo({
          title:"确定站点【"+this.formCustom.item.docksiteName+"】要关闭吗",
          yes () {
              _this.deletepost()
          }
        })
      }else {
        this.$webapi.getMessinfo({
          title:"确定站点【"+this.formCustom.item.docksiteName+"】要开启吗",
          yes () {
              _this.activate()
          }
        })
      }
    },
    reboot () {
      let _this = this;
      let listdata = {
        equipmentNo:""+this.formCustom.equipmentNo,
        token:this.$webapi.get("token")
      }
      this.$api.post('/site/order/reboot',listdata,reset => {
        if (reset.codeId == 1) {
          _this.cancel()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    activate () {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            id:""+this.formCustom.item.id,
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/bicycledocksite/activate',listdata,reset => {
        if (reset.codeId == 1) {
          _this.cancel()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    deletepost () {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            id:""+this.formCustom.item.id,
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/bicycledocksite/delete',listdata,reset => {
        if (reset.codeId == 1) {
          _this.cancel()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    handleSubmit () {
      let _this = this;
      let listdata = {
        equipmentNo:""+this.formCustom.equipmentNo,
        id:""+this.formCustom.item.id,
        token:this.$webapi.get("token")
      }
      this.$api.post('/site/order/upgrade',listdata,reset => {
        if (reset.codeId == 1) {
          _this.cancel()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    list () {
      let listdata = {
        maintainSiteId:this.setectitem.id,
        token:this.$webapi.get("token"),
        pageNo:this.pageData.pageCurrent,
        pageSize:this.pageData.pagesize
      }
      let _this = this;
      this.$api.get('/district/find/by_maintainSiteId',listdata,reset => {
        if (reset.codeId == 1) {
          _this.data = reset.resData.list
          _this.pageData.totalCount = reset.resData.totalCount
          _this.pageshow = true
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    pageComponentDate(e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
