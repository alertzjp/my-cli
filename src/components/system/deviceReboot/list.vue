<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bicycle_no" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="站点编号">
                          <Input type="text" v-model="formCustom.bicycleDocksiteNo" placeholder="请输入站点编号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="站点名称" >
                          <site-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteno"></site-component>
                       </FormItem>
                   </Col>
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆型号" >
                         <Input type="text" v-model="formCustom.bikeModel"></Input>
                       </FormItem>
                   </Col> -->

                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车架号">
                           <Input type="text" v-model="formCustom.enquiriesNo" placeholder="请输入车架号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车锁编号">
                           <Input type="text" v-model="formCustom.lockNo" placeholder="请输入车锁编号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="电子标签">
                           <Input type="text" v-model="formCustom.bicycleSensorsNo" placeholder="请输入电子标签"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆状态" >
                         <Select v-model="formCustom.bicycle_status" placeholder="请选择车辆状态">
                               <Option value="">全部</Option>
                              <Option value="0">待投放</Option>' +
                              '<Option value="1">可租</Option>' +
                              '<Option value="2">骑行</Option>' +
                              '<Option value="3">维护开锁</Option>' +
                              '<Option value="4">报废</Option>' +
                              '<Option value="5">车辆故障</Option>' +
                              '<Option value="6">带回</Option>' +
                              '<Option value="7">维修完成</Option>' +
                              '<Option value="8">临时停车</Option>' +
                              '<Option value="9">调度</Option>' +
                         </Select>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <div class="">
                       <FormItem>
                           <span class="Toolbar70">
                             <Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent>
                             <!-- <Buttoncomponent title="展开"  icon="ios-arrow-down" @emitButton="tabopen" v-if="!tabshow"></Buttoncomponent>
                             <Buttoncomponent title="收起"  icon="ios-arrow-up" @emitButton="tabopen" v-else></Buttoncomponent> -->
                           </span>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
       </div>
        <!--操作按钮-->
       <div class="tableListOperator">
         <Buttoncomponent title="设备重启"   @emitButton="lock" v-if="$hasPerm('/bicycle/order/deviceReboot')"></Buttoncomponent>
         <Buttoncomponent title="获取锁状态"   @emitButton="GETLOCK" v-if="$hasPerm('/bicycle/order/getLockStatus')"></Buttoncomponent>
         <Buttoncomponent title="远程升级"   @emitButton="UPDATELOCK" v-if="$hasPerm('/bicycle/order/remoteUpgrade')"></Buttoncomponent>
         <Buttoncomponent title="更改服务器地址"   @emitButton="SETINGSEVER"v-if="$hasPerm('/bicycle/order/updateServerAddress')"></Buttoncomponent>
         <Buttoncomponent title="设置GPS定位"   @emitButton="SETGPS"  v-if="$hasPerm('/bicycle/order/setGPSReturn')"></Buttoncomponent>
       </div>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
      <lock-component v-if="SETINGSEVERSHOW"  @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></lock-component>
      <setgps-component v-if="SETGPSSHOW"  @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></setgps-component>
      <setlock-component v-if="SETLOCKSHOW" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></setlock-component>
      <setopen-component v-if="SETOPENSHOW" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></setopen-component>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import Pages from '../../pub/page.vue'
import lockComponent from "./lock.vue"
import setlockComponent from "./setlock.vue"
import setopenComponent from "./setopen.vue"
import setgpsComponent from "./setgps.vue"
export default {
  name: "",
  components:{
    tableComponent,
    siteComponent,
    Paging:Pages,
    lockComponent,
    setgpsComponent,
    setlockComponent,
    setopenComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      tabshow:false,
      setectitem:{},
      SETGPSSHOW:false,
      SETOPENSHOW:false,
      SETINGSEVERSHOW:false,
      SETLOCKSHOW:false,
      formCustom:{
        lockNo:'',
        bicycleSensorsNo:'',
        bicycle_no:'',
        terminalNo:'',
        enquiriesNo:'',
        bicycle_status:'',
        bicycleDocksiteNo:"",
        bicycleDocksiteName:"",
        docksiteno:"",
        pageCurrent:1,
        pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
        {
           title: ' ',
           align:'center',
           key: 'checkBox',
           minWidth:50,
           render:(h,params)=>{
               return h('div',[
                   h('Checkbox',{
                       props:{
                           value:params.row.checkBox,
                           size:'large'
                       },
                       on:{
                           'on-change':(e)=>{
                               this.data.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                                   this.$set(items,'checkBox',false)
                               });
                               this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                               e?this.setectitem = this.data[params.index]:this.setectitem=[];
                               this.setectitem = this.data[params.index]
                           }
                       }
                   })
               ])
           }
          },
          {
              title: '车辆二维码',
              key: 'bicycleNo',
              minWidth:100,
          },
          {
              title: '车锁编号',
              minWidth:100,
              key: 'lockNo',
          },
          {
              title: '站点编号',
              minWidth:100,
              key: 'bicycleDocksiteNo',
          },
          {
              title: '站点名称',
              minWidth:100,
              key: 'bicycleDocksiteName',
          },
          {
              title: '电子标签',
              minWidth:100,
              key: 'bicycleSensorsNo',
          },
          {
              title: '车架号',
              minWidth:100,
              key: 'enquiriesNo',
          },
          {
              title: '经度',
              minWidth:100,
              key: 'gpsLongitude',
          },
          {
              title: '纬度',
              minWidth:100,
              key: 'gpsLatitude',
          },
          {
              title: '车辆状态',
              minWidth:100,
              key: 'status',
              render: (h, params) => {
               let str= this.$status.bicycleStatus(params.row.bicycleStatus)
               return h('div', [
                  h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:250,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicycle/order/setWhetherAreaLock')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setectitem = this.data[params.index]
                                this.SETLOCKSHOW = true
                              }
                          }
                      }, '设置锁'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicycle/order/updateVibrationSetting')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setectitem = this.data[params.index]
                                this.SETOPENSHOW = true
                              }
                          }
                      }, '设置震动开关')
                  ]);
              }
          }
      ],
    }
  },
  watch:{
    formCustom:{
      handler (val,oldval) {
        if(val){
          let obj={
               path:this.$route.path,
               searchobj:this.formCustom
          }
          this.$store.dispatch('savesearchvla',obj)
        }
      },
      deep:true
    }
  },
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  mounted() {
    let searchList=JSON.parse(this.$webapi.get('searchList'))
    if(searchList){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;
          if(vla.searchobj.pageCurrent){
               this.pageData.pageCurrent = vla.searchobj.pageCurrent
            }
            if(vla.searchobj.pagesize){
              this.pageData.pagesize = vla.searchobj.pagesize
            }
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/system/deviceReboot/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    tabopen () {
      this.tabshow = !this.tabshow
    },
    huanche () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      this.huancheshow = true
    },
    exportfile () {
      let _this = this
        let data = {
          data:this.formCustom
        }
        data.data.token = this.$webapi.get("token")
      this.$api.get('/bicycle/list_export',data,reset => {
        if(reset.code!==undefined && reset.code!==null){
              _this.$netcode.getApiCode(reset)
          }else {
            window.location.href = _this.$webapicommon + "/bicycle/list_export?data=" + encodeURI(JSON.stringify(data.data))
         }
      })
    },
    EmitDocksiteComponent (e) {
      this.formCustom.bicycleDocksiteName = e.docksiteName
      this.formCustom.docksiteno = e.docksiteNo
    },
    lock () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        lockId:this.setectitem.lockId?parseInt(this.setectitem.lockId):""
      }
      this.$webapi.getMessinfo({
        title:"确定要重启吗",
        yes () {
          _this.$api.post('/bicycle/order/deviceReboot',data,reset => {
              if (reset.codeId === 1) {
                 _this.$Message.success("成功")
              }else{
                _this.$netcode.getApiCode(reset)
              }
          })
        },
        cancel(){
          _this.setectitem = {}
          _this.list()
        }
      })
    },
    GETLOCK () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        lockId:this.setectitem.lockId?parseInt(this.setectitem.lockId):""
      }
      this.$api.post('/bicycle/order/getLockStatus',data,reset => {
          if (reset.codeId === 1) {
             _this.$Message.success("当前的【"+this.setectitem.bicycleNo+"】车锁状态:"+reset.resData)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    UPDATELOCK () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        lockId:this.setectitem.lockId?parseInt(this.setectitem.lockId):""
      }
      this.$webapi.getMessinfo({
        title:"确定【"+this.setectitem.bicycleNo+"】要升级吗",
        yes () {
          _this.$api.post('/bicycle/order/remoteUpgrade',data,reset => {
              if (reset.codeId === 1) {
                 _this.$Message.success("升级成功")
              }else{
                _this.$netcode.getApiCode(reset)
              }
          })
        },
        cancel(){
          _this.setectitem = {}
          _this.list()
        }
      })
    },
    zuche () {
      let _this = this;
      if(this.ifshow()){
        this.$webapi.getMessinfo({
          title:"确定要调整租车状态吗？",
          yes () {
            _this.zuchepost()
          }
        })
      }else{
        this.$Message.error("先选择一项")
      }
    },
    zuchepost () {
      let _this = this;
      let data = {
        token:this.$webapi.get("token"),
        bicycleNo:this.setectitem.bicycleNo
      }
      this.$api.post('/bicycle/updateByNo',data,reset => {
          if (reset.codeId === 1) {
             _this.$Message.info(reset.resData)
             _this.list()
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    editBicycle () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      this.forcepowershow = true
    },
    SETINGSEVER () {
      if(this.ifshow()){
        this.SETINGSEVERSHOW = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    SETGPS () {
      if(this.ifshow()){
        this.SETGPSSHOW = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    upgradeapp () {
      if(this.ifshow()){
        this.upgradeappshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    loguploadset () {
      if(this.ifshow()){
        this.loguploadsetshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    ifshow () {
       return this.setectitem.id?true:false
    },
    lockemitcomponent (e) {
      this.SETINGSEVERSHOW = false
      this.SETGPSSHOW = false
      this.SETLOCKSHOW = false
      this.SETOPENSHOW = false
      this.setectitem = {}
      this.list()
    },
    fenceEmitComponent (e) {
      this.formCustom.fenceId = e.id
    },
    pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pagesize = e.pagesize
        this.list()
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    baofeicomponent () {
      this.baofeishow = false
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        data:{
          lockNo:this.formCustom.lockNo,
          bicycleSensorsNo:this.formCustom.bicycleSensorsNo,
          bicycle_no:this.formCustom.bicycle_no,
          terminalNo:this.formCustom.terminalNo,
          enquiriesNo:this.formCustom.enquiriesNo,
          bicycle_status:this.formCustom.bicycle_status,
          bicycleDocksiteNo:this.formCustom.bicycleDocksiteNo,
          bicycleDocksiteName:this.formCustom.bicycleDocksiteName,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
        }
      }
      let _this =  this
      this.$api.get('/bicycle/listByParamSetting',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = []
          _this.pageData.totalCount = 0
          _this.pageshow = true
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
