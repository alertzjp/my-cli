<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="二维码编号">
                       <Input type="text" v-model="formCustom.frameNo"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="手机号">
                       <Input type="text" v-model="formCustom.mobileNo"></Input>
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
   <endMoney-component v-if="addshow" :selectitem="selectitem"  @emitendcomponent="emitendcomponent"></endMoney-component>
   <Restitution-component v-if="Restitushow" :selectitem="selectitem"  @emitendcomponent="emitendcomponent"></Restitution-component>
   <updateSolveById-component v-if="solveshow" :selectitem="selectitem"  @emitendcomponent="emitendcomponent"></updateSolveById-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import timeComponent from '../../pub/timecomponent.vue'
import endMoneyComponent from './endMoney.vue'
import RestitutionComponent from '../../pub/Restitution.vue'
import updateSolveByIdComponent from './updateSolveById.vue'
  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    endMoneyComponent,
    RestitutionComponent,
    updateSolveByIdComponent
  },
  data () {
    return {
      loading:false,
      addshow:false,
      Restitushow:false,
      solveshow:false,
      selectitem:{},
      formCustom:{
          frameNo:"",
          mobileNo:""
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
              key: 'frameNo',
              minWidth:150,
          },
          {
              title: '终端编号',
              key: 'terminalNo',
              minWidth:150,
          },
          {
              title: '用户名',
              key: 'riderName',
              minWidth:150,
          },
          {
              title: '手机号',
              key: 'mobileNo',
              minWidth:150,
          },
          {
              title: '租车开始时间',
              key: 'beginTime',
              minWidth:150,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
               return h('div', [
                   h('span', str)
             ])
            }
          },
          {
              title: '租车结束时间',
              key: 'endTime',
              minWidth:150,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
               return h('div', [
                   h('span', str)
             ])
            }
          },
          {
              title: '租车订单ID',
              key: 'id',
              minWidth:150,
          },
          {
              title: '租车状态',
              key: 'flowStatus',
              minWidth:100,
          },
          {
              title: '租车消费金额',
              key: 'tradeAmount',
              minWidth:150,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:280,
              fixed:"right",
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
                               this.detail(params.row)
                            }
                        }
                      }, '详情'),
                      h('Button', {
                          style: {
                              marginRight: '5px',
                              display:(params.row.fastFlag==2)?"inline-block":"none"
                          },
                          on: {
                              click: () => {

                              }
                          }
                      }, '已报急修'),
                      h('Button', {
                          style: {
                              marginRight: '5px',
                              display:(params.row.flowStatus=="未结算")?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.addshow = true
                                _this.selectitem = params.row
                              }
                          }
                      }, '结束计费'),
                      // h('Button', {
                      //     props: {
                      //         type: 'primary',
                      //         size: 'default'
                      //     },
                      //     style: {
                      //         marginRight: '5px'
                      //     },
                      //     on: {
                      //         click: () => {
                      //           this.selectitem = params.row
                      //           this.Restitushow = true
                      //         }
                      //     }
                      // }, '调整金额'),
                      h('Button', {
                         props: {
                             type: 'error',
                             size: 'default'
                         },
                         style: {
                             marginRight: '5px',
                             display:(params.row.fastFlag==1||params.row.fastFlag==null)?"inline-block":"none"
                         },
                         on: {
                             click: () => {
                               _this.$webapi.getMessinfo({
                                 title:"确定要急修二维码编号为【"+params.row.frameNo+"】吗？",
                                 yes () {
                                   _this.urgent(params.row)
                                 }
                               })
                             }
                         }
                     }, '急修'),
                  ]);
              }
          }
      ],
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
    this.list()
  },
  methods: {
    emitendcomponent () {
      this.addshow = false
      this.Restitushow = false
      this.solveshow = false
      this.list()
    },
    pageComponentDate(e){
     this.pageData.pageCurrent=e.pageCurrent;
     this.pageData.pagesize=e.pagesize;
     this.list();
   },
   timeEmit(e){
     this.formCustom.startTime=e[0]||"";
     this.formCustom.endTime=e[1]||"";
   },
    handleSubmit () {
      if(this.flag){
       this.pageData.pageCurrent=1;
      }
      this.list()
    },
    detail(e){
      this.$router.push({ path: '/admin/operatemonitoring/rentcar/detail',query: {item:e}})
    },
    urgent(e){
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          id:e.id,
          bicycle_no:e.frameNo,
          fastFlag:'1',
          bikeType:'1'
        })
      }
      let _this =  this
      this.$api.get('/customerBicycle/updateFastById',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          mobileNo:this.formCustom.mobileNo,
          frameNo:this.formCustom.frameNo,
        })
      }
      let _this =  this
      this.$api.get('/rent/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list;
           if(reset.resData){
            _this.pageData.totalCount=reset.resData.totalCount;
            _this.pageData.pageCurrent=reset.resData.pageNo;
            _this.pageData.pagesize=reset.resData.pageSize;
          };
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
           _this.pageData=[];
          _this.loading = false
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
<style media="screen">
    .ivu-poptip-confirm .ivu-poptip-body-message{
      color:red;
    }
</style>
<style lang="less" scoped>
</style>
