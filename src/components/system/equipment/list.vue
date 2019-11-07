<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
         <Form ref="formCustom" :model="formCustom" :label-width="80">
             <Row>              
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="站点名称">
                          <site-component @EmitDocksiteComponent="EmitDocksiteComponent" ></site-component>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="时间">
                           <time-component @timeEmit="timeEmit" ></time-component>
                     </FormItem>
                 </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <div class="">
                     <FormItem>
                         <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                     </FormItem>
                   </div>
                 </Col>
             </Row>
         </Form>
       </div>
       <div class="tableListOperator">
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
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
 export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    siteComponent,
    timeComponent
   },
  data () {
    return {
      loading:false,
      pageshow:false,
      setectitem:{},
      formCustom:{
          siteName:"",
          startTime:"",
          endTime:""
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '站点名称',
              key: 'siteName',
              minWidth:100,
              fixed:"left",
          },
          {
              title: '站点编号',
              key: 'siteNo',
              minWidth:100,
          },
          {
              title: '差异的车辆数',
              key: 'discrepantBicycleNum',
              minWidth:100,
          },
          {
              title: '差异的其他车辆数',
              key: 'discrepantOtherBicycleNum',
              minWidth:120,
          },
          {
              title: '差异的总数',
              key: 'discrepantTotalNum',
              minWidth:100,
          },
          {
              title: '设备车辆数',
              key: 'equipmentBicycleNum',
              minWidth:100,
          },
          {
              title: '设备总数',
              key: 'equipmentTotalNum',
              minWidth:80,
          },
          {
              title: '设备其他总数',
              key: 'equipmentOtherBicycleTotalNum',
              minWidth:100,
          },
          {
              title: '其他车辆总数',
              key: 'otherBicycleTotalNum',
              minWidth:100,
          },
          {
              title: '总数',
              key: 'totalNum',
              minWidth:70,
          },
          {
              title: '时间',
              key: 'totalNum',
              minWidth:100,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
      ],
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    handleadd () {
      this.addshow = true
    },
    handleedit () {
      this.loginshow = true
    },
    EmitDocksiteComponent (e) {
      this.formCustom.siteName = e.docksiteName
    },
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[0]
    },
    EmitComponent (e) {
      this.addshow = false
      this.editshow = false
      this.loginshow = false
      if(e) {
        this.list()
      }
    },
    supplement (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        id:parseInt(e.id)
      }
      this.$api.post("/bicycle_entering_company/supplement", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    emitautocomponent (e) {
      if(e){
        let _this = this;
        let listdata = {
          token:this.$webapi.get('token'),
          auditOpinion:e.auditOpinion,
          status:e.status,
          id:this.setectitem.id
        }
        this.$api.post("/bicycle_entering_company/audit", listdata, reset => {
          if (reset.codeId == 1) {
            _this.autoshow = false
            _this.list()
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      }else {
        this.autoshow = false
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
      this.$api.post("/bicycleLocation/list", listdata, reset => {
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
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        siteName: this.formCustom.siteName,
        startTime: this.formCustom.startTime,
        endTime: this.formCustom.endTime,
      }
      let _this =  this
      this.$api.get('/bicycle_difference_record_day/page',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 0) {
          let data = reset.resData.list
           _this.data = data
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
