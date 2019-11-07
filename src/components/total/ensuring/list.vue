<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="输入账号">
                  <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入账号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="输入姓名">
                  <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入姓名"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="输入手机号">
                  <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入手机号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                <FormItem label="开始日期">
                    <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
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
      <Buttoncomponent title="导出月报表"  @emitButton="handleeport" icon='md-arrow-down' v-if="$hasPerm('/statistic/export_all_docksite_mouth')"></Buttoncomponent>
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
   <monexport-component v-if="show" @emitcomponent="emitcomponent"></monexport-component>
  </div>
</template>
<script>
// import tableComponent from '../../pub/tablecommon.vue'
// import pageComponent from '../../pub/page.vue'
// import siteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
// import monexportComponent from './monexport.vue'
export default {
  name: "",
  components:{
    // tableComponent,
    // pageComponent,
    // siteComponent,
    timeComponent,
    // monexportComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      show:false,
      timearr:[],
      type:1,
      setlectitem:{},
      formCustom:{
         dockSiteNo:"",
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
      data:[],
      columns:[
          {
              title: '时间',
              key: 'docksiteNo',
              minWidth:90,
              render:(h,params)=>{
                  let str = this.$webapi.gettime('date',params.row.sumDate/1000)
                  return h('div',str)
              }
          },
          {
              title: '站点编号',
              key: 'bicycleDocksiteNo',
              minWidth:100,
          },
          {
              title: '站点名称',
              key: 'bicycleDocksiteName',
              minWidth:120,
          },
          {
              title: '运营商',
              key: 'operatorName',
              minWidth:120,
          },
          {
              title: '车位数',
              key: 'totalPileNum',
              minWidth:80,
          },
          {
              title: '租车次数',
              key: 'rentSum',
              minWidth:80,
          },
          {
              title: '还车次数',
              key: 'returnSum',
              minWidth:80,
          },
      ]
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
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/total/bikenumday"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
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
      this.$api.get('/statistic/bicycle_docksite_day',listdata,reset => {
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
