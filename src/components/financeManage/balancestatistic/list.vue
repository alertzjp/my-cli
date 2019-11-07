<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="24" :md="12" :lg="6">
                  <FormItem label="选择时间">
                      <newtime-component @timeEmit="timeEmit"></newtime-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="24" :md="12" :lg="6">
                 <div class="">
                   <FormItem style="margin-left: -70px;text-align:left">
                       <Button type="primary" @click="handleSubmit()">查询</Button>                       
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="allbox" v-if="totalshow">
              <statistics-component :alltotal="total"></statistics-component>
            </div>
            <div class="clientBox">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
             <div class="">
                <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
             <!-- <div class="refundbox">
                <table-component :loading="loading01" :columnsdata="refundcolumns" :datas="refunddata"></table-component>
                <refundpage-component :pageData="pageData01" @pageComponentDate="pageComponentDate01"></refundpage-component>
             </div> -->
        </Col>
     </Row>
   </div>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import refundpageComponent from '../../pub/page.vue'
import newtimeComponent from '../../pub/newTime.vue'
import statisticsComponent from '../../pub/statisticscomponent.vue'
import expandRow from './tableexpand.vue';
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    refundpageComponent,
    newtimeComponent,
    statisticsComponent,
    expandRow
  },
  data () {
    return {
      loading:false,
      loading01:false,
      totalshow:false,
      formCustom:{
          name:"",
          mobileNo:"",
          startTime:"",
          endTime:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      pageData01:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      total:[
       {
         typeName:"共充值余额",
         num:"",
         rank:"1",
         unit:"1"
       },
       {
         typeName:"共余额退款",
         num:"",
         rank:"2",
         unit:"1"
       },
       {
         typeName:"共入账金额",
         num:"",
         rank:"3",
         unit:"1"
       },
       {
         typeName:"共充值笔数",
         num:"",
         rank:"4",
         unit:"2"
       },
       {
         typeName:"共退款笔数",
         num:"",
         rank:"5",
         unit:"2"
       },
       ],
      data:[],
      refunddata:[],
      refundcolumns:[
        {
            title: '统计时间',
            key: 'time',
            align: 'center',
            minWidth:150,
        },
        {
            title: '余额退款',
            key: "",
            minWidth:300,
            align: 'center',
            children: [
                {
                    title: '金额(元)',
                    key: 'refundAmount',
                    align: 'center',
                    width: 150
                },
                {
                    title: '笔数(笔)',
                    key: 'refundNum',
                    align: 'center',
                    width: 150
                }
            ]
        },
      ],
      columns:[
          {
                 type: 'expand',
                 width: 50,
                 render: (h, params) => {
                     return h(expandRow, {
                         props: {
                             row: params.row
                         }
                     })
                 }
          },
          {
              title: '统计时间',
              key: 'time',
              align: 'center',
              minWidth:150,
          },
          {
              title: '余额充值',
              key: "",
              minWidth:300,
              align: 'center',
              children: [
                  {
                      title: '金额(元)',
                      key: 'rechargeAmount',
                      align: 'center',
                      width: 150
                  },
                  {
                      title: '笔数(笔)',
                      key: 'rechargeNum',
                      align: 'center',
                      width: 150
                  }
              ]
          },
          {
              title: '余额退款',
              key: "",
              minWidth:300,
              align: 'center',
              children: [
                  {
                      title: '金额(元)',
                      key: 'refundAmount',
                      align: 'center',
                      width: 150
                  },
                  {
                      title: '笔数(笔)',
                      key: 'refundNum',
                      align: 'center',
                      width: 150
                  }
              ]
          },
          {
              title: '入账金额',
              key: "profit",
              align: 'center',
          },
      ]
    }
  },
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  mounted() {
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/financeManage/balancestatistic/list"){
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
      this.pageData01.pageCurrent=1;
      if(this.formCustom.startTime&&this.formCustom.endTime){
       this.list()
       //this.refundlist();
     }else{
       this.data=[]
       this.refunddata=[]
       this.total=[]
       this.$Message.warning("请先选择时间")
     }
    },
    exportTable(){
      if(!this.formCustom.startTime&&!this.formCustom.endTime){
        this.$Message.warning("请先选择时间")
        return
      }
      var data={
         token:this.$webapi.get('token'),
         startTime:`${this.formCustom.startTime} 00:00:00`,
         endTime:`${this.formCustom.endTime} 23:59:59`
      }
       var _this=this;
       this.$api.get("/statistic/consume/exportExcel",data,function(res){
          _this.$webapi.exportTable("/statistic/consume/exportExcel",data,res)
       })
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    pageComponentDate01(e){
      this.pageData01.pageCurrent=e.pageCurrent;
      this.pageData01.pagesize=e.pagesize;
      this.refundlist();
    },
    refundlist(){
      this.loading01 = true
      var listdata= {
            token:this.$webapi.get('token'),
            pageNo:this.pageData01.pageCurrent,
            pageSize:this.pageData01.pagesize,
            startTime:`${this.formCustom.startTime} 00:00:00`,
            endTime:`${this.formCustom.endTime} 23:59:59`
      }
      var _this =  this
      this.$api.get('/financial_statistic/balance',listdata,reset => {
        if (reset.codeId === 1) {
           _this.refunddata = reset.resData.list
           _this.pageData01.totalCount=reset.resData.totalCount;
           _this.loading01 = false
        }else if(reset.codeId === -16){
          _this.refunddata = [];
          _this.pageData01=[]
          _this.loading01 = false;
        }else {
          _this.loading01 = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      var listdata= {
            token:this.$webapi.get('token'),
            pageNo:this.pageData.pageCurrent,
            pageSize:this.pageData.pagesize||10,
            startTime:`${this.formCustom.startTime} 00:00:00`,
            endTime:`${this.formCustom.endTime} 23:59:59`
      }
      var _this =  this
      this.$api.get('/financial_statistic/balance',listdata,reset => {
        if (reset.codeId === 1) {
           _this.totalshow=true;
           _this.data = reset.resData.list
           if(reset.resData.totalCount){
               _this.pageData.totalCount=reset.resData.totalCount;
               _this.pageData.pageCurrent=reset.resData.pageNo;
               _this.pageData.pagesize=reset.resData.pageSize;
             }
             _this.total.forEach((v)=>{
                  if(v.rank=="1"){
                    v.num=reset.resData.summary.rechargeAmountSummary
                  }
                  if(v.rank=="2"){
                    v.num=reset.resData.summary.refundAmountSummary
                  }
                  if(v.rank=="3"){
                    v.num=reset.resData.summary.profitSummary
                  }
                  if(v.rank=="4"){
                    v.num=reset.resData.summary.rechargeNum
                  }
                  if(v.rank=="5"){
                    v.num=reset.resData.summary.refundNum
                  }
             })
           _this.loading = false
        }else if(reset.codeId === -16){
          _this.data = [];
          _this.pageData=[];
          _this.totalshow=false;
          _this.loading = false;
        }else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less">
.clientBox{
  .ivu-table-expanded-cell{
    padding: 0!important
  }
}
</style>
