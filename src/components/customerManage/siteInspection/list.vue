<template>
   <div class="page-component-view">
     <Tabs v-model="formCustom.tabtype" @on-click="changetab">
       <TabPane label="站点" name="1">
          <div class="page-component-bd">
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
                      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                        <FormItem label="生成时间">
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
            <div class="tableListOperator">
               <Buttoncomponent title="导出" type="success" icon="md-arrow-down" @emitButton="exportfile" v-if="$hasPerm('/inspection/list_export')"></Buttoncomponent>
            </div>
            <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <div class="">
                        <table-component :loading="loading" :columnsdata="columns1" :datas="data1"></table-component>
                    </div>
                    <div class="">
                       <page-component :pageData="pageData1" @pageComponentDate="pageComponentDate1"></page-component>
                    </div>
               </Col>
            </Row>
          </div>
       </TabPane>
       <TabPane label="车辆" name="2">
          <div class="page-component-bd">
            <div class="tableListForm">
              <Form ref="formCustom" :model="formCustom" :label-width="80">
                  <Row>
                      <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                        <FormItem label="车辆编号">
                           <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆编号"></Input>
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
            <div class="tableListOperator">
               <Buttoncomponent title="导出" type="success" icon="md-arrow-down" @emitButton="exportfile" v-if="$hasPerm('/inspection/list_export')"></Buttoncomponent>
            </div>
            <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                   <div class="">
                        <table-component :loading="loading" :columnsdata="columns2" :datas="data2"></table-component>
                    </div>
                    <div class="">
                       <page-component :pageData="pageData2" @pageComponentDate="pageComponentDate2"></page-component>
                    </div>
               </Col>
            </Row>
          </div>
       </TabPane>
     </Tabs>
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
          tabtype:"1",
          fenceId:"",
          districtName:"",
          docksiteName:"",
          docksiteNo:"",
          sort:"",
          startTime:"",
          endTime:"",
          pageCurrent:1,
          pagesize:10,
          bikeNo:""
      },
      pageData1:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      pageData2:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data1:[],
      columns1:[
          {
              title: '巡检人',
              key: 'inspectionName',
              minWidth:90,
          },
          {
              title: '巡检类型',
              minWidth:50,
              render: (h, params) => {
                let str = params.row.type==1?"站点巡检":params.row.type==2?"车辆故障-现场":params.row.type==3?"车辆故障-带回":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
          {
              title: '所属片区',
              key: 'districtName',
              minWidth:90,
          },
          {
              title: '巡检站点',
              key: 'docksiteName',
              minWidth:90,
          },
          {
              title: '站点编号',
              key: "docksiteNo",
              minWidth: 90,
          },
         {
             title: '操作详情',
             key: "operation",
             minWidth:90,
             render: (h, params) => {
                let texts = '';
                let str = '';
                if(params.row.type==1&&!params.row.operation){
                  str="无调整车辆"
                }else{
                  str=params.row.operation.replace(/、/g,"\n")
                }
                if (str !== null) {
                  if (str.length > 10) {
                      texts = str.substring(0, 10) + "....";
                   } else {
                      texts = str;
                   }
                }
                return h('p', [
                     h('Tooltip', {props: {placement: 'top',transfer: true}}, [
                          texts,
                          h('p', {
                                slot: 'content',
                                style: {
                                    whiteSpace:'pre-wrap'
                                 }
                            }, str
                            )]
                      )
                 ])
             }
         },
         {
             title: '问题描述',
             key: "faultContent",
             minWidth:120,
         },
         {
             title: '图片',
             key: "image",
             minWidth:100,
             render: (h, params) => {
               let _this = this;
               if(params.row.image.includes(';')){
                  let newarr=params.row.image.split(";")
                  return h('div',[
                    h('img',{
                      attrs:{
                        src:newarr[0]
                      },
                      style:{
                        width:'50px',
                        height:'50px',
                        marginRight:'10px',
                        marginTop:'5px',
                        display:newarr[0]?"":"none"
                      },
                      on:{
                        'click' () {
                           _this.$webapi.getimg(newarr[0])
                        }
                      }
                    }),
                    h('img',{
                      attrs:{
                        src:newarr[1]
                      },
                      style:{
                        width:'50px',
                        height:'50px',
                        marginTop:'5px',
                        display:newarr[1]?"":"none"
                      },
                      on:{
                        'click' () {
                           _this.$webapi.getimg(newarr[1])
                        }
                      }
                    })
                 ])
               }else{
                 return h('img',{
                   attrs:{
                     src:params.row.image
                   },
                   style:{
                     width:'50px',
                     height:'50px',
                     display:params.row.image?"":"none"
                   },
                   on:{
                     'click' () {
                        _this.$webapi.getimg(params.row.image)
                     }
                   }
                 })
               }
          }
        },
         {
             title: '巡检时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
               return h('div', [
                   h('span', str)
             ])
           }
         },
         {
             title: '操作',
             key: 'action',
             align: 'center',
             minWidth:150,
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
                           display:_this.$hasPerm("/inspection/inspectionDetails")?"":"none"
                       },
                       on: {
                           click: () => {
                             this.$router.push({
                               path:"/admin/customerManage/siteInspection/siteInspectiondetails",
                               query:{
                                 id:params.row.id
                               }
                             })
                           }
                       }
                   }, '查看详情')
                 ]);
             }
         }
      ],
      data2:[],
      columns2:[
          {
              title: '巡检人',
              key: 'inspectionName',
              minWidth:90,
          },
          {
              title: '巡检类型',
              minWidth:50,
              render: (h, params) => {
                let str = params.row.type==1?"站点巡检":params.row.type==2?"车辆故障-现场":params.row.type==3?"车辆故障-带回":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
          {
              title: '车辆编号',
              key: "bikeNo",
              minWidth: 90,
          },
         {
             title: '操作详情',
             key: "operation",
             minWidth:90,
             render: (h, params) => {
                let texts = '';
                let str = '';
                if(params.row.type==1&&!params.row.operation){
                  str="无调整车辆"
                }else{
                  str=params.row.operation.replace(/、/g,"\n")
                }
                if (str !== null) {
                  if (str.length > 10) {
                      texts = str.substring(0, 10) + "....";
                   } else {
                      texts = str;
                   }
                }
                return h('p', [
                     h('Tooltip', {props: {placement: 'top',transfer: true}}, [
                          texts,
                          h('p', {
                                slot: 'content',
                                style: {
                                    whiteSpace:'pre-wrap'
                                 }
                            }, str
                            )]
                      )
                 ])
             }
         },
         {
             title: '问题描述',
             key: "faultContent",
             minWidth:120,
         },
         {
             title: '图片',
             key: "image",
             minWidth:100,
             render: (h, params) => {
               let _this = this;
               if(params.row.image.includes(';')){
                  let newarr=params.row.image.split(";")
                  return h('div',[
                    h('img',{
                      attrs:{
                        src:newarr[0]
                      },
                      style:{
                        width:'50px',
                        height:'50px',
                        marginRight:'10px',
                        marginTop:'5px',
                        display:newarr[0]?"":"none"
                      },
                      on:{
                        'click' () {
                           _this.$webapi.getimg(newarr[0])
                        }
                      }
                    }),
                    h('img',{
                      attrs:{
                        src:newarr[1]
                      },
                      style:{
                        width:'50px',
                        height:'50px',
                        marginTop:'5px',
                        display:newarr[1]?"":"none"
                      },
                      on:{
                        'click' () {
                           _this.$webapi.getimg(newarr[1])
                        }
                      }
                    })
                 ])
               }else{
                 return h('img',{
                   attrs:{
                     src:params.row.image
                   },
                   style:{
                     width:'50px',
                     height:'50px',
                     display:params.row.image?"":"none"
                   },
                   on:{
                     'click' () {
                        _this.$webapi.getimg(params.row.image)
                     }
                   }
                 })
               }
          }
        },
         {
             title: '巡检时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
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
             this.formCustom.tabtype==1?this.pageData1.pageCurrent = vla.searchobj.pageCurrent:this.pageData2.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.formCustom.tabtype==1?this.pageData1.pagesize = vla.searchobj.pagesize:this.pageData2.pagesize = vla.searchobj.pagesize
          }
        }
      })
    }
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/siteInspection/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    changetab(){
      this.list()
    },
    handleSubmit() {
      this.formCustom.tabtype==2?this.pageData2.pageCurrent=1:this.pageData1.pageCurrent=1
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
      this.clearsearch()
      let listdata = this.formCustom
      if(!this.formCustom.tabtype) return ;
      listdata.token = this.$webapi.get('token')
      listdata.startTime = listdata.startTime?listdata.startTime+' 00:00:00':'',
      listdata.endTime = listdata.endTime?listdata.endTime+' 23:59:59':'',
      listdata.type= Number(this.formCustom.tabtype)
      delete  listdata.pageCurrent
      delete  listdata.pagesize
      delete  listdata.tabtype
      listdata=this.$utils.filterNull(listdata)
      this.$api.get('/inspection/list_export',listdata,reset => {
        if(reset.codeId==undefined || reset.codeId==null){
            window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/inspection/list_export',listdata)
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    pageComponentDate1(e){
      this.pageData1.pageCurrent=e.pageCurrent;
      this.pageData1.pagesize=e.pagesize;
      this.list();
    },
    pageComponentDate2(e){
      this.pageData2.pageCurrent=e.pageCurrent;
      this.pageData2.pagesize=e.pagesize;
      this.list();
    },
    clearsearch(){
      if(this.formCustom.tabtype==1){
        this.formCustom.bikeNo=""
      }else if(this.formCustom.tabtype==2){
        this.formCustom.districtName=''
        this.formCustom.docksiteName=''
        this.formCustom.fenceId=''
        this.formCustom.docksiteNo=''
        this.formCustom.startTime=''
        this.formCustom.endTime=''
      }
    },
    list () {
      this.clearsearch()
      this.formCustom.pageCurrent = this.formCustom.tabtype==1?this.pageData1.pageCurrent:this.pageData2.pageCurrent
      this.formCustom.pagesize = this.formCustom.tabtype==1?this.pageData1.pagesize:this.pageData2.pagesize
      this.loading = true
      if(!this.formCustom.tabtype) return ;
      let listdata = {
            token:this.$webapi.get('token'),
            pageNo:this.formCustom.pageCurrent,
            pageSize:this.formCustom.pagesize,
            type:Number(this.formCustom.tabtype),
            districtName: this.formCustom.districtName,
            docksiteName:this.formCustom.docksiteName,
            bikeNo:this.formCustom.bikeNo,
            fenceId:this.formCustom.fenceId,
            docksiteNo:this.formCustom.docksiteNo,
            sort:this.formCustom.sort,
            startTime:this.formCustom.startTime?this.formCustom.startTime+' 00:00:00':'',
            endTime:this.formCustom.endTime?this.formCustom.endTime+' 23:59:59':'',
      }
      listdata=this.$utils.filterNull(listdata)
      let _this =  this
      this.$api.get('/inspection/bicycleDocksiteInspection',listdata,reset => {
        if (reset.codeId === 1) {
           _this.loading = false
           if(this.formCustom.tabtype==1){
             _this.data1 = reset.resData.list
             if(reset.resData){
               _this.pageData1.totalCount=reset.resData.totalCount;
               _this.pageData1.pageCurrent=reset.resData.pageNo;
               _this.pageData1.pagesize=reset.resData.pageSize;
             }
           }else if(this.formCustom.tabtype==2){
             _this.data2 = reset.resData.list
             if(reset.resData){
               _this.pageData2.totalCount=reset.resData.totalCount;
               _this.pageData2.pageCurrent=reset.resData.pageNo;
               _this.pageData2.pagesize=reset.resData.pageSize;
             }
           }
        }else if(reset.codeId === -9){
          _this.data1 = [];
          _this.data2 = [];
          _this.loading = false;
          _this.pageData1=[];
          _this.pageData2=[];
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
