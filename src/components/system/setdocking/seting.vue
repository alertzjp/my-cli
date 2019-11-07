<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
            <span>站点模块【{{formCustom.docksiteName}}】</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
               <Row v-if="formCustom.sitetype==1">
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="参数类型">
                        <Select v-model="formCustom.type">
                            <Option value="" >全部</Option>
                            <Option value="0">设置重复上传次数</Option>
                            <Option value="1">设置过滤时间</Option>
                            <Option value="2">设置警戒电压</Option>
                            <Option value="3">ip地址端口号</Option>
                            <Option value="4">设置模块</Option>
                            <Option value="5">心跳间隔时间</Option>
                        </Select>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                      <FormItem label="内容">
                         <Input v-model="formCustom.content"></Input>
                         <span v-if="formCustom.type==2">设置警戒电压110-126之间</span>
                         <span v-if="formCustom.type==3">ip地址端口号ip:port  案例*.*.*.*:8080</span>
                         <span v-if="formCustom.type==4">是设置模块一次上传服务卡号列表中最大的卡号个数，默认是98，即100个卡号（一般这个个数只能降低，不能再高了）</span>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem label="">
                           <Button type="primary" :loading="loading" @click="handleSubmit()">保存</Button>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
               <Row v-if="formCustom.sitetype==2">
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="参数类型">
                        <Select v-model="formCustom.type">
                            <Option value="0">设置重复上传次数</Option>
                            <Option value="1">设置过滤时间</Option>
                            <Option value="2">设置警戒电压</Option>
                            <Option value="3">ip地址端口号</Option>
                            <Option value="4">设置模块</Option>
                            <Option value="5">心跳间隔时间</Option>
                            <Option value="6">设置URl</Option>
                            <Option value="7">设置二代桩</Option>
                            <Option value="8">设置盘点统计</Option>
                        </Select>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="formCustom.type!=6 &&formCustom.type!=3">
                      <FormItem label="内容">
                         <Input v-model="formCustom.value"></Input>
                         <span v-if="formCustom.type==2">设置警戒电压110-126之间</span>
                         <span v-if="formCustom.type==4">是设置模块一次上传服务卡号列表中最大的卡号个数，默认是98，即100个卡号（一般这个个数只能降低，不能再高了）</span>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="formCustom.type==6">
                      <FormItem label="内容">
                         <Input v-model="formCustom.url"></Input>
                         <span> url,域名加端口 </span>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24" v-if="formCustom.type==3">
                      <FormItem label="内容">
                         <span><Input v-model="formCustom.ip" style="width:150px"></Input></span>
                         <span><Input v-model="formCustom.port" style="width:80px"></Input></span>
                         <div>ip地址端口号ip:port  案例*.*.*.*:8080</div>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem label="">
                           <Button type="primary" :loading="loading" @click="handleSubmit01()">保存</Button>
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
          sitetype:1,
          docksiteName:"",
          type:'',
          equipmentNo:"",
          siteId:"",
          content:"",
          url:"",
          value:"",
          ip:"",
          port:""
      },
      data:[],
      show:false,
      loading:false
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.sitetype =this.setectitem.type
    this.formCustom.docksiteName =this.setectitem.docksiteName || ""
    this.formCustom.siteId =this.setectitem.id || ""
    this.formCustom.equipmentNo =this.setectitem.equipmentNo || ""
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
      if(this.formCustom.type==""){
        this.$Message.error("参数类型没有选择")
        return
      }
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token"),
          siteId:this.formCustom.siteId,
          type:this.formCustom.type,
          content:this.formCustom.content
      }
      _this.loading = true
      this.$api.post('/bicycle/order/site/paramsSetting',listdata,reset => {
        _this.loading = false
        if (reset.codeId == 1) {
          _this.$emit("EmitversionComponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      },failure=>{
        _this.loading = false
      })
    },

    handleSubmit01 () {
      if(this.formCustom.type==""){
        this.$Message.error("参数类型没有选择")
        return
      }
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token"),
          equipmentNo:this.formCustom.equipmentNo,
          type:this.formCustom.type,
      }
      if(this.formCustom.type==6){
        listdata.url = this.formCustom.url
      }else if (this.formCustom.type==3) {
        listdata.ip = this.formCustom.ip
        listdata.port = this.formCustom.port
      }else {
        listdata.value = parseInt(this.formCustom.value)
      }
      _this.loading = true
      this.$api.post('/site/order/set_up',listdata,reset => {
        _this.loading = false
        if (reset.codeId == 1) {
          _this.$emit("EmitversionComponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      },failure=>{
        _this.loading = false
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
