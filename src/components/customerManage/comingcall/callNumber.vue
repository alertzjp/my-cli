<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel" width="900">
      <div slot="header">选择车辆二维码</div>
      <!--查询条件-->
      <div class="tableListForm">
        <Form ref="formCustom" :model="formCustom" :label-width="90">
            <Row>
                <Col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :xxl="12">
                   <FormItem label="车辆二维码">
                      <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                   </FormItem>
                </Col>
                <Col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" :xxl="12">
                  <div class="">
                    <FormItem>
                        <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                    </FormItem>
                  </div>
                </Col>
            </Row>
        </Form>
      </div>
      </Form>
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
      <div slot="footer">
        <!-- <Button type="default"  @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="post()" :loading="loading" style="margin-left: 8px" size="large">保存</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  props: {
    // selectitem:{
    //   default () {
    //     return {}
    //   }
    // }
  },
  components:{
    tableComponent,
    pageComponent,
  },
  data () {
    return {
      show:true,
      loading:false,
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '车辆二维码',
              key: 'bikeNo',
              minWidth:100,
          },
          {
              title: '姓名',
              key: 'riderName',
              minWidth:80,
          },
          {
              title: '手机号',
              key: "mobileNo",
              minWidth:120,
          },
          {
              title: '租车站点',
              key: "rentName",
              minWidth:90,
          },
          {
              title: '租车时间',
              key: "beginTime",
              width:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '还车时间',
          //     width:90,
          //     key: 'endTime',
          //     render: (h, params) => {
          //       let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
          // {
          //     title: '还车站点',
          //     minWidth:90,
          //     key: 'returnName',
          // },

          // {
          //     title: '租车状态',
          //     key: "flowStatus",
          //     width:90,
          // },
          {
              title: '租车方式',
              key: "flowStatus",
              minWidth:90,
              render: (h, params) => {
                let str = params.row.scanType==0?"手机扫码":params.row.scanType==1?"银行卡":"公交卡"
                return h('div', [
                    h('span', str)
              ])
           }
          },

         {
              title: '租车费用(元)',
              key: "flowStatus",
              minWidth:100,
              render: (h, params) => {
                let tradeAmount = params.row.tradeAmount || 0
                let str = params.row.flowStatus=="已支付"?params.row.rentCharge==null?"￥"+tradeAmount:"￥"+params.row.rentCharge:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '调整后费用',
          //     key: "flowStatus",
          //     minWidth:100,
          //     render: (h, params) => {
          //       let str = params.row.flowStatus=="已支付"?params.row.rentCharge==null?"--":"￥"+params.row.tradeAmount:""
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
          {
              title: '租车时长',
              key: "rentTime",
              width:90,
              render: (h, params) => {
                let str = params.row.rentTime?params.row.rentTime+"分钟":"---"
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
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                           },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.emitcar()
                              }
                          }
                      }, '选择'),
                  ]);
              }
          }
      ],
      selectitem:{},
      formCustom:{
          mobileNo:"",
          riderName:"",
          bikeNo:"",
          scanType:"",
          startTime:"",
          endTime:"",
          // bicycleStatus:"2",//骑行
          flowStatus:"0"//未结算
      },
    }
  },
  mounted() {
     this.list()
  },
  methods: {
    startTime (e) {
        this.formCustom.returnTime = e
    },
    emitcar () {
      this.$emit("emitCarComponent",this.selectitem)
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    list () {
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          bikeNo:this.formCustom.bikeNo,
          riderName:this.formCustom.riderName,
          mobileNo:this.formCustom.mobileNo,
          scanType:this.formCustom.scanType,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          flowStatus:this.formCustom.flowStatus,
          // bicycleStatus:this.formCustom.bicycleStatus
        })
      }
      let _this =  this
      this.$api.get('/bicyclerent/list',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          _this.data = reset.resData.list;
          _this.pageData.totalCount=reset.resData.totalCount;
          _this.pageData.pageCurrent=reset.resData.pageNo;
        }else {
          _this.data = [];
          _this.pageData.totalCount=0;
          _this.pageData.pageCurrent=1;
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    cancel() {
      this.$emit("emitCarComponent",false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
