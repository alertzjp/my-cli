<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="用户名称">
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
                   <Input type="text" v-model="formCustom.riderMobile" placeholder="请输入手机号"></Input>
                 </FormItem>
               </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
               <FormItem label="卡号">
                 <Input type="text" v-model="formCustom.cardNo" placeholder="请输入卡号"></Input>
               </FormItem>
             </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="操作者">
                     <Input type="text" v-model="formCustom.creatorName" placeholder="请输入操作者"></Input>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="退款时间">
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
        creatorName:'',
        cardNo:'',
        riderName:'',
        riderMobile:'',
        startTime:'',
        endTime: '',
        account: '',
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
          key: "account",
          minWidth: 110,
        },
         {
              title: '姓名',
              key: 'riderName',
              minWidth:80,
          },
          {
              title: '手机号',
              key: "riderMobile",
              minWidth:110,
          },
        {
          title: '卡类型',
          key: 'cardType',
          minWidth: 60,
          render: (h, params) => {
            let _this = this;
            let type = '';
            if (params.row.cardType == 1) {
              type = "会员卡"
            } else if (params.row.cardType == 2) {
              type = "团体卡"
            }
            return h('div', {}, type)
          }
        },
          {
              title: '卡号',
              key: "cardNo",
              minWidth:140,
          },
          {
            title: '退款押金(元)',
              minWidth:60,
              key: 'amount',
          },
          {
              title: '押金来源',
              minWidth:100,
              key: 'amountTypeString',
          },
          {
              title: '操作者',
              minWidth:60,
              key: 'creatorName',
          },
          {
              title: '退款时间',
              key: "createdAt",
              minWidth:100,
              render: (h, params) => {
                   let _this = this;
                   let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                   return h('div', {
                  },str)
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
      if(_this.$route.path == "/admin/userManage/refundoffline"){
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      if(!this.formCustom.type){this.formCustom.type=""}
      let listdata= {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        creatorName:""+this.formCustom.creatorName,
        cardNo:""+this.formCustom.cardNo,
        // riderName:""+this.formCustom.riderName,
        startTime:""+this.formCustom.startTime,
        endTime:""+this.formCustom.endTime,
        riderMobile:""+this.formCustom.riderMobile,
        account: "" + this.formCustom.account
      }
      let _this =  this
      this.$api.get('/refundOffLine/list',listdata,reset => {
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
