<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>站点【{{formCustom.item.docksiteName}}】设置</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
              <Row>
                 <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <FormItem label="站点操作选择">
                     <Select v-model="formCustom.type">
                        <Option value="1">站点关闭/开启</Option>
                        <!-- <Option value="2">站点升级</Option>
                        <Option value="3">站点重启</Option> -->
                       </Select>
                   </FormItem>
                 </Col>
              </Row>
               <Row v-if="formCustom.type==1">
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem>
                         <p>当前站点状态:【{{formCustom.item.status==1?"正常":"关闭"}}】</p>
                         <!-- <RadioGroup v-model="formCustom.activate">
                             <Radio label="0">关闭站点</Radio>
                             <Radio label="1">开启站点</Radio>
                         </RadioGroup> -->
                       </FormItem>
                     </div>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem >
                          <Button :type="formCustom.activate==0?'error':'primary'" @click="opensite()">
                            {{formCustom.activate==0?"关闭站点":"开启站点"}}
                          </Button>
                      </FormItem>
                   </Col>
               </Row>
               <Row v-if="formCustom.type==2">
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem>
                         <versionset-component @EmitversionComponent="EmitversionComponent"></versionset-component>
                       </FormItem>
                     </div>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem >
                          <Button type="primary" @click="handleSubmit()">确定升级</Button>
                      </FormItem>
                   </Col>
               </Row>
               <Row v-if="formCustom.type==3">
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem>
                       <versionset-component @EmitversionComponent="EmitversionComponent"></versionset-component>
                      </FormItem>
                      <FormItem >
                          <Button type="primary" @click="reboot()">站点重启</Button>
                      </FormItem>
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
        activate:'0', //1开启0关闭
        type:'1',
        equipmentNo:"",
        item:{}
      },
      show:true,
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.item = this.selectItem
    this.formCustom.activate = this.selectItem.status==1?0:1
  },
  methods: {
    cancel (e) {
      this.$emit("bikeDockSitecomponent",e?true:false)
    },
    EmitversionComponent (e) {
      this.formCustom.equipmentNo = e.version
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
          _this.cancel(true)
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
          _this.cancel(true)
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
          _this.cancel(true)
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
