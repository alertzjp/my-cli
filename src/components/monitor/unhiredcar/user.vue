<template>
    <div class="page-component-view">
     <div class="page-component-bd">
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
       <map-component v-if="mapshow"  @mapemitcomponent="lockemitcomponent" :itemdata="setectitem"></map-component>
     </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import Pages from '../../pub/page.vue'
  import mapComponent from "./map.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    mapComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      mapshow:false,
      timearr:[],
      setectitem:{},
      formCustom:{
        bicycleNo:"",
        startTime:"",
        endTime:"",
        pageCurrent:1,
        pagesize:10,
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      maintaindata:[],
      data:[],
      columns: [
          {
              title: '账号',
              minWidth:100,
              key: 'loginAccount',
          },
          {
              title: '姓名',
              minWidth:100,
              key: 'riderName',
          },
          {
              title: '手机号',
              minWidth:100,
              key: 'mobileNo',
          },
          {
              title: '租车时间',
              key: "beginTime",
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车站点',
              minWidth:100,
              key: 'rentName',
          },
          {
              title: '还车站点',
              minWidth:100,
              key: 'returnName',
          },
          {
              title: '租车方式',
              key: "flowStatus",
              minWidth:90,
              render: (h, params) => {
                let str = params.row.scanType==0?"手机扫码":params.row.scanType==1?"银行卡":"公交卡"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
               title: '租车费用(元)',
               key: "flowStatus",
               minWidth:100,
               render: (h, params) => {
                 let tradeAmount = params.row.tradeAmount || 0
                 let str = params.row.flowStatus==2?params.row.rentCharge==null?"￥"+tradeAmount:"￥"+params.row.rentCharge:""
                 return h('div', [
                     h('span', str)
               ])
            }
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
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/shorttime"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    lockemitcomponent (e) {
      this.mapshow = false
    },
    timeEmit (e) {
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
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        bicycleNo:this.$route.query.bicycleNo
      }
      let _this =  this
      this.$api.get('/bicycle_monitor/last_rent',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = []
           _this.data.push(reset.resData)
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
