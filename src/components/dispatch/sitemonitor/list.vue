<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
     </div>
     <!--操作按钮-->
    <div class="tableListOperator">
        <Button type="primary" icon="md-add" size="large"  @click="add" v-if="$hasPerm('/site_monitor_parameter/add') && data.length<1">新增</Button>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                 <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
   <add-component v-if="addshow" :type="type" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></add-component>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import addComponent from './add.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    addComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addshow:false,
      relevancshow:false,
      maintainshow:false,
      type:1,
      setlectitem:{},
      formCustom:{
         maintainerName:"",
         status:"",
         outSiteName:"",
         inSiteName:"",
         startTime:"",
         endTime:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '最小车辆数',
              key: 'minBicycleNum',
              minWidth:100,
          },
          {
              title: '最大车辆数',
              key: 'maxBicycleNum',
              minWidth:100,
          },
          {
              title: '最小车辆百分比(%)',
              key: 'minBicyclePercentage',
              minWidth:150,
          },
          {
              title: '最大车辆百分比(%)',
              key: 'maxBicyclePercentage',
              minWidth:150,
          },
          {
              title: '最小参考参数',
              key: 'inSiteName',
              minWidth:150,
              render: (h, params) => {
                let str = params.row.minPriority==1?"数量":params.row.minPriority==2?"百分比":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '最大参考参数',
              key: 'expectedNum',
              minWidth:150,
              render: (h, params) => {
                let str = params.row.maxPriority==1?"数量":params.row.maxPriority==2?"百分比":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '创建时间',sortable: true,
              key: 'createdAt',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          // {
          //     title: '更新时间',
          //     key: 'createdAt',
          //     minWidth:90,
          //     render: (h, params) => {
          //       let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
          //       return h('div', [
          //          h('span', str)
          //      ])
          //   }
          // },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:120,
              fixed:"right",
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
                              marginTop: '5px',
                              display:_this.$hasPerm('/site_monitor_parameter/update')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.setlectitem = params.row
                                 _this.type = 2
                                 _this.addshow = true
                              }
                          }
                      }, '编辑')
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    exportfile () {
      let _this=this;
      let listdata = this.formCustom
          listdata.token = this.$webapi.get('token')
      this.$api.get('/bicycle_dispatch_sheet/export',listdata,reset => {
        if(reset.codeId==undefined || reset.codeId==null){
          window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/bicycle_dispatch_sheet/export',listdata)
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    add () {
       this.type = 1
       this.addshow = true
    },
    complete (e) {
      let _this=this;
      let listdata={
        id:e.id,
        token:this.$webapi.get('token')
      }
      this.$api.post('/bicycle_dispatch_sheet/complete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    emitcomponent (e) {
      this.addshow = false
      this.editshow = false
      this.relevancshow = false
      if(e){
        this.list()
      }
    },
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    outSiteName (e) {
      this.formCustom.outSiteName = e.docksiteName
    },
    inSiteName (e) {
      this.formCustom.inSiteName = e.docksiteName
    },
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    delpost(e){
      let _this=this;
      let listdata={
        id:e.id,
        token:this.$webapi.get('token')
      }
      this.$api.post('/bicycle_dispatch_sheet/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token')
     }
      let _this =  this
      this.$api.get('/site_monitor_parameter/get',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
           _this.data = []
           if(reset.resData){
             _this.data.push(reset.resData)
           }
        }
        else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
