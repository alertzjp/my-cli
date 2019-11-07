<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bicycleNo" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" :xxl="5">
                     <FormItem label="离线时间">
                       <time-component @timeEmit="timeEmit"  :timearr="timearr"></time-component>
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
        <!--操作按钮-->
       <div class="tableListOperator">
       </div>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
             离线车辆:{{totalnumber}}
          </Col>
       </Row>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     <checkin-component v-if="checkinshow" :selectitem="setectitem" @emitcomponent="emitcomponent"></checkin-component>
     <map-component v-if="mapshow"  @mapemitcomponent="emitcomponent" :itemdata="setectitem"></map-component>
     </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import checkinComponent from './checkIn.vue'
  import Pages from '../../pub/page.vue'
  import mapComponent from './map.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    checkinComponent,
    mapComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      mapshow:false,
      checkinshow:false,
      timearr:[],
      totalnumber:0,
      setectitem:{},
      formCustom:{
        bicycleNo:"",
        startTime:"",
        endTime:"",
        mobileNo: "",
        account: "",
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
              title: '车辆二维码',
              minWidth:100,
              key: 'bicycleNo',
          },
          {
              title: '离线时间',
              minWidth:90,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.offLineTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:330,
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
                              display:_this.$hasPerm('/bicycledocksite/list')?"":"none"
                          },
                          on: {
                              click: () => {
                                if(params.row.gpsLatitude && params.row.gpsLongitude){
                                  _this.setectitem = params.row
                                  _this.mapshow = true
                                }else{
                                  _this.$Message.info("车辆坐标没有")
                                }
                              }
                          }
                      }, '查看车辆'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/bicycledocksite/list')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.setectitem = params.row
                                _this.checkinshow = true
                              }
                          }
                      }, '登记车辆'),
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
    // this.formCustom.startTime = this.$webapi.gettime('date',(new Date().getTime()-(86400000*30))/1000)
    // this.formCustom.endTime = this.$webapi.gettime('date',new Date().getTime()/1000)
    // this.timearr = [this.formCustom.startTime,this.formCustom.endTime]
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
      if(_this.$route.path == "/admin/monitor/offlinebike/list"){
        _this.handleSubmit()
      }
    })
    this.totalcar()
  },
  methods: {
    totalcar () {
      let _this = this
      let listdata = {
        token:this.$webapi.get("token")
      }
      this.$api.get('/bicycle_monitor/off_line_total_count',listdata,reset => {
        if (reset.codeId === 1) {
          _this.totalnumber = reset.resData.totalCount
        }
      })
    },
    emitcomponent () {
      this.checkinshow = false
      this.mapshow = false
      this.totalcar()
      this.list()
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
      // let startTime = new Date(this.formCustom.startTime).getTime()
      // let endTime = new Date(this.formCustom.endTime).getTime()
      // if((endTime-startTime)<(86400000*2)){
      //   this.$Message.info("离线时间至少大于3天")
      //   return
      // }
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          bicycleNo:this.formCustom.bicycleNo,
          startTime:this.formCustom.startTime,
          endTime: this.formCustom.endTime,
      }
      let _this =  this
      this.$api.get('/bicycle_monitor/off_line_list',listdata,reset => {
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
