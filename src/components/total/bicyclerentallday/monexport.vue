<template>
  <div id="">
    <Modal v-model="show" width="800" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">【{{formCustom.time}}】明细列表</div>
      <Row>
         <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="mt20">
                  <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                  <!-- <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component> -->
              </div>
         </Col>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent,
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    selectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:false,
      loading:false,
      formCustom:{
        id:"",
        dockSiteNo:"",
        time:""
      },
      data:[],
      columns:[
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
              title: '租车方式',
              key: 'docksiteNo',
              minWidth:100,
              render:(h,params)=>{
                  let str = params.row.scanType==0?"手机扫码":params.row.scanType==1?"银行卡":"公交卡"
                  return h('div',str)
              }
          },
          {
              title: '车辆总数',
              key: 'bicycleDocksiteNo',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.bicycleSum)
                return h('div',str)
              }
          },
          {
           title: '借车次数',
           align: 'center',
           children: [
               {
                   title: '次数',
                   key: 'rentSum',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = this.$webapi.GETDISNUM(params.row.rentSum)
                     return h('div',str)
                   }
                },
               {
                   title: '占比',
                   key: 'age',
                   align: 'center',
                   minWidth: 100,
                   render:(h,params) => {
                     let str = this.$webapi.GETBAIFEI(params.row.scanTypeRatio)
                     return h('div',str)
                   }
                }
           ]
         },
          {
              title: '归还次数',
              key: 'operatorName',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETDISNUM(params.row.returnSum)
                return h('div',str)
              }
          },
          {
              title: '收费次数',
              key: 'totalPileNum',
              minWidth:100,
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
              key: 'freeUse',
              minWidth:100,
              render:(h,params) => {
                let str = this.$webapi.GETBAIFEN(params.row.freeUse)
                return h('div',str)
              }
          },
          // {
          //     title: '累计次数',
          //     key: 'accumulativeSum',
          //     minWidth:100,
          //     render:(h,params) => {
          //       let str = this.$webapi.GETDISNUM(params.row.accumulativeSum)
          //       return h('div',str)
          //     }
          // },
          {
              title: '累计时间',
              key: 'returnSum',
              minWidth:200,
              render:(h,params) => {
                let str = this.$webapi.GETTIMEMIN(params.row.minuteSum)
                return h('div',str)
              }
          },
          // {
          //     title: '公里数',
          //     key: 'returnSum',
          //     minWidth:100,
          //     render:(h,params) => {
          //       let str = this.$webapi.GETGONGLI(params.row.minuteSum)
          //       return h('div',str)
          //     }
          // },
          // {
          //     title: '节约油耗',
          //     key: 'returnSum',
          //     minWidth:100,
          //     render:(h,params) => {
          //       let str = this.$webapi.GETYOUHAO(params.row.minuteSum)
          //       return h('div',str)
          //     }
          // },
          // {
          //     title: '碳排放',
          //     key: 'returnSum',
          //     minWidth:100,
          //     render:(h,params) => {
          //       let str = this.$webapi.GETTAN(params.row.minuteSum)
          //       return h('div',str)
          //     }
          // },
          {
              title: '累计收费次数',
              key: 'returnSum',
              minWidth:150,
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
          // {
          //     title: '操作',
          //     key: 'returnSum',
          //     minWidth:100,
          //     fixed:"right",
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                  },
          //                 on: {
          //                     click: () => {
          //                       _this.selectitem = params.row
          //                       _this.show = true
          //                     }
          //                 }
          //             }, '明细'),
          //         ]);
          //     }
          // },
      ],
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
     }
  },
  mounted() {
    //do something after mounting vue instance
     this.formCustom.time = this.$webapi.gettime('date',this.selectitem.sumDate/1000)
     this.show = true
     this.list()
   },
  methods: {
    cancel(e) {
      this.$emit("emitcomponent",e?true:false)
    },
    list () {
      let listdata = {
        token:this.$webapi.get('token'),
        time:this.formCustom.time
     }
      let _this =  this
      this.$api.get('/new_statistic/rent_day_detail',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData || []
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
