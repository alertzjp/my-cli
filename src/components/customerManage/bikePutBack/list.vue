<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="80">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="操作人">
                    <maintainerid-component @emitmaintainer='emitmaintainer' placeholder='请选择操作人' type="1" :propsid="formCustom.maintainerId"></maintainerid-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="操作类型">
                    <Select v-model="formCustom.type"  placeholder="请选择操作类型">
                       <Option value="">全部</Option>
                       <Option value="-1">收车</Option>
                       <Option value="1">投车</Option>
                   </Select>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="操作子类型">
                    <Select v-model="formCustom.bicycleType"  placeholder="请选择操作子类型">
                       <Option value="">全部</Option>
                       <Option value="-1">故障车</Option>
                       <Option value="1">新车</Option>
                   </Select>
                  </FormItem>
               </Col>

               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="完成时间">
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
        <Buttoncomponent title="导出" type="success" icon="md-arrow-down" @emitButton="exportfile" v-if="$hasPerm('/bicycle_put_back/export')"></Buttoncomponent>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
               <span>收投车次数：{{pageData.totalCount}} 条</span>
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
   <bikeshow-component v-if="bikeshow" :selectitem="selectitem" @emitendcomponent="emitendcomponent"></bikeshow-component>
    </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import maintaineridComponent from "../../pub/maintainerIdcomponent.vue"
  import bikeshowComponent from "./bikeshowcomponent.vue"

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    maintaineridComponent,
    bikeshowComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      bikeshow:false,
      timearr:[],
      selectitem:[],
      formCustom:{
          type:"",
          maintainerId:"",
          bicycleType:"",
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
              title: '操作人',
              key: 'maintainerName',
              minWidth:90,
          },
          {
              title: '操作类型',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.type==-1?"收车":params.row.type==1?"投车":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
          {
              title: '操作子类型',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.bicycleType==-1?"故障车":params.row.bicycleType==1?"新车":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
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
             title: '车辆数',
             key: "bicycleNumber",
             minWidth:90,
         },
         {
             title: '完成时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.finishTime)/1000)
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
                           display:_this.$hasPerm("/bicycle_put_back/detail")?"":"none"
                       },
                       on: {
                           click: () => {
                              // _this.selectitem = params.row
                              // _this.selectitem.flag=1
                              // _this.bikeshow = true

                              _this.$router.push({
                                path:"/admin/customerManage/bikePutBack/findCarList",
                                query:{
                                  id:params.row.id,
                                  maintainerName:params.row.maintainerName,
                                  type:params.row.type,
                                  docksiteName:params.row.docksiteName,
                                  docksiteNo:params.row.docksiteNo,
                                  bicycleNumber:params.row.bicycleNumber,
                                  bicycleType:params.row.bicycleType        
                                }
                              })
                           }
                       }
                   }, '查看车辆')
                 ]);
             }
         }
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
      if(_this.$route.path == "/admin/customerManage/bikePutBack/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    emitmaintainer(e){
      this.formCustom.maintainerId = e.id
    },
    emitendcomponent(){
      this.bikeshow=false
      this.list()
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
    },
    exportfile () {
      let _this=this;
      let listdata = this.formCustom
      listdata.token = this.$webapi.get('token')
      delete listdata.pageCurrent
      delete listdata.pagesize
      listdata.startTime = listdata.startTime?listdata.startTime+" 00:00:00":"",
      listdata.endTime = listdata.endTime?listdata.endTime+" 23:59:59":""
      listdata=this.$utils.filterNull(listdata)
      this.$api.get('/bicycle_put_back/export',listdata,reset => {
        if(reset.codeId==undefined || reset.codeId==null){
            window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/bicycle_put_back/export',listdata)
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
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
            pageNo:this.pageData.pageCurrent,
            pageSize:this.pageData.pagesize,
            bicycleType: this.formCustom.bicycleType,
            maintainerId:this.formCustom.maintainerId,
            type:this.formCustom.type,
            startTime:this.formCustom.startTime?this.formCustom.startTime+" 00:00:00":"",
            endTime:this.formCustom.endTime?this.formCustom.endTime+" 23:59:59":""
      }
      let _this =  this
      this.$api.get('/bicycle_put_back/record/page',listdata,reset => {
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
