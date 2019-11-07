<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码" >
                            <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="警报类型">
                         <Select v-model="formCustom.warningType" placeholder="请选择警报类型">
                           <Option value="">全部</Option>
                           <Option value="1">站外还车</Option>
                           <Option value="2">未投放</Option>
                         </Select>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="状态">
                         <Select v-model="formCustom.status" placeholder="请选择状态">
                           <Option value="">全部</Option>
                           <Option value="1">未处理</Option>
                           <Option value="2">已处理</Option>
                         </Select>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="所属企业">
                            <entering-component @EmitcompanyComponent="EmitcompanyComponent"></entering-component>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="时间选择">
                          <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                       </FormItem>
                   </Col>
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
       <div class="tableListOperator">
             <Buttoncomponent type="success" title="导出" :loading="exporeloading" icon="md-arrow-down" @emitButton="handleDnow" v-if="$hasPerm('/sharedBike_warning/export')"></Buttoncomponent>
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
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import timeComponent from '../../pub/timecomponent.vue'
import Pages from '../../pub/page.vue'
import enteringComponent from '../../pub/enteringCompany.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    enteringComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      exporeloading:false,
      timearr:[],
      formCustom:{
        bikeNo:"",
        status:"",
        warningType:"",
        status:"",
        enteringCompanyId:"",
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
      columns: [
          {
              title: '车辆二维码',
              minWidth:80,
              key: 'bikeNo',
          },
          {
              title: '所属企业',
              minWidth:100,
              key: 'enteringCompanyName',
          },
          {
              title: '警报类型',
              minWidth:100,
              key: 'warningType',
              render: (h, params) => {
                let str = "";
                if(params.row.warningType==1){
                  str="站外还车"
                }else if(params.row.warningType==2){
                  str="未投放"
                }
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '状态',
              minWidth:100,
              key: '',
              render: (h, params) => {
                let str = "";
                if(params.row.status==1){
                  str="未处理"
                }else if(params.row.status==2){
                  str="已处理"
                }
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '纬度',
              minWidth:100,
              key: 'inSiteNo',
              render: (h, params) => {
                let str = ""+params.row.latitude?params.row.latitude:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '经度',
              minWidth:100,
              key: 'inSiteNo',
              render: (h, params) => {
                let str = params.row.longitude?params.row.longitude:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:100,
              key: 'createdAt',
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
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
      if(_this.$route.path == "/admin/monitor/sharedbikewarning"){
        _this.handleSubmit()
        return false
      }
    })
  },
  methods: {
    handleDnow () {
        this.exporeloading = true
        let listdata = this.formCustom
            listdata.token = this.$webapi.get('token')
        let _this =  this
        this.$api.get('/sharedBike_warning/export',listdata,reset => {
          _this.exporeloading = false
          if(reset.codeId==undefined || reset.codeId==null){
              window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/sharedBike_warning/export',listdata)
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })

    },
    timeEmit (e) {
      let [x,y] = e
        this.formCustom.startTime = x
        this.formCustom.endTime = y
    },
    EmitcompanyComponent (e) {
      this.formCustom.enteringCompanyId = e.id
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
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        token:this.$webapi.get('token'),
        bikeNo:this.formCustom.bikeNo,
        warningType:this.formCustom.warningType,
        enteringCompanyId:this.formCustom.enteringCompanyId,
        status:this.formCustom.status,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
      }
      let _this =  this
      this.$api.get('/sharedBike_warning/page',listdata,reset => {
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
