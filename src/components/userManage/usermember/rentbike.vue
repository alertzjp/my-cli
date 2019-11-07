<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(1) || formCustom.IShow==1">
                   <FormItem label="车辆二维码">
                       <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                   </FormItem>
               </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(2) || formCustom.IShow==1">
               <FormItem label="账号">
                 <Input type="text" v-model="formCustom.LoginAccount" placeholder="请输入账号"></Input>
               </FormItem>
             </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(3) || formCustom.IShow==1">
                   <FormItem label="手机号">
                       <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5" v-if="tabshow(4) || formCustom.IShow==1">
                   <FormItem label="租还时间">
                       <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                   </FormItem>
               </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(5) || formCustom.IShow==1">
               <FormItem label="租车站点">
                 <docksite-component @EmitDocksiteComponent="siteIdRent" :docksiteNo="formCustom.docksiteno" placeholder="请选择租车站点"></docksite-component>
               </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(6) || formCustom.IShow==1">
              <FormItem label="还车站点">
                <docksite-component @EmitDocksiteComponent="siteIdReturn" :docksiteNo="formCustom.docksiteno" placeholder="请选择还车站点"></docksite-component>
               </FormItem>
           </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(7) || formCustom.IShow==1">
                <FormItem label="租车状态">
                  <Select v-model="formCustom.flowStatus" placeholder="请选择租车状态">
                     <Option value="">全部</Option>
                     <Option value="0">未结算</Option>
                     <Option value="1">已结算未支付</Option>
                     <Option value="2">结束</Option>
                     <Option value="3">回退</Option>
                 </Select>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(8) || formCustom.IShow==1">
               <FormItem label="租车方式">
                 <Select v-model="formCustom.scanType" placeholder="请选择租车方式">
                    <Option value="">全部</Option>
                    <Option value="0">手机扫码</Option>
                    <Option value="1">银行卡</Option>
                    <Option value="2">公交卡</Option>
                </Select>
               </FormItem>
            </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70">
                         <Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent>
                         <!-- <Buttoncomponent title="展开"  icon="ios-arrow-down" @emitButton="tabopen" v-if="formCustom.IShow==0"></Buttoncomponent>
                         <Buttoncomponent title="收起"  icon="ios-arrow-up" @emitButton="tabopen" v-else></Buttoncomponent> -->
                       </span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <!--操作按钮-->
    <div class="tableListOperator">
       <Buttoncomponent title="导出昨日骑行次数"  icon="md-arrow-down" v-if="$hasPerm('/statistic/export/rider_count_yesterday')" @emitButton="exportfile"></Buttoncomponent>
       <Buttoncomponent title="调整" v-if="$hasPerm('/customerBicycle/addRestitution')" @emitButton="tiaozheng"></Buttoncomponent>
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
   <register-component v-if="registershow" :selectitem="selectitem" @emitcomponent="emitcomponent"></register-component>
   <huanche-component v-if="huancheshow" :selectitem="selectitem" @emitcomponent="emitcomponent"></huanche-component>
   <restitution-component v-if="restitushow" :selectitem="selectitem" lockprice="1" @emitendcomponent="emitcomponent"></restitution-component>
  </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import registerComponent from './register.vue'
  import huancheComponent from './huanche.vue'
  import RestitutionComponent from '../../pub/Restitution.vue'
  import docksiteComponent from "../../pub/bicycledocksite.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    registerComponent,
    huancheComponent,
    RestitutionComponent,
    docksiteComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      registershow:false,
      huancheshow:false,
      restitushow:false,
      timearr:[],
      docsitedata:[],
      selectitem:{},
      setectitem:{},
      formCustom:{
          IShow:1,
          mobileNo:"",
          riderName:"",
          bikeNo:"",
          scanType:"",
          startTime:"",
          endTime:"",
          flowStatus: "",
          LoginAccount: "",
          siteIdRent:"",
          siteIdReturn:"",
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
           title: ' ',
           align:'center',
           key: 'checkBox',
           minWidth:50,
           fixed:"left",
           render:(h,params)=>{
               return h('div',[
                   h('Checkbox',{
                       props:{
                           value:params.row.checkBox,
                           size:'large'
                       },
                       on:{
                           'on-change':(e)=>{
                               this.data.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                                   this.$set(items,'checkBox',false)
                               });
                               this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                               e?this.selectitem = this.data[params.index]:this.selectitem=[];
                               this.selectitem = this.data[params.index]
                           }
                       }
                   })
               ])
           }
          },
          {
              title: '车辆二维码',
              key: 'bikeNo',
              minWidth:100,
          },
        {
          title: '账号',
          key: "loginAccount",
          minWidth: 120,
        },
          {
              title: '姓名',
              key: 'riderName',
              minWidth:80,
          },
        {
          title: '手机号',
          key: "mobileNo",
          minWidth: 120,
        },
          {
              title: '租车时间',
              key: "beginTime",
              width:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '还车时间',
              width:90,
              key: 'endTime',
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车站点',
              key: "rentName",
              minWidth:90,
          },
          {
              title: '还车站点',
              minWidth:90,
              key: 'returnName',
          },

          {
              title: '租车状态',
              key: "flowStatus",
              width:90,
              render: (h, params) => {
                let str = params.row.flowStatus=="已支付"?"结束":params.row.flowStatus
                return h('div', [
                    h('span', str)
              ])
           }
          },
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
          {
              title: '调整后费用',
              key: "flowStatus",
              minWidth:100,
              render: (h, params) => {
                let str = params.row.flowStatus=="已支付"?params.row.rentCharge==null?"--":"￥"+params.row.tradeAmount:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
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
          // {
          //     title: '车辆状态',
          //     key: "bicycleStatus",
          //     minWidth:90,
          //     render: (h, params) => {
          //       let str = this.$status.bicycleStatus(params.row.bicycleStatus)
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
          // {
          //     title: '操作',
          //     key: 'action',
          //     align: 'center',
          //     fixed:"right",
          //     minWidth:220,
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     display:_this.$hasPerm('/customerBicycle/addlightalk_rent')?params.row.flowStatus=="未结算"?"":"none":"none"
          //                  },
          //                 on: {
          //                     click: () => {
          //                       _this.selectitem = params.row
          //                       _this.registershow = true
          //                     }
          //                 }
          //             }, '登记报障'),
          //             h('Button', {
          //                 props: {
          //                     type: 'success',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     display:_this.$hasPerm('/bicycle/order/setAccessStatusAndRinging')?(params.row.flowStatus=="未结算" || params.row.bicycleStatus==5)?"":"none":"none"
          //                  },
          //                 on: {
          //                     click: () => {
          //                       _this.selectitem = params.row
          //                       _this.huancheshow = true
          //                     }
          //                 }
          //             }, '手工还车'),
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
    this.getdocsite();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/userManage/usermember/rentbike"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    tabshow (e) {
      return this.$webapi.GETTABSIZE(this.formCustom.IShow,e)
    },
    tabopen () {
      this.formCustom.IShow = this.formCustom.IShow==0?1:0
    },
    siteIdRent (e) {
      this.formCustom.siteIdRent = e.id || ""
    },
    siteIdReturn (e) {
      this.formCustom.siteIdReturn = e.id || ""
    },
    ifshow () {
       return this.selectitem.id?true:false
    },
    tiaozheng () {
      if(this.ifshow()){
        if(this.selectitem.rentCharge==null){
            this.restitushow = true
        }else {
          let bikeNo = this.selectitem.bikeNo?this.selectitem.bikeNo:""
          this.$Message.error("【"+bikeNo+"】"+"已经调整过了")
        }
      }else{
        this.$Message.error("先选择一项")
      }
    },
    getdocsite(){
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           status: "1"
         })
      }
      let _this =  this
      this.$api.get('/bicycledocksite/public/listNopage',listdata,reset => {
        if (reset.codeId === 1) {
           _this.docsitedata = reset.resData
        }else if(reset.codeId === -9){
          _this.docsitedata = [];
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    exportfile () {
      let data = {
         token:this.$webapi.get('token')
      }
      let _this = this;
      this.$api.get('/statistic/export/rider_count_yesterday',data,reset => {
        if(reset.codeId==undefined || reset.codeId==null){
          window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/statistic/export/rider_count_yesterday',data)
        }else {
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    emitcomponent (e) {
      this.registershow = false
      this.huancheshow = false
      this.restitushow = false
      this.selectitem={}
      this.list()
    },
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    EmitoperatorComponent(e){
      this.formCustom.operatorId=e.id||"";
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
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
           flowStatus: this.formCustom.flowStatus,
           LoginAccount: this.formCustom.LoginAccount,
           siteIdRent:this.formCustom.siteIdRent?""+this.formCustom.siteIdRent:"",
           siteIdReturn:this.formCustom.siteIdReturn?""+this.formCustom.siteIdReturn:""
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
  }
}
</script>
<style lang="less" scoped>
</style>
