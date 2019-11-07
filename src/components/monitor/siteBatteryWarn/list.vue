<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="80">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="片区名称">
                    <districtcommon @districtEmitComponent='districtEmitComponent' :fenceId="formCustom.districtId"></districtcommon>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点名称">
                      <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :siteId="formCustom.docksiteId"  :type="2"></docksite-component>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="预警时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <!-- <div class="tableListOperator">
       <Button type="primary" icon="md-add" size="large" @click="add">新增</Button>
     </div> -->
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
             <div class="">
                <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
    </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import docksiteComponent from "../../pub/bicycledocksite.vue"
  import districtcommon from "../../pub/districtcommon.vue"

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    docksiteComponent,
    districtcommon
  },
  data () {
    return {
      loading:false,
      flag:false,
      addroleshow:false,
      timearr:[],
      formCustom:{
          docksiteId:"",
          districtId:"",
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
              title: '片区名称',
              key: 'districtName',
              minWidth:90,
          },
          {
              title: '站点名称',
              key: 'docksiteName',
              minWidth:90,
          },
          {
              title: '站点编号',
              key: "docksiteNo",
              minWidth:90,
          },
          {
              title: '站点负责人',
              key: "maintainerName",
              minWidth:90,
          },
          {
              title: '联系方式',
              key: "mobileNo",
              minWidth: 90,
          },
          {
              title: '站点电量',
              key: "voltage",
              minWidth: 90,
          },
         {
             title: '预警时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.warnTime)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
         },
      ]
    }
  },
  watch:{
    formCustom:{
      handler (val,oldval) {
        if(val){
          this.flag=true;
          let obj={
               path:this.$route.path,
               searchobj:this.formCustom
          }
          this.$store.dispatch('savesearchvla',obj)
        }else{
          this.flag=false
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
          if(vla.searchobj.pageCurrent){
             this.pageData.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.pageData.pagesize = vla.searchobj.pagesize
          }
        }
      })
    }
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/siteBatteryWarn/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteId = e.id
    },
    districtEmitComponent(e){
      this.formCustom.districtId = e.id
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
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
            pageNo:this.pageData.pageCurrent,
            pageSize:this.pageData.pagesize,
            docksiteId: this.formCustom.docksiteId,
            districtId:this.formCustom.districtId,
            startTime:this.formCustom.startTime?this.formCustom.startTime+" 00:00:00":"",
            endTime:this.formCustom.endTime?this.formCustom.endTime+" 23:59:59":""
      }
      let _this =  this
      this.$api.get('/bicycledocksite/battery_warn_record/page',listdata,reset => {
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
