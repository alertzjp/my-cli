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
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="出场站点编号">
                             <Input type="text" v-model="formCustom.outSiteNo"></Input>
                       </FormItem>
                   </Col> -->
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆状态">
                         <Select v-model="formCustom.status" placeholder="请选择车辆状态">
                           <Option value="">全部</Option>
                           <Option value="1">异常出站</Option>
                           <Option value="2">已进站</Option>
                         </Select>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
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
             <Buttoncomponent type="success" title="导出" icon="md-arrow-down" @emitButton="handleDnow" v-if="$hasPerm('/bicycle_anomalous/export')"></Buttoncomponent>
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
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      timearr:[],
      formCustom:{
        bicycleNo:"",
        status:"",
        outSiteNo:"",
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
              minWidth:100,
              key: 'bicycleNo',
          },
          {
              title: '出场站点编号',
              minWidth:100,
              key: 'outSiteNo',
          },
          {
              title: '出场站点名称',
              minWidth:100,
              key: 'outSiteName',
          },
          {
              title: '进场站点编号',
              minWidth:100,
              key: 'inSiteNo',
          },
          {
              title: '进场站点名称',
              minWidth:100,
              key: 'inSiteName',
          },
          {
              title: '出场时间',
              minWidth:100,
              key: 'outTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.outTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
         },
          {
              title: '进场时间',
              minWidth:100,
              key: 'inTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.inTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
         },
        {
            title: '持续时间',
            minWidth:100,
            key: 'outTime',
            render: (h, params) => {
              let str = params.row.consumeTime + "分钟"
              return h('div', [
                  h('span', str)
            ])
         }
       },
         {
             title: '车辆状态',
             minWidth:100,
             key: '',
             render: (h, params) => {
               let str = "";
               if(params.row.status==1){
                 str="异常出站"
               }else if(params.row.status==2){
                 str="已进站"
               }
               return h('div', [
                   h('span', str)
             ])
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
      if(_this.$route.path == "/admin/monitor/anomalous"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleDnow () {
        let listdata = this.formCustom
            listdata.token = this.$webapi.get('token')
        let _this =  this
        this.$api.get('/bicycle_anomalous/export',listdata,reset => {
          if(reset.codeId==undefined || reset.codeId==null){
              window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/bicycle_anomalous/export',listdata)
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
        bicycleNo:this.formCustom.bicycleNo,
        status:this.formCustom.status,
        outSiteNo:this.formCustom.outSiteNo,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
      }
      let _this =  this
      this.$api.get('/bicycle_anomalous/page',listdata,reset => {
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
