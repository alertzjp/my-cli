<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="80">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="片区名称">
                    <districtcommon @districtEmitComponent='districtEmitComponent' :fenceId="formCustom.fenceId"></districtcommon>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点名称">
                      <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteNo"></docksite-component>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3" >
                 <FormItem label="未巡检天数">
                     <InputNumber  :min="1" v-model="formCustom.notInsDay" style="width:100%"></InputNumber>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="巡检时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <div class="tableListOperator">
        <Buttoncomponent title="导出" type="success" icon="md-arrow-down" @emitButton="exportfile" v-if="$hasPerm('/inspection/list_export_notInspection')"></Buttoncomponent>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
               <span>站点数量：{{pageData.totalCount}}</span>
            </div>
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
      timearr:[],
      formCustom:{
          fenceId:"",
          districtName:"",
          docksiteName:"",
          docksiteNo:"",
          notInsDay:1,
          sort:"",
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
              title: '站点名称',
              key: "docksiteName",
              minWidth: 90,
          },
          {
              title: '站点编号',
              key: "docksiteNo",
              minWidth: 90,
          },
          {
              title: '片区名称',
              key: 'districtName',
              minWidth:90,
          },
          {
              title: '片区负责人',
              key: 'disPerson',
              minWidth:90,
          },
          {
              title: '联系方式',
              key: 'disMobile',
              minWidth:90,
          },         
         {
             title: '站点负责人',
             key: "docPerson",
             minWidth:90,
         },
         {
             title: '联系方式',
             key: "docMobile",
             minWidth:90,
         },
         {
             title: '未巡检天数',
             key: "notInsDay",
             minWidth:150,
             sortable: true
        },
         {
             title: '最后一次巡检时间',
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
      if(_this.$route.path == "/admin/customerManage/siteLongtimeNotInspection/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
    },
    districtEmitComponent(e){
      this.formCustom.districtName = e.name
      this.formCustom.fenceId = e.id
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteName = e.docksiteName
      this.formCustom.docksiteNo = e.docksiteNo
    },
    exportfile () {
      let _this=this;
      if(!this.formCustom.notInsDay){
        this.$Message.warning('没有输入未巡检天数,无法导出')
        return
      }
      let listdata = this.formCustom
      listdata.token = this.$webapi.get('token')
      listdata.startTime = listdata.startTime?listdata.startTime+' 00:00:00':'',
      listdata.endTime = listdata.endTime?listdata.endTime+' 23:59:59':'',
      delete  listdata.pageCurrent
      delete  listdata.pagesize
      this.$api.get('/inspection/list_export_notInspection',listdata,reset => {
        if(reset.codeId==undefined || reset.codeId==null){
            window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/inspection/list_export_notInspection',listdata)
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    list () {
      if(!this.formCustom.notInsDay){
        this.$Message.warning('没有输入未巡检天数,无法查询')
        return
      }
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
            pageNo:this.pageData.pageCurrent,
            pageSize:this.pageData.pagesize,
            districtName: this.formCustom.districtName,
            docksiteName:this.formCustom.docksiteName,
            fenceId:this.formCustom.fenceId,
            docksiteNo:this.formCustom.docksiteNo,
            notInsDay:this.formCustom.notInsDay,
            sort:this.formCustom.sort,
            startTime:this.formCustom.startTime?this.formCustom.startTime+' 00:00:00':'',
            endTime:this.formCustom.endTime?this.formCustom.endTime+' 23:59:59':'',
      }
      let _this =  this
      this.$api.get('/inspection/NotInspection',listdata,reset => {
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
