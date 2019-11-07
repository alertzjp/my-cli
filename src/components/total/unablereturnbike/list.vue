<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="报障次数">
                  <Input v-model="formCustom.faultCount">
                     <span slot="prepend">大于等于</span>
                 </Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="账号">
                  <Input type="text" v-model="formCustom.account" placeholder="请输入账号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                <FormItem label="姓名">
                  <Input type="text" v-model="formCustom.name" placeholder="请输入姓名"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="手机号">
                  <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" :xxl="5">
                <FormItem label="开始日期">
                  <time-component @timeEmit="timeEmit"  :timearr="timearr"></time-component>
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
      </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
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
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent
  },
  data () {
    return {
      loading:false,
      data:[],
      timearr:[],
      formCustom:{
        startTime:"",
        endTime:"",
        account:"",
        faultCount:"6",
        name:"",
        mobileNo:"",
        faultName:"还不了车",
        sort:"",
        pageCurrent:1,
        pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      columns:[
          {
              title: '账号',
              key: 'account',
              minWidth:120,
          },
          {
              title: '姓名',
              key: 'name',
              minWidth:120,
          },
          {
              title: '报障次数',
              key: 'faultCount',
              minWidth:120,
              sortable: true
          },
          {
              title: '手机号',
              key: 'mobileNo',
              minWidth:120,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:80,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                if(this.formCustom.startTime==""){
                                  this.$Message.info("开始日期没有选择")
                                  return
                                }
                                _this.$router.push({
                                  path:"/admin/total/unablereturnbikeView",
                                  query:{
                                    id:params.row.riderId,
                                    startTime:new Date(this.formCustom.startTime + " 00:00:00").getTime(),
                                    endTime:new Date(this.formCustom.endTime+ " 23:59:59").getTime(),
                                  }
                                })
                              }
                          }
                      }, '明细')
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.formCustom.startTime = this.$webapi.gettime('date',(new Date().getTime()-(86400000*30))/1000)
    this.formCustom.endTime = this.$webapi.gettime('date',new Date().getTime()/1000)
    this.timearr = [this.formCustom.startTime,this.formCustom.endTime]
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
        this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
      })
    }
    this.list();
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/total/unablereturnbike"){
        _this.list()
      }
    })
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
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    timeEmit (e) {
      this.formCustom.startTime = e[0],
      this.formCustom.endTime = e[1]
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    list () {
      this.loading = true
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        startTime:this.formCustom.startTime==""?"":this.formCustom.startTime+" 00:00:00",
        endTime:this.formCustom.endTime==""?"":this.formCustom.endTime+" 23:59:59",
        account:this.formCustom.account,
        faultCount:this.formCustom.faultCount,
        name:this.formCustom.name,
        mobileNo:this.formCustom.mobileNo,
        faultName:this.formCustom.faultName
     }
      let _this =  this
      this.$api.get('/statistic/unable_return_bike',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
            _this.data = reset.resData.list
            _this.pageData.totalCount = reset.resData.totalCount;
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
