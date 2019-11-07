<template>
  <div class="">
    <Modal v-model="show" width="1000" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>【{{itemdata.name}}({{itemdata.mobileNo}})】租车记录</span>
       </p>
       <div style="text-align:left;">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="">
                     <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                     <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
                </div>
            </Col>
         </Row>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
  },
  props:{
    itemdata:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      warningBikeType:'1',
      warningInfo:"",
      pageshow:false,
      show:true,
      loading:false,
      formCustom:{
        mobileNo:""
      },
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
              title: '借出站点',
              key: "rentName",
              minWidth:100,
          },
          {
              title: '归还站点',
              minWidth:100,
              key: 'returnName',
          },
          {
              title: '借出时刻',
              key: "beginTime",
              minWidth:100,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '还车时刻',
              minWidth:100,
              key: 'endTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车状态',
              key: "flowStatus",
              minWidth:80,
          },
          {
              title: '租车方式',
              key: "flowStatus",
              minWidth:80,
              render: (h, params) => {
                let str = params.row.scanType==0?"手机扫码":params.row.scanType==1?"银行卡":"公交卡"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车费用',
              key: "flowStatus",
              minWidth:100,
              render: (h, params) => {
                let str = params.row.flowStatus=="已支付"?params.row.amount==null?"---":"￥"+params.row.amount:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '调整后费用',
              key: "flowStatus",
              minWidth:100,
              render: (h, params) => {
                let str = params.row.flowStatus=="已支付"?params.row.rentCharge==null?"---":"￥"+params.row.amount:""
                return h('div', [
                    h('span', str)
              ])
           }
          },

          {
              title: '租车时长',
              key: "rentTime",
              minWidth:100,
              render: (h, params) => {
                let str = params.row.rentTime?params.row.rentTime+"分钟":"---"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '车辆状态',
          //     key: "bicycleStatus",
          //     minWidth:100,
          //     render: (h, params) => {
          //       let str = this.$status.bicycleStatus(params.row.bicycleStatus)
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
      ]
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.mobileNo = this.itemdata.mobileNo
      // this.formCustom.bike_no = "5721702959"
      this.list()
  },
  methods: {
    pageComponentDate (e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    },
    list() {
      let _this = this
      let data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          mobileNo:this.formCustom.mobileNo,
        })
      }
      this.loading = true
      this.$api.get('/bicyclerent/list',data,reset => {
        _this.loading = false
          if (reset.codeId === 1) {
              _this.data = reset.resData.list
              _this.pageData.totalCount = reset.resData.totalCount
              _this.pageshow = true
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",this.formCustom)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
