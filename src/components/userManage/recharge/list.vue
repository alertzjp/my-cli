<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
              <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="姓名">
                     <Input type="text" v-model="formCustom.riderName"></Input>
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
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="卡号">
                      <Input type="text" v-model="formCustom.cardNo" placeholder="请输入卡号"></Input>
                   </FormItem>
                </Col> -->
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
        <Col :xs="24" :sm="12" :md="24" :lg="24">
          <div class="mb10" v-if="(formCustom.mobileNo || formCustom.account)&&data.length>0">
              <span>该用户共充值金额(元):</span><span>{{sumRecharge}}</span>
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
      sumRecharge:"",
      formCustom:{
          cardNo:"",
          riderName:"",
          mobileNo:"",
          startTime:"",
        endTime: "",
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
              key: 'loginAccount',
              minWidth:110,
          },
          {
              title: '姓名',
              key: "riderName",
              minWidth:100,
          },
          {
              title: '手机号',
              key: "mobileNo",
              minWidth:120,
          },
          // {
          //     title: '卡号',
          //     key: "cardNo",
          //     minWidth:180,
          // },
          // {
          //     title: '押金',
          //     minWidth:80,
          //     key: 'foregiftSum',
          // },
          {
              title: '充值金额(元)',
              minWidth:80,
              key: 'rechargeAmount',
          },
          {
              title: '充值方式',
              minWidth:80,
              key: 'tradeChannel',
          },
          {
              title: '充值时间',
              minWidth:80,
              key: 'createDate',
              render: (h, params) => {
                   let _this = this;
                   let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                   return h('div', {
                  },str)
             }
          },
           {
              title: '状态',
              minWidth:80,
              key: 'status',
          },
          // {
          //     title: '操作',
          //     key: 'action',
          //     align: 'center',
          //     minWidth:250,
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px'
          //                 },
          //                 on: {
          //                     click: () => {
          //                        this.view(params.row)
          //                     }
          //                 }
          //             }, '充值明细'),
          //         ]);
          //     }
          // }
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
    this.list01();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/userManage/recharge/list"){
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
      this.list01()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list01();
    },
    view(e){
      this.$router.push({ path: '/admin/userManage/recharge/view',query: {id:e.riderId}})
    },
    list01 () {
      this.loading = true
      let listdata= {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            pageNo:""+this.pageData.pageCurrent,
            type:'0',
            pageSize:""+this.pageData.pagesize,
            // riderId:this.$route.query.id,
            // riderName:""+this.formCustom.riderName,
            mobileNo:""+this.formCustom.mobileNo,
            // cardNo:""+this.formCustom.cardNo,
            startTime:this.formCustom.startTime,
            endTime:this.formCustom.endTime,
            account: this.formCustom.account
          })
      }
      let _this =  this
      this.$api.get('/rider/rechargelist',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.rechargeList
           _this.sumRecharge=reset.resData.sumRecharge
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata= {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            pageNo:""+this.pageData.pageCurrent,
            pageSize:""+this.pageData.pagesize,
            riderName:""+this.formCustom.riderName,
            mobileNo:""+this.formCustom.mobileNo,
            cardNo:""+this.formCustom.cardNo
          })
      }
      let _this =  this
      this.$api.get('/rider/rechargeSummarizingList',listdata,reset => {
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
