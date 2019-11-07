<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="会员类型">
                    <Select v-model="formCustom.type" placeholder="请选择会员类型">
                       <Option value="">全部</Option>
                       <Option value="1">手机帐号</Option>
                       <Option value="4">公交帐号</Option>
                       <Option value="2">银行帐号</Option>
                       <Option value="5">工商银行免押金账号</Option>
                   </Select>
                  </FormItem>
               </Col>
              <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="姓名">
                     <Input type="text" v-model="formCustom.name"></Input>
                  </FormItem>
               </Col> -->
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
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="充值时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <!-- <div class="mb10">
              <span v-for="item in totaldata" class="pr10">
                {{item.foregiftType==1?"手机账号":item.foregiftType==2?"公交账号":item.foregiftType==3?"银行账号":item.foregiftType==5?"工商银行免押金账号":""}}:{{item.amountSum}}元
              </span>
            </div> -->
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
  import {mapGetters} from 'vuex';
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
      flag:false,
      timearr:[],
      formCustom:{
          name:"",
          mobileNo:"",
          startTime:"",
          endTime:"",
          type:"",
        account: "",
        pageCurrent:1,
        pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      totaldata:[],
      data:[],
      columns:[
        {
          title: '账号',
          key: 'account',
          minWidth: 110,
        },
          {
              title: '姓名',
              key: 'name',
              minWidth:100,
          },
          {
              title: '手机号',
              key: "mobile",
              minWidth:110,
          },
          // {
          //     title: '身份证',
          //     key: "idCardNo",
          //     minWidth:170,
          // },
          {
              title: '充值金额(元)',
              minWidth:80,
              key: 'amount',
          },
          {
              title: '充值方式',
              minWidth:80,
              key: 'tradeChannel',
              render: (h, params) => {
                   let _this = this;
                   let status = ""
                   if(params.row.tradeChannel==null){
                      status = "线下"
                   }
                   if(params.row.tradeChannel==1){
                      status = "IC卡电子钱包"
                   }
                   if(params.row.tradeChannel==2){
                      status = "IC卡免密免签"
                   }
                   if(params.row.tradeChannel==3){
                      status = "IC卡预授权"
                   }
                   if(params.row.tradeChannel==4){
                      status = "IC卡预授权完成"
                   }
                   if(params.row.tradeChannel==11){
                      status = "支付宝"
                   }
                   if(params.row.tradeChannel==12){
                      status = "微信"
                   }
                   if(params.row.tradeChannel==13){
                      status = "银联手机"
                   }
                   return h('div', {
                  },status)
             }
          },
          {
              title: '会员类型',
              minWidth:100,
              key: 'amount',
              render: (h, params) => {
                   let _this = this;
                   let status = ""
                       if(params.row.type==1){
                          status = "手机帐号"
                       }
                       if(params.row.type==4){
                          status = "公交帐号"
                       }
                       if(params.row.type==2){
                          status = "银行帐号"
                       }
                       if(params.row.type==5){
                          status = "工商银行免押金账号"
                       }  
                   return h('div', {
                  },status)
             }
          },
          {
              title: '充值时间',
              key: "createdAt",
              minWidth:100,
              render: (h, params) => {
                   let _this = this;
                   let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                   return h('div', {
                  },str)
             }
          },
          // {
          //     title: '状态',
          //     key: "status",
          //     minWidth:100,
          //     render: (h, params) => {
          //          let _this = this;
          //          let status = ""
          //          if(params.row.status==0){
          //            status = "新增"
          //          }
          //          if(params.row.status==1){
          //            status = "等待入账"
          //          }
          //          if(params.row.status==2){
          //            status = "充值完成"
          //          }
          //          if(params.row.status==3){
          //            status = "未成功"
          //          }
          //          return h('div', {
          //         },status)
          //    }
          // },
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
  computed:{
    ...mapGetters([ "searchdata"]),
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
      if(_this.$route.path == "/admin/userManage/foregift"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime=e[0]
      this.formCustom.endTime=e[1]
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
    view(e){
      // riderId
      this.$router.push({ path: '/admin/userManage/recharge/view',query: {id:e.riderId}})
    },
    total () {
      let listdata= {
        token:this.$webapi.get('token'),
        startTime:""+this.formCustom.startTime,
        endTime:""+this.formCustom.endTime
      }
      let _this =  this
      this.$api.get('/statistic/foregift',listdata,reset => {
        if (reset.codeId === 1) {
           _this.totaldata = reset.resData
        }
        else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      // this.total()
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      if(!this.formCustom.type){this.formCustom.type=""}
      let listdata= {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            pageNo:""+this.pageData.pageCurrent,
            pageSize:""+this.pageData.pagesize,
            // name:""+this.formCustom.name,
            mobileNo:""+this.formCustom.mobileNo,
            type:""+this.formCustom.type,
            startTime:""+this.formCustom.startTime,
            endTime: "" + this.formCustom.endTime,
            account: "" + this.formCustom.account
          })
      }
      let _this =  this
      this.$api.get('/foregift/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount=reset.resData.totalCount;
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
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
