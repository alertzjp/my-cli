<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="退款类型">
                    <Select v-model="formCustom.tradeType">
                       <Option value="">全部</Option>
                       <Option value="2">支付宝</Option>
                       <Option value="3">微信</Option>
                   </Select>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="姓名">
                     <Input type="text" v-model="formCustom.riderName"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="手机号码">
                      <Input type="text" v-model="formCustom.mobileNo"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="订单号">
                     <Input type="text" v-model="formCustom.orderNo"></Input>
                  </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="时间">
                    <time-component @timeEmit="timeEmit"></time-component>
                  </FormItem>
               </Col> -->
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
      formCustom:{
        tradeStatus:'',
        tradeType:'',
        riderName:'',
        mobileNo:'',
        orderNo:'',
        startTime:'',
        endTime:''
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '订单号',
              key: 'orderNo',
              minWidth:120,
          },
          {
              title: '姓名',
              key: "riderName",
              minWidth:100,
          },
          {
              title: '手机号码',
              key: "mobileNo",
              minWidth:110,
          },
          {
              title: '退款类型',
              minWidth:100,
              key: 'tradeType',
              render: (h, params) => {
                   let _this = this;
                   let status = '';
                   if(params.row.tradeType==3){
                     status="微信"
                   }else if(params.row.tradeType==2){
                     status="支付宝"
                   }
                   else if(params.row.tradeType==1){
                     status="银行卡"
                   }
                   return h('div', {
                  },status)
             }
          },
          {
              title: '创建时间',sortable: true,
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
      this.loading = true
      let listdata= {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          riderName:""+this.formCustom.riderName,
          mobileNo:""+this.formCustom.mobileNo,
          startTime:""+this.formCustom.startTime,
          endTime:""+this.formCustom.endTime,
          tradeStatus:this.formCustom.tradeStatus,
          tradeType:this.formCustom.tradeType,
          outTradeNo:this.formCustom.outTradeNo,
          orderNo:this.formCustom.orderNo
        })
      }

      let _this =  this
      this.$api.get('/bicycleRefundOverdue/list',listdata,reset => {
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
