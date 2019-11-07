<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点负责人">
                    <Input type="text" v-model="formCustom.maintainerName" placeholder="请输入站点负责人"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="调出站点名称">
                     <site-component @EmitDocksiteComponent="outSiteName" :docksiteNo="formCustom.outdocksiteNo"></site-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="调入站点名称">
                    <site-component  @EmitDocksiteComponent="inSiteName" :docksiteNo="formCustom.indocksiteNo"></site-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="开始日期">
                    <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="调度单状态">
                    <Select v-model="formCustom.status" placeholder="请选择调度单状态">
                         <Option value="">全部</Option>
                         <Option  value="1">新建</Option>
                         <Option  value="2">完成</Option>
                         <Option  value="-1">删除</Option>
                    </Select>
                  </FormItem>
               </Col> -->

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
     <!--操作按钮-->
    <!-- <div class="tableListOperator">
      <Buttoncomponent title="新建调度单"  icon="md-add" @emitButton="add" v-if="$hasPerm('/bicycle_dispatch_sheet/add')"></Buttoncomponent>
      <Buttoncomponent title="导出调度单"   @emitButton="exportfile" v-if="$hasPerm('/bicycle_dispatch_sheet/export')"></Buttoncomponent>
     </div> -->
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
   <!-- <relevanc-component v-if="relevancshow" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></relevanc-component>
   <maintain-component v-if="maintainshow" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></maintain-component> -->
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import addComponent from './add.vue'
import siteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
// import relevancComponent from './relevancesite.vue'
// import maintainComponent from './maintain.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    addComponent,
    siteComponent,
    timeComponent
    // relevancComponent,
    // maintainComponent
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
      timearr:[],
      formCustom:{
         maintainerName:"",
         status:"2",
         outSiteName:"",
         inSiteName:"",
         startTime:"",
         endTime:"",
         outdocksiteNo:"",
         indocksiteNo:"",
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
              title: '站点负责人',
              key: 'maintainerName',
              minWidth:100,
          },
          {
              title: '调出站点名称',
              key: 'outSiteName',
              minWidth:110,
          },
          {
              title: '调入站点名称',
              key: 'inSiteName',
              minWidth:110,
          },
          {
              title: '调度数量',
              key: 'expectedNum',
              minWidth:80,
          },
          // {
          //     title: '调度单状态',
          //     key: 'mobileNo',
          //     minWidth:100,
          //     render: (h, params) => {
          //       let str = params.row.status==1?"新建":params.row.status==2?"完成":""
          //       return h('div', [
          //          h('span', str)
          //      ])
          //   }
          // },
          // {
          //     title: '创建人',
          //     key: 'createName',
          //     minWidth:80,
          // },
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
          {
              title: '完成时间',
              key: 'createdAt',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          // {
          //     title: '操作',
          //     key: 'action',
          //     align: 'center',
          //     minWidth:250,
          //     fixed:"right",
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'success',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     marginTop: '5px',
          //                     display:_this.$hasPerm('/bicycle_dispatch_sheet/complete')?params.row.status==1?"":"none":"none"
          //                 },
          //                 on: {
          //                     click: () => {
          //                       _this.$webapi.getMessinfo({
          //                         title:"确定完成调用了吗",
          //                         yes () {
          //                           _this.complete(params.row)
          //                         }
          //                       })
          //                     }
          //                 }
          //             }, "完成调用"),
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     marginTop: '5px',
          //                     display:_this.$hasPerm('/bicycle_dispatch_sheet/update')?params.row.status==1?"":"none":"none"
          //                 },
          //                 on: {
          //                     click: () => {
          //                        _this.setlectitem = params.row
          //                        _this.type = 2
          //                        _this.addshow = true
          //                     }
          //                 }
          //             }, '编辑'),
          //             h('Button', {
          //                 props: {
          //                     type: 'error',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     marginTop: '5px',
          //                     display:_this.$hasPerm('/bicycle_dispatch_sheet/delete')?params.row.status==1?"":"none":"none"
          //                 },
          //                 on: {
          //                     click: () => {
          //                       _this.$webapi.getMessinfo({
          //                         title:"确定要删除调出站点【"+params.row.outSiteName+"】调入站点【"+params.row.inSiteName+"】吗？",
          //                         yes () {
          //                           _this.delpost(params.row)
          //                         }
          //                       })
          //                     }
          //                 }
          //             }, '删除'),
          //         ]);
          //     }
          // }
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
      if(_this.$route.path == "/admin/dispatch/dispatch/finish"){
        _this.handleSubmit()
      }
    })
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
      this.formCustom.outdocksiteNo = e.docksiteNo
    },
    inSiteName (e) {
      this.formCustom.inSiteName = e.docksiteName
      this.formCustom.indocksiteNo = e.docksiteNo
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
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        maintainerName:this.formCustom.maintainerName,
        status:this.formCustom.status,
        outSiteName:this.formCustom.outSiteName,
        inSiteName:this.formCustom.inSiteName,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
     }
      let _this =  this
      this.$api.get('/bicycle_dispatch_sheet/list',listdata,reset => {
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
