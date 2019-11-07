<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
         <Form ref="formCustom" :model="formCustom" :label-width="80">
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
                     <FormItem label="定位状态">
                       <Select v-model="formCustom.status" placeholder="请选择定位状态">
                           <Option value="" >全部</Option>
                           <Option value="1" >有效</Option>
                           <Option value="-1" >无效</Option>
                       </Select>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                     <FormItem label="时间">
                          <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                   <div class="">
                     <FormItem>
                         <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                     </FormItem>
                   </div>
                 </Col>
             </Row>
         </Form>
       </div>
       <div class="tableListOperator">

       </div>
        <!--操作按钮-->
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
import Pages from '../../pub/page.vue'
import timeComponent from '../../pub/timecomponent.vue'
 export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent
   },
  data () {
    return {
      loading:false,
      pageshow:false,
      timearr:[],
      formCustom:{
        bicycleNo:"",
        status:"",
        startTime:"",
        endTime:"",
        lockNo:"",
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
              title: '二维码编号',
              key: 'bicycleNo',
              minWidth:100,
          },
          {
              title: '车锁编号',
              key: 'lockNo',
              minWidth:100,
          },
          {
              title: '经度',
              key: 'gpsLongitude',
              minWidth:100,
          },
          {
              title: '纬度',
              key: 'gpsLatitude',
              minWidth:100,
          },
          {
              title: '定位状态',
              key: 'status',
              minWidth:100,
              render: (h, params) => {
                let str = params.row.status==1?"有效":params.row.status==-1?"无效":""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              key: 'address',
              minWidth:100,
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
      if(_this.$route.path == "/admin/system/GPS/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
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
    shengji (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
        id:""
      }
      this.$api.post("/bicycleLocation/list", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    reboot (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
      }
      this.$api.post("/site/order/reboot", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
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
        bicycleNo:this.formCustom.bicycleNo,
        status:this.formCustom.status,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
        lockNo:this.formCustom.lockNo,
      }
      let _this =  this
      this.$api.get('/bicycleLocation/list',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
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
