<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                     <FormItem label="车辆二维码">
                         <Input type="text" v-model="formCustom.bicycle_no" placeholder="请输入车辆二维码"></Input>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                      <FormItem label="站点编号">
                         <Input type="text" v-model="formCustom.bicycleDocksiteNo" placeholder="请输入站点编号"></Input>
                      </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                       <FormItem label="站点名称" prop="name">
                          <site-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteNo"></site-component>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                       <FormItem label="车架号">
                           <Input type="text" v-model="formCustom.enquiriesNo" placeholder="请输入车架号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                      <FormItem label="车锁编号">
                          <Input type="text" v-model="formCustom.lockNo" placeholder="请输入车锁编号"></Input>
                      </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                        <FormItem label="电子标签">
                            <Input type="text" v-model="formCustom.bicycleSensorsNo" placeholder="请输入电子标签"></Input>
                        </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                       <FormItem label="车辆状态" >
                         <Select v-model="formCustom.bicycle_status">
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
                              '<Option value="10">丢失</Option>' +
                         </Select>
                       </FormItem>
                   </Col>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <div class="">
                       <FormItem>
                           <span class="Toolbar70">
                             <Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent>
                             <!-- <Buttoncomponent title="展开"  icon="ios-arrow-down" @emitButton="tabopen" v-if="formCustom.IShow==0"></Buttoncomponent>
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
          <!-- <Button type="primary" @click="lock()" v-if="$hasPerm('/bicycle/order/getLockStatus')">获取锁的状态</Button> -->
          <Buttoncomponent title="调整车辆状态"  @emitButton="zuche" v-if="$hasPerm('/bicycle/updateByNo')"></Buttoncomponent>
          <Buttoncomponent title="编辑"  @emitButton="editBicycle" v-if="$hasPerm('/bicycle/update')"></Buttoncomponent>
          <Buttoncomponent title="手工还车"  @emitButton="huanche" v-if="$hasPerm('/customerBicycle/endCost')"></Buttoncomponent>
          <!-- <Buttoncomponent title="维修记录"  @emitButton="loguploadset" v-if="$hasPerm('/repairingBicycle/listByBikeNo')"></Buttoncomponent> -->
          <Buttoncomponent title="报废"  @emitButton="baofei" v-if="$hasPerm('/bicycle/scrap')"></Buttoncomponent>
          <Buttoncomponent title="导出" type="success" icon="md-arrow-down" @emitButton="exportfile" v-if="$hasPerm('/bicycle/list_export')"></Buttoncomponent>
          <!-- <Buttoncomponent title="设置不合格"  @emitButton="deletecar" v-if="$hasPerm('/bicycle/delete')" type="error"></Buttoncomponent> -->
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
      <lock-component v-if="lockshow" :lockshow="lockshow" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></lock-component>
      <editbicycle-component v-if="forcepowershow"  @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></editbicycle-component>
      <huanche-component v-if="huancheshow"  @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></huanche-component>
      <upgradeapp-component v-if="upgradeappshow" :lockshow="upgradeappshow" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></upgradeapp-component>
      <repairing-component v-if="loguploadsetshow" :lockshow="loguploadsetshow" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></repairing-component>
      <scrap-component v-if="scrapshow" :lockshow="scrapshow" @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></scrap-component>
      <baofei-component v-if="scrapviewshow"  @lockemitcomponent="lockemitcomponent" :itemdata="setectitem"></baofei-component>
      <map-component v-if="mapshow"  @mapemitcomponent="lockemitcomponent" :itemdata="setectitem"></map-component>
      <track-component v-if="trackshow"  @mapemitcomponent="lockemitcomponent" :itemdata="setectitem"></track-component>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import Pages from '../../pub/page.vue'
import lockComponent from "./lock.vue"
import repairingComponent from "./repairingbike.vue"
import editbicycleComponent from "./editbicycle.vue"
import forcepoweronComponent from "./forcepoweron.vue"
import upgradeappComponent from "./upgradeapp.vue"
import loguploadsetComponent from "./loguploadset.vue"
import scrapComponent from "./scrap.vue"
import baofeiComponent from "./baofei.vue"
import mapComponent from "./bicyclemap.vue"
import huancheComponent from "./huanche.vue"
import trackComponent from "./track.vue"
export default {
  name: "",
  components:{
    tableComponent,
    siteComponent,
    Paging:Pages,
    lockComponent,
    repairingComponent,
    editbicycleComponent,
    huancheComponent,
    upgradeappComponent,
    loguploadsetComponent,
    scrapComponent,
    baofeiComponent,
    mapComponent,
    trackComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      // tabshow:false,
      scrapviewshow:false,
      mapshow:false,
      huancheshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      trackshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      formCustom:{
        IShow:0,
        lockNo:'',
        bicycleSensorsNo:'',
        bicycle_no:'',
        enquiriesNo:'',
        bicycle_status:'',
        bicycleDocksiteNo:"",
        bicycleDocksiteName:"",
        docksiteNo:"",
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
           minWidth:40,
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
              title: '锁电量',
              minWidth:80,
              key: 'voltage',
              sortable: true
          },
          {
              title: '标签电量',
              minWidth:80,
              key: 'tagVoltage',
              sortable: true
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:200,
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                          },
                          on: {
                              click: () => {
                                if(params.row.gpsLatitude && params.row.gpsLongitude){
                                  this.setectitem = this.data[params.index]
                                  this.mapshow = true
                                }else {
                                  this.$Message.info("没有上传坐标")
                                }
                              }
                          }
                      }, '位置'),
                      // h('Button', {
                      //     props: {
                      //         type: 'primary',
                      //         size: 'default'
                      //     },
                      //     style: {
                      //         marginRight: '5px',
                      //     },
                      //     on: {
                      //         click: () => {
                      //           this.setectitem = this.data[params.index]
                      //           this.trackshow = true
                      //         }
                      //     }
                      // }, '骑行轨迹'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:this.$hasPerm('/bicycle/order/getLockStatus')?"":"none"
                          },
                          on: {
                              click: () => {
                                 this.lock(params.row)
                              }
                          }
                      }, '锁状态'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              // display:params.row.bicycleStatus==4?"":"none"
                              display:"none"
                          },
                          on: {
                              click: () => {
                                this.setectitem = this.data[params.index]
                                this.scrapviewshow = true
                              }
                          }
                      }, '报废详情')
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
    //do something after mounting vue instance
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
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/carManage/bicycle/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    tabshow (e) {
      return this.$webapi.GETTABSIZE(this.formCustom.IShow,e)
    },
    tabopen () {
      this.formCustom.IShow = this.formCustom.IShow==0?1:0
    },
    baofei () {
      if(!this.ifshow()){
        this.$Message.error("先选择一项")
        return
      }
      this.scrapshow = true
    },
    deletecar () {
        if(!this.ifshow()){
          this.$Message.error("先选择一项")
          return
        }
        let _this = this
        this.$webapi.getMessinfo({
          title:"确定要设置【"+this.setectitem.bicycleNo+"】不合格吗",
          yes () {
            let  data = {
              token:_this.$webapi.get("token"),
              id:""+_this.setectitem.id
            }
            _this.$api.post('/bicycle/delete',data,reset => {
                if (reset.codeId === 1) {
                    _this.$Message.info("设置成功")
                    _this.list()
                }else{
                  _this.$netcode.getApiCode(reset)
                }
            })
          }
        })
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
        let  data = {
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
      this.formCustom.docksiteNo = e.docksiteNo
    },
    lock (e) {
      let _this = this;
      let  data = {
        token:this.$webapi.get("token"),
        lockId:e.lockId
      }
      this.$api.post('/bicycle/order/getLockStatus',data,reset => {
          if (reset.codeId === 1) {
               _this.$Message.info("当前的锁状态:【"+reset.resData+"】")
          }else{
            _this.$netcode.getApiCode(reset)
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
      let  data = {
        token:this.$webapi.get("token"),
        bicycleNo:this.setectitem.bicycleNo
      }
      this.$api.post('/bicycle/updateByNo',data,reset => {
          if (reset.codeId === 1) {
             _this.$Message.info("调整成功")
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
    forcepoweron () {
      if(this.ifshow()){
        this.forcepoweronshow = true
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
      this.lockshow = false
      this.warningshow = false
      this.forcepowershow = false
      this.forcepoweronshow = false
      this.upgradeappshow = false
      this.loguploadsetshow = false
      this.scrapshow = false
      this.mapshow = false
      this.scrapviewshow = false
      this.huancheshow = false
      this.trackshow = false
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
      let  listdata = {
        data:{
          lockNo:this.formCustom.lockNo,
          bicycleSensorsNo:this.formCustom.bicycleSensorsNo,
          bicycle_no:this.formCustom.bicycle_no,
          enquiriesNo:this.formCustom.enquiriesNo,
          bicycle_status:this.formCustom.bicycle_status,
          bicycleDocksiteNo:this.formCustom.bicycleDocksiteNo,
          bicycleDocksiteName:this.formCustom.bicycleDocksiteName,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
        }
      }
      let  _this =  this
      this.$api.get('/bicycle/list',listdata,reset => {
        if (reset.codeId === 1) {
          let  data = reset.resData.list
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
