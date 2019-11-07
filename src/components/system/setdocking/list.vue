<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
         <Form ref="formCustom" :model="formCustom" :label-width="80">
             <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="站点编号" prop="name">
                      <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入站点编号"></Input>
                   </FormItem>
               </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="站点" prop="name">
                        <site-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteno"></site-component>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="设备号">
                         <Input type="text" v-model="formCustom.equipmentNo" placeholder="请输入设备号"></Input>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <div class="">
                     <FormItem>
                         <span class="Toolbar70">
                           <Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent>
                         </span>
                     </FormItem>
                   </div>
                 </Col>
             </Row>
         </Form>
       </div>
       <div class="tableListOperator">
         <Buttoncomponent title="批量升级"  @emitButton="exportSubmit" v-if="$hasPerm('/site/order/batchUpgrade')"></Buttoncomponent>
       </div>
        <!--操作按钮-->
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     <shengji-component v-if="shengjishow" @EmitversionComponent="EmitversionComponent" :setectitem="selectItem"></shengji-component>
     <siteseting-component v-if="siteshow" @EmitversionComponent="EmitversionComponent" :setectitem="selectItem"></siteseting-component>
     <piliang-component v-if="piliangshow" @EmitversionComponent="EmitversionComponent" :setectitem="selectItem"></piliang-component>
     <!-- <edit-component v-if="editshow" :selectItem="selectItem" @emitchargecomponent="emitchargecomponent"></edit-component> -->
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import sitesetingComponent from './seting.vue'
import shengjiComponent from './add.vue'
import piliangComponent from './piliang.vue'
 export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    siteComponent,
    sitesetingComponent,
    shengjiComponent,
    piliangComponent
   },
  data () {
    return {
      loading:false,
      pageshow:false,
      siteshow:false,
      shengjishow:false,
      piliangshow:false,
      formCustom:{
        dockSiteNo:'',
        equipmentNo:"",
        docksiteName:"",
        docksiteno:"",
        pageCurrent:1,
        pagesize:10,
      },
      selectItem:{},
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '站点编号',
              key: 'docksiteNo',
              minWidth:100,
          },
          {
              title: '站点名称',
              key: 'docksiteName',
              minWidth:100,
          },
          {
              title: '站点类型',
              key: 'timeCharge',
              minWidth:100,
              render: (h, params) => {
                let str = params.row.type==1?"一代站点":"二代站点"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '设备号',
              key: 'equipmentNo',
              minWidth:70,
          },
          {
              title: '软件版本号',
              key: 'version',
              minWidth:70,
          },
          // {
          //     title: '空闲车位数',
          //     key: 'freePileNum',
          //     minWidth:100,
          // },
          // {
          //     title: '车辆数',
          //     key: 'bikeNum',
          //     minWidth:70,
          // },
          {
              title: '地址',
              key: 'address',
              minWidth:140,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:200,
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
                              display:_this.$hasPerm('/site/order/set_up')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.selectItem = params.row
                                 _this.siteshow = true
                              }
                        }
                      }, '模块设置'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/site/order/upgrade')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectItem = params.row
                                _this.shengjishow = true
                              }
                          }
                      }, '升级'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/site/order/reboot')?"":"none"
                          },
                          on: {
                              click: () => {
                                let _this=this;
                                this.$webapi.getMessinfo({
                                title:"确定站点【"+params.row.docksiteName+"】要重启吗?",
                                  yes () {
                                      _this.reboot(params.row)
                                  }
                                })
                              }
                          }
                      }, '重启')
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
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/system/setdocking/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    exportSubmit () {
      this.piliangshow = true
    },
    addcharge () {
      this.addshow = true
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteName = e.docksiteName
      this.formCustom.docksiteno = e.docksiteNo
    },
    EmitversionComponent (e) {
      this.shengjishow = false
      this.siteshow = false
      this.piliangshow = false
      if(e){
        this.list()
      }
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
    shengji (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
        id:""
      }
      this.$api.post("/site/order/upgrade", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    reboot (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
      }
      this.$api.post("/site/order/reboot", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        data:{
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          dockSiteNo:this.formCustom.dockSiteNo,
          docksiteName:this.formCustom.docksiteName,
          equipmentNo:this.formCustom.equipmentNo
        }
      }
      let _this =  this
      this.$api.get('/bicycledocksite/list',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
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
