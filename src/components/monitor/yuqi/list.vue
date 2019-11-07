<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="账号">
                     <Input type="text" v-model="formCustom.account" placeholder="请输入账号"></Input>
                   </FormItem>
                 </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="手机号">
                           <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                       </FormItem>
                   </Col>
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="姓名">
                           <Input type="text" v-model="formCustom.name"></Input>
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
       <div class="tableListOperator">
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
    timeComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      formCustom:{
        bikeNo:"",
        name:"",
        mobileNo:"",
        account: "",
        ageCurrent:1,
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
            title: '账号',
              minWidth:100,
            key: 'account',
          },
          {
              title: '姓名',
              minWidth:80,
              key: 'riderName',
          },
        {
          title: '手机号',
          minWidth: 100,
          key: 'mobileNo',
        },
          {
              title: '借出站点',
              minWidth:100,
              key: 'chargePileNoRentName',
          },
          {
              title: '借出时间',
              minWidth:100,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '骑行时间',
              minWidth:100,
              key: 'minutes',
              render: (h, params) => {
                let str = this.$webapi.GETtIMEHOUS(params.row.minutes)
                return h('div', [
                  h('span', str)
              ])
           }
          },
          {
              title: '车辆状态',
              minWidth:80,
              key: 'lendDocksiteName',
              render: (h, params) => {
                let str = this.$status.bicycleStatus(params.row.bicycleStatus)
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
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/yuqi"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
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
          bikeNo:this.formCustom.bikeNo,
          // name:this.formCustom.name,
          mobileNo: this.formCustom.mobileNo,
          account: this.formCustom.account
        }
      }
      let _this =  this
      this.$api.get('/bicyclerent/Overdue_list',listdata,reset => {
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
