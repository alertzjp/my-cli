<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" :xxl="6">
                  <FormItem label="统计时间">
                    <time-component @timeEmit="timeEmit" type="2"></time-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <!--操作按钮-->
    <div class="tableListOperator">
        <Buttoncomponent title="导出"  icon="md-arrow-down" @emitButton="handleeport"  :loading="exportloading" v-if="$hasPerm('/statistic/export_rent_day')"></Buttoncomponent>
      </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <table-component :loading="loading" :columnsdata="columns" :datas="dataers"></table-component>
            <div class="mt20">
                 <table-component :loading="loading" :columnsdata="columnsdata" :datas="data"></table-component>
                 <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
   <monexport-component v-if="show" :selectitem="selectitem" @emitcomponent="emitcomponent"></monexport-component>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
import monexportComponent from './monexport.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    siteComponent,
    timeComponent,
    monexportComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      show:false,
      exportloading:false,
      type:1,
      selectitem:{},
      formCustom:{
         dockSiteNo:"",
         startTime:"",
         endTime:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      dataers:[],
      columns:[
          {
              title: '车辆总数',
              key: 'bicycleSum',
              minWidth:80,
              fixed:"left"
          },
          {
           title: '借车次数',
           align: 'center',
           children: [
               {
                   title: '总次数',
                   key: 'rentSum',
                   align: 'center',
                   minWidth: 80,
                   render:(h,params) => {
                     let str = this.$webapi.GETDISNUM(params.row.rentSum)
                     return h('div',str)
                   }
                },
               {
                   title: '手机APP(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = ""+(params.row.rentSum!=0?(((params.row.scanTypeRatio0/params.row.rentSum).toFixed(4))*100).toFixed(2):"0")+"%"
                     return h('div',str)
                   }
                },
               {
                   title: '银行卡(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = ""+(params.row.rentSum!=0?(((params.row.scanTypeRatio1/params.row.rentSum).toFixed(4))*100).toFixed(2):"0")+"%"
                     return h('div',str)
                   }
                },
               {
                   title: '公交卡(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let num = (params.row.rentSum!=0?(((params.row.scanTypeRatio0/params.row.rentSum).toFixed(4))*100).toFixed(2):"0")
                     let bank = (params.row.rentSum!=0?(((params.row.scanTypeRatio1/params.row.rentSum).toFixed(4))*100).toFixed(2):"0")
                     let str = (100-(parseFloat(num)+parseFloat(bank))).toFixed(2) +"%"
                     return h('div',str)
                   }
                }
           ]
         },
          {
              title: '归还次数',
              key: 'returnSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.returnSum)
                return h('div',str)
              }
          },
          {
              title: '收费次数',
              key: 'chargeCount',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.chargeCount)
                return h('div',str)
              }
          },
          {
           title: '收费金额(元)',
           align: 'center',
           children: [
               {
                   title: '总收费',
                   key: 'charge',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = this.$webapi.GETDISNUM(params.row.charge)
                     return h('div',str)
                   }
                },
               {
                   title: '手机APP(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = ""+(params.row.charge!=0?(((params.row.charge0/params.row.charge).toFixed(4))*100).toFixed(2):"0")+"%"
                     return h('div',str)
                   }
                },
               {
                   title: '银行卡(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = ""+(params.row.charge!=0?(((params.row.charge1/params.row.charge).toFixed(4))*100).toFixed(2):"0")+"%"
                     return h('div',str)
                   }
                },
               {
                   title: '公交卡(占比)',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let num = (params.row.charge!=0?(((params.row.charge0/params.row.charge).toFixed(4))*100).toFixed(2):"0")
                     let bank = (params.row.charge!=0?(((params.row.charge1/params.row.charge).toFixed(4))*100).toFixed(2):"0")
                     let str = (100-(parseFloat(num)+parseFloat(bank))).toFixed(2) +"%"
                     return h('div',str)
                   }
                }
           ]
         },
          {
              title: '出行使用率',
              key: 'usageRate',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.usageRate)
                return h('div',str)
              }
          },
          {
              title: '出行免费使用率',
              key: 'returnSum',
              minWidth:120,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.freeUse)
                return h('div',str)
              }
          },
          {
              title: '总累计次数',
              key: 'returnSum',
              minWidth:150,
              render:(h,params) => {
                 let str = this.$webapi.GETDISNUM(params.row.accumulativeSum)
                return h('div',str)
              }
          },
          {
              title: '累计时间',
              key: 'returnSum',
              minWidth:200,
              render:(h,params) => {
                 let str = this.$webapi.GETTIMEMIN(params.row.minuteSum)
                return h('div',str)
              }
          },
          {
              title: '累计收费次数',
              key: 'returnSum',
              minWidth:120,
              render:(h,params) => {
                 let str = this.$webapi.GETDISNUM(params.row.chargeCountSum)
                return h('div',str)
              }
          },
          {
              title: '累计收费金额(元)',
              key: 'returnSum',
              minWidth:150,
              render:(h,params) => {
                 let str = this.$webapi.GETDISNUM(params.row.chargeSum)
                return h('div',str)
              }
          },
      ],
      data:[],
      columnsdata:[
          {
              title: '时间',
              key: 'docksiteNo',
              minWidth:100,
              fixed:"left",
              render:(h,params)=>{
                  let str = this.$webapi.gettime('date',params.row.sumDate/1000)
                  return h('div',str)
              }
          },
          {
              title: '车辆总数',
              key: 'bicycleDocksiteNo',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.bicycleSum)
                return h('div',str)
              }
          },
          {
              title: '借车次数',
              key: 'bicycleDocksiteName',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.rentSum)
                return h('div',str)
              }
          },
          {
              title: '归还次数',
              key: 'operatorName',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.returnSum)
                return h('div',str)
              }
          },
          {
              title: '收费次数',
              key: 'totalPileNum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.chargeCount)
                return h('div',str)
              }
          },
          {
              title: '收费金额(元)',
              key: 'rentSum',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.charge)
                return h('div',str)
              }
          },
          {
              title: '单车使用率',
              key: 'returnSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.rentSum/params.row.bicycleSum)
                return h('div',str)
              }
          },
          {
              title: '出行使用率',
              key: 'usageRate',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.usageRate)
                return h('div',str)
              }
          },
          {
              title: '出行免费使用率',
              key: 'freeUse',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.freeUse)
                return h('div',str)
              }
          },
          {
              title: '累计次数',
              key: 'accumulativeSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.accumulativeSum)
                return h('div',str)
              }
          },
          {
              title: '累计时间',
              key: 'returnSum',
              minWidth:200,
              render:(h,params) => {
                let str = this.$webapi.GETTIMEMIN(params.row.minuteSum)
                return h('div',str)
              }
          },
          {
              title: '公里数',
              key: 'returnSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETGONGLI(params.row.minuteSum)
                return h('div',str)
              }
          },
          {
              title: '节约油耗',
              key: 'returnSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETYOUHAO(params.row.minuteSum)
                return h('div',str)
              }
          },
          {
              title: '碳排放',
              key: 'returnSum',
              minWidth:80,
              render:(h,params) => {
                let str = this.$webapi.GETTAN(params.row.minuteSum)
                return h('div',str)
              }
          },
          {
              title: '累计收费次数',
              key: 'returnSum',
              minWidth:120,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.chargeCountSum)
                return h('div',str)
              }
          },
          {
              title: '累计收费金额(元)',
              key: 'returnSum',
              minWidth:150,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.chargeSum)
                return h('div',str)
              }
          },
          {
              title: '操作',
              key: 'returnSum',
              minWidth:100,
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
                              display:_this.$hasPerm('/statistic/rent_day_detail')?"":"none"
                           },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.show = true
                              }
                          }
                      }, '明细'),
                  ]);
              }
          },
      ]
    }
  },
  mounted() {
    this.list();
    this.totallist()
  },
  methods: {
    handleeport () {
       this.exportloading = true
       let listdata = {
         token:this.$webapi.get('token'),
         startTime:this.formCustom.startTime,
         endTime:this.formCustom.endTime,
         scanType:""
      }
       let _this =  this
       this.$api.get('/statistic/export_rent_day',listdata,reset => {
           this.exportloading = false
           if(reset.codeId==undefined || reset.codeId==null){
               window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/statistic/export_rent_day',listdata)
           }else {
             _this.$netcode.getApiCode(reset)
           }
       })

    },
    emitcomponent () {
      this.show = false
    },
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    outSiteName (e) {
      this.formCustom.dockSiteNo = e.docksiteNo
    },
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
      this.totallist()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
      this.totallist()
    },
    totallist () {
      let listdata = {
        token:this.$webapi.get('token'),
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
     }
      let _this =  this
      this.$api.get('/statistic/rent_sum',listdata,reset => {
        if (reset.codeId === 1) {
           _this.dataers = reset.resData.list || []
        }
        else {
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
        dockSiteNo:this.formCustom.dockSiteNo,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
     }
      let _this =  this
      this.$api.get('/statistic/bicycle_rent_day',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.loading = false
           if(reset.resData){
             _this.pageData.totalCount=reset.resData.totalCount;
             _this.pageData.pageCurrent=reset.resData.pageNo;
             _this.pageData.pagesize=reset.resData.pageSize;
           }
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
          _this.pageData=[];
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
