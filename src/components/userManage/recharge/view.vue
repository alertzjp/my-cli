<template>
  <div class="page-component-view">
   <div class="page-component-bd">
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
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
  },
  data () {
    return {
      loading:false,
      flag:false,
      formCustom:{
          cardNo:"",
          riderName:"",
          mobileNo:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '姓名',
              key: 'riderName',
              minWidth:150,
              fixed:"left",
          },
          {
              title: '充值金额',
              key: 'rechargeAmount',
              minWidth:150,
          },
          {
              title: '充值前金额',
              key: "initBalance",
              minWidth:150,
              render: (h, params) => {
                 let str = params.row.initBalance?params.row.initBalance:0
                   return h('div', {
                  },str)
             }
          },
          {
              title: '充值后金额',
              key: "finalBalance",
              minWidth:150,
          },
          {
              title: '充值日期',
              minWidth:150,
              key: 'createDate',
              render: (h, params) => {
                   let _this = this;
                   let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                   return h('div', {
                  },str)
             }
          },
          {
              title: '支付方式',
              minWidth:150,
              key: 'tradeChannel',
          },
          {
              title: '支付状态',
              key: "status",
              minWidth:100,
          },
          {
              title: '充值类型',
              key: "mobileNo",
              minWidth:100,
              render: (h, params) => {
                 let str = params.row.type==1?"押金充值":"余额充值"
                   return h('div', {
                  },str)
             }
          },
      ]
    }
  },
  watch:{
    formCustom:{
      handler (val,oldval) {
        if(val){
          this.flag=true;
        }else{
          this.flag=false
        }
      },
      deep:true
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
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
      this.loading = true
      let listdata= {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            pageNo:""+this.pageData.pageCurrent,
            pageSize:""+this.pageData.pagesize,
            riderId:this.$route.query.id,
            riderName:""+this.formCustom.riderName,
            mobileNo:""+this.formCustom.mobileNo,
            cardNo:""+this.formCustom.cardNo
          })
      }
      let _this =  this
      this.$api.get('/rider/rechargelist',listdata,reset => {
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
