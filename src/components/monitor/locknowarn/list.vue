<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90" inline>
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bicycleNo" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车锁编号">
                           <Input type="text" v-model="formCustom.lockNo" placeholder="请输入车锁编号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="电子标签">
                           <Input type="text" v-model="formCustom.bicycleSensorsNo" placeholder="请输入电子标签"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="站点编号">
                           <Input type="text" v-model="formCustom.bicycleDocksiteNo" placeholder="请输入站点编号"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="站点名称">
                            <site-component @EmitDocksiteComponent="EmitDocksiteComponent"></site-component>
                       </FormItem>
                   </Col>
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车架号">
                           <Input type="text" v-model="formCustom.enquiriesNo"></Input>
                       </FormItem>
                   </Col> -->
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆状态">
                           <bikestatus-component @emitbikeStatus="emitbikeStatus" :bicycleStatus="formCustom.bicycleStatus"></bikestatus-component>
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
         <Buttoncomponent type="success" title="导出" icon='md-arrow-down'  @emitButton="handleDnow" v-if="$hasPerm('/bicycle/low_voltage/export')"></Buttoncomponent>
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
import siteComponent from '../../pub/bicycledocksite.vue'
import bikestatusComponent from '../../pub/bikeStatuscomponnet.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    siteComponent,
    bikestatusComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      formCustom:{
        bicycleNo:"",
        bicycleStatus:"",
        bicycleSensorsNo:"",
        enquiriesNo:"",
        bicycleDocksiteName:"",
        bicycleDocksiteNo:"",
        lockNo:"",
        voltage:"3800",
        docksiteNo:"",
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
              // title: '剩余电量',
              title: '锁电量',
              minWidth:80,
              key: 'voltage',
          },
          {
              title: '车锁编号',
              minWidth:100,
              key: 'lockNo',
          },
          {
              title: '站点编号',
              width:100,
              key: 'bicycleDocksiteNo',
          },
          {
              title: '站点名称',
              minWidth:100,
              key: 'bicycleDocksiteName',
          },
          {
              title: '电子标签',
              minWidth:100,
              key: 'bicycleSensorsNo',
          },
          {
              title: '车架号',
              minWidth:100,
              key: 'enquiriesNo',
          },
          {
              title: '车辆状态',
              minWidth:100,
              key: 'riderName',
              render: (h, params) => {
                let str = this.$status.bicycleStatus(params.row.bicycleStatus)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '更新时间',
          //     width:90,
          //     key: 'beginTime',
          //     render: (h, params) => {
          //       let str = this.$webapi.gettime('time',(params.row.lockUpdatedAt)/1000)
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // }
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
          this.formCustom.docksiteNo=vla.searchobj.bicycleDocksiteNo
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/locknowarn"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleDnow () {
        let listdata = this.formCustom
            listdata.token = this.$webapi.get('token')
        let _this =  this
        this.$api.get('/bicycle/low_voltage/export',listdata,reset => {
          if(reset.codeId==undefined || reset.codeId==null){
              window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/bicycle/low_voltage/export',listdata)
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })

    },
    emitbikeStatus (e) {
      this.formCustom.bicycleStatus = e.value
    },
    EmitDocksiteComponent (e) {
      this.formCustom.bicycleDocksiteName = e.docksiteName
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
        data:{
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          bicycle_no:this.formCustom.bicycleNo,
          bicycle_status:""+this.formCustom.bicycleStatus,
          bicycleSensorsNo:this.formCustom.bicycleSensorsNo,
          // enquiriesNo:this.formCustom.enquiriesNo,
          bicycleDocksiteNo:this.formCustom.bicycleDocksiteNo,
          bicycleDocksiteName:this.formCustom.bicycleDocksiteName,
          lockNo:this.formCustom.lockNo,
          voltage:this.formCustom.voltage
        }
      }
      let _this =  this
      this.$api.get('/bicycle/low_voltage/list',listdata,reset => {
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
