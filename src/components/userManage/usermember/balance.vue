<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm" v-if="formshow">
           <Form ref="formCustom" :model="formCustom" :label-width="70">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="会员名">
                           <Input type="text" v-model="formCustom.name"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="手机号码">
                          <Input type="text" v-model="formCustom.mobileNo"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" :xxl="3">
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
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
    <refundComponent v-if="refundshow" :refundshow="refundshow" :propsid="id" :selectitem="selectitem" @emitcomponent="emitcomponent"></refundComponent>
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import refundComponent from './refund.vue'
export default {
  name: "",
  components:{
    tableComponent,
    refundComponent,
    Paging:Pages,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      refundshow:false,
      selectitem:{},
      id:'',
      formCustom:{
        id:"",
        name:'',
        mobileNo:'',
      },
      formshow:true,
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '会员名',
              key: 'riderName',
              minWidth:110,
          },
          {
              title: '手机号码',
              minWidth:110,
              key: 'mobileNo',
          },
          {
              title: '卡类型',
              minWidth:80,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.accountType==1){
                     type="会员卡"
                   }else if(params.row.accountType==2){
                     type="团体卡"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '充值金额',
              minWidth:80,
              key: 'sumRecharge',
          },
          {
              title: '消费金额',
              minWidth:80,
              key: 'sumConsume',
          },
          {
              title: '余额',
              minWidth:80,
              key: 'balance',
          },
          {
              title: '帐号状态',
              minWidth:80,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.isDeleted==1){
                     type="删除"
                   }else if(params.row.isDeleted==0){
                     type="正常"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '创建时间',sortable: true,
              key: 'createDate',
              minWidth:100,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '修改时间',
              key: 'lastModifyDate',
              minWidth:100,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.lastModifyDate)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:100,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/rider/balance_refund')?(params.row.balance>0)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.id=params.row.id;
                                this.selectitem = params.row
                                this.refundshow=true;
                              }
                          }
                      }, '退款')
                  ]);
              }
          }
      ],
    }
  },
  mounted() {
    this.formCustom.name=this.$route.query.name;
    this.formCustom.id=this.$route.query.id;
    if(this.formCustom.id){
      this.formshow = false
    }
    this.list()
  },
  methods: {
    pageComponentDate (e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    },
    emitcomponent(e){
      this.refundshow=false;
      this.list()
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      this.loading = true
      let data = {
             token:this.$webapi.get('token'),
             pageNo:this.pageData.pageCurrent,
             pageSize:this.pageData.pagesize,
             name:this.formCustom.name,
             riderId:this.formCustom.id,
             mobileNo:this.formCustom.mobileNo
           }
      let _this =  this
      this.$api.get('/rider/balance_list',data,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.data=reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
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
