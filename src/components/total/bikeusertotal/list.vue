<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
               <FormItem label="账号">
                 <Input type="text" v-model="formCustom.account" placeholder="请输入账号"></Input>
               </FormItem>
             </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="姓名">
                     <Input type="text" v-model="formCustom.userName" placeholder="请输入姓名"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="手机号">
                    <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="开始日期">
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
   <view-component v-if="viewshow" :selectitem="selectitem" :formCustomitem="formCustom" @emitcomponent="emitcomponent"></view-component>
  </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import siteComponent from '../../pub/bicycledocksite.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import viewComponent from './zucheview.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    siteComponent,
    timeComponent,
    viewComponent
  },
  data () {
    return {
      loading:false,
      viewshow:false,
      timearr:[],
      type:1,
      selectitem:{},
      formCustom:{
         userName:"",
         mobileNo:"",
         startTime:"",
         endTime:"",
        account: "",
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
          title: '账号',
          key: 'account',
          minWidth: 120,
        },
          {
              title: '姓名',
              key: 'userName',
              minWidth:100,
          },
          {
              title: '手机号',
              key: 'mobileNo',
              minWidth:120,
          },
          {
              title: '身份证',
              key: 'idCardNo',
              minWidth:180,
          },
          {
              title: '租车总时间(分钟)',
              key: 'minuteSum',
              minWidth:100,
          },
          {
              title: '租车总次数',
              key: 'rentCount',
              minWidth:100,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:100,
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
                          },
                          on: {
                              click: () => {
                                // _this.selectitem = params.row
                                // _this.viewshow = true
                                console.log(params.row)
                                _this.$router.push({
                                  path:"/admin/total/zuche",
                                  query:{
                                    mobileNo:params.row.mobileNo
                                  }
                                })
                              }
                          }
                      }, '租车记录'),
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
      if(_this.$route.path == "/admin/total/bikeusertotal"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    emitcomponent () {
      this.viewshow= false
    },
    outSiteName (e) {
      this.formCustom.dockSiteNo = e.docksiteNo
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        userName:this.formCustom.userName,
        mobileNo:this.formCustom.mobileNo,
        startTime:this.formCustom.startTime,
        endTime:this.formCustom.endTime,
        account: this.formCustom.account
     }
      let _this =  this
      this.$api.get('/statistic/rider_rent_count',listdata,reset => {
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
