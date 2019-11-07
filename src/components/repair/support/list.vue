<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bike_no" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="维修完成时间">
                           <DatePicker type="daterange" @on-change="oktime" :value="timearr" placeholder="维修完成时间" style="width: 100%"></DatePicker>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <div class="">
                       <FormItem>
                           <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                           <Button type="error" @click="$router.back(-1)" v-if="formCustom.bike_no">返回</Button>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
       </div>
        <!--操作按钮-->
       <div class="tableListOperator">
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
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      timearr:[],
      formCustom:{
        bike_no:"",
        fault_type:"",
        startTime:"",
        endTime:"",
        maintain_name:"",
        bike_type:'1',
        dockSiteName:"",
        status:"2",
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
              title: '车辆二维码',
              minWidth:80,
              key: 'bikeNo',
          },
          // {
          //     title: '车辆型号',
          //     minWidth:100,
          //     key: 'bikeModel',
          // },
          {
              title: '车辆报障时间',
              minWidth:100,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆带回时间',
              minWidth:100,
              key: 'backTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.backTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆故障类型',
              minWidth:100,
              key: 'bikeStatus',
              render: (h, params) => {
                let str = params.row.faultType==1?"结构故障":params.row.faultType==2?"电器故障":"其他"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '其他问题描述',
              minWidth:120,
              key: 'addedFault',
          },
          {
              title: '其他',
              minWidth:60,
              key: 'other',
          },
          {
              title: '实际维修项目',
              minWidth:100,
              key: 'realMaintain',
          },
          {
              title: '更换配件',
              minWidth:80,
              key: 'replacePart',
          },
          {
              title: '维修完成时间',
              key: 'overTime',
              minWidth:100,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.overTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '补充描述',
          //     minWidth:80,
          //     key: 'other'
          // },
          {
              title: '维修人',
              minWidth:60,
              key: 'maintainId'
          },
          {
              title: '填单人',
              minWidth:60,
              key: 'fillId',
          },
          {
              title: '备注',
              minWidth:60,
              key: 'remark',
          },
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.formCustom.bike_no = this.$route.query.bikeNo || ""
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/repair/support"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    oktime (e) {
      let [x,y] = e
        this.formCustom.startTime = x
        this.formCustom.endTime = y
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        data:{
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          bike_no:this.formCustom.bike_no,
          // fault_type:this.formCustom.fault_type,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          // maintain_name:this.formCustom.maintain_name,
          bike_type:this.formCustom.bike_type,
          // dockSiteName:this.formCustom.dockSiteName,
          status:this.formCustom.status
        }
      }
      let _this =  this
      this.$api.get('/repairingBicycle/list',listdata,reset => {
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
