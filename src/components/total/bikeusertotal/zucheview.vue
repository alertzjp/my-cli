<template>
  <div id="">
    <Modal v-model="show" width="900" :fullscreen="fullscreen"  :mask-closable="false" @on-cancel="cancel">
      <div slot="header">
        【{{formCustom.userName}}】租车记录
         <span class="header-tool">
           <span class="pointer" v-if="!fullscreen" @click="quanping()">
              <Icon type="md-expand" size="20" color="#999" />
           </span>
           <span class="pointer" v-if="fullscreen" @click="zoomToll()">
             <Icon type="ios-photos-outline" size="20" color="#999" />
           </span>
         </span>
      </div>
      <div class="tableListForm">
        <Form ref="formCustom" :model="formCustom" :label-width="90">
            <Row>
                <Col :xs="24" :sm="24" :md="12" :lg="12">
                   <FormItem label="二维码编号">
                    <Input type="text" v-model="formCustom.bikeNo"></Input>
                   </FormItem>
                </Col>
                <Col :xs="24" :sm="24" :md="12" :lg="12">
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
                  <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
              </div>
         </Col>
      </Row>
      <div slot="footer">
        <Button type="error" @click="cancel()" size="large">返回</Button>     
      </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    selectitem:{
      default () {
        return {}
      }
    },
    formCustomitem:{
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      show:false,
      loading:false,
      fullscreen:false,
      formCustom:{
        id:"",
        bikeNo:"",
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
              minWidth:120,
              fixed:"left"
          },
          {
              title: '用户名',
              key: 'riderName',
              minWidth:100,
          },
          {
              title: '手机号',
              key: "mobileNo",
              minWidth:100,
          },
          {
              title: '借车站点',
              key: "rentName",
              minWidth:150,
          },
          {
              title: '借车时间',
              key: "beginTime",
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '还车站点',
              minWidth:150,
              key: 'returnName',
          },
          {
              title: '还车时间',
              minWidth:150,
              key: 'endTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆状态',
              key: "bicycleStatus",
              minWidth:80,
              render: (h, params) => {
                let str = this.$status.bicycleStatus(params.row.bicycleStatus)
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
              title: '租车方式',
              key: "flowStatus",
              minWidth:100,
              render: (h, params) => {
                let str = params.row.scanType==0?"手机扫码":params.row.scanType==1?"银行卡":"公交卡"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车时长(分钟)',
              key: "rentTime",
              minWidth:120,
          },
      ]
     }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.id = this.selectitem.id
    this.formCustom.mobileNo = ''+this.selectitem.mobileNo
    this.formCustom.userName = ''+this.selectitem.userName
    this.formCustom.startTime = ''+this.formCustomitem.startTime
    this.formCustom.endTime = ''+this.formCustomitem.endTime
    this.show = true
    this.list()
  },
  methods: {
    quanping () {
      this.fullscreen = !this.fullscreen
    },
    zoomToll () {
      this.fullscreen = !this.fullscreen
    },
    list () {
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          mobileNo:this.formCustom.mobileNo,
          bikeNo:this.formCustom.bikeNo,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime
        })
     }
      let _this =  this
      this.$api.get('/bicyclerent/list',listdata,reset => {
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
    pageComponentDate (e) {
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    handleSubmit (name) {
        this.pageData.pageCurrent=1
        this.list()
    },
    cancel(e) {
      this.$emit("emitcomponent",e?true:false)
    }
  }
}
</script>
<style lang="less" scoped>
.header-tool{
  position: absolute;
  top:13px;
  right:40px;
  span{
    padding: 0 10px;
  }
}
</style>
