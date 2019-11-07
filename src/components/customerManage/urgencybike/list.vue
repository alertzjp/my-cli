<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车辆二维码">
                     <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                  </FormItem>
               </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
               <FormItem label="账号">
                 <Input type="text" v-model="formCustom.LoginAccount" placeholder="请输入账号"></Input>
               </FormItem>
             </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="手机号">
                     <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                  </FormItem>
               </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="报急时间">
                    <time-component @timeEmit="timeEmit" v-bind:type="3"
                                    :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="租车状态">
                    <Select v-model="formCustom.flowStatus" placeholder="请选择租车状态">
                       <Option value="">全部</Option>
                       <Option value="2">结束</Option>
                       <Option value="0">未结算</Option>
                   </Select>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <div class="tableListOperator">
       <Buttoncomponent title="结束计费" @emitButton="endPrice" v-if="$hasPerm('/customerBicycle/endCost')"></Buttoncomponent>
       <Buttoncomponent title="调整费用" @emitButton="tiaozheng" v-if="$hasPerm('/customerBicycle/addRestitution')"></Buttoncomponent>
       <Buttoncomponent title="手工还车" type="success" @emitButton="shougong" v-if="$hasPerm('/bicycle/order/setAccessStatusAndRinging')"></Buttoncomponent>
       <Buttoncomponent title="调整车辆状态" @emitButton="zuchestatus" v-if="$hasPerm('/bicycle/updateByNo')"></Buttoncomponent>
       <Buttoncomponent title="锁状态" @emitButton="LockStatus" v-if="$hasPerm('/bicycle/order/getLockStatus')"></Buttoncomponent>
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
  <endMoney-component v-if="addshow" :selectitem="newdata[0]"  @emitendcomponent="emitendcomponent"></endMoney-component>
  <Restitution-component v-if="Restitushow" :selectitem="newdata[0]" lockprice="1" idshow="1" @emitendcomponent="emitendcomponent"></Restitution-component>
  <updateSolveById-component v-if="solveshow" :selectitem="newdata[0]"  @emitendcomponent="emitendcomponent"></updateSolveById-component>
  <edit-component v-if="editshow" :selectitem="newdata[0]"  @emitcomponent="emitendcomponent"></edit-component>
  <register-component v-if="registershow" :selectitem="newdata[0]" @emitcomponent="emitendcomponent"></register-component>
  <huanche-component v-if="huancheshow" :selectitem="newdata[0]" @emitcomponent="emitendcomponent"></huanche-component>
   </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import endMoneyComponent from './endNewMoney.vue'
  import RestitutionComponent from '../../pub/Restitution.vue'
  import updateSolveByIdComponent from './updateSolveById.vue'
  import registerComponent from './register.vue'
  import editComponent from './edit.vue'
  import huancheComponent from './huanche.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    endMoneyComponent,
    RestitutionComponent,
    updateSolveByIdComponent,
    editComponent,
    registerComponent,
    huancheComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addshow:false,
      editshow:false,
      Restitushow:false,
      huancheshow:false,
      solveshow:false,
      registershow:false,
      timearr:[],
      id:"",
      newdata:[],
      selectitem:{},
      checkdata:{},
      gongtype:1,
      formCustom:{
          bikeNo:"",
          mobileNo:"",
          startTime:"",
          endTime:"",
        solveFlag: "",
        status: "",
        LoginAccount: "",
        flowStatus:'',
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
            key: 'checkBox',
            minWidth:40,
            fixed:"left",
             render:(h,params)=>{
                 return h('div',[
                     h('Checkbox',{
                         props:{
                             value:params.row.checkBox,
                             size:"large"
                         },
                         on:{
                             'on-change':(e)=>{
                                 this.data.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                                     this.$set(items,'checkBox',false)
                                 });
                                 this.newdata = []
                                 this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                                 if(e){
                                    this.newdata.push(params.row)
                                 }
                             }
                         }
                     })
                 ])
             }
          },
          {
              title: '车辆二维码',
              key: 'bikeNo',
              minWidth:80,
          },
        {
          title: '账号',
          key: "LoginAccount",
          minWidth: 80,
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 60,
        },
          {
              title: '手机号',
              key: "mobileNo",
              minWidth:80,
          },
          {
              title: '报急时间',
              key: "createTime",
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '租车订单ID',
          //     minWidth:90,
          //     key: 'rentId',
          // },
          {
              title: '开始租车时间',
              minWidth:100,
              key: 'beginTime',
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '结束租车时间',
              key: "endTime",
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆状态',
              minWidth:80,
              key: 'status',
              render: (h, params) => {
                let str = this.$status.bicycleStatus(params.row.bicycleStatus)
               // if(params.row.solveFlag==1){
               //    str= "可租"
               // }else{
               //    str= this.$status.bicycleStatus(params.row.bicycleStatus)
               // }
               return h('div', [
                  h('span', str)
              ])
           }
          },
          {
               title: '租车费用(元)',
               key: "flowStatus",
               minWidth:70,
               sortable: true,
               render: (h, params) => {
                 let tradeAmount = params.row.tradeAmount || 0
                 let str = params.row.flowStatus==2?params.row.rentCharge==null?"￥"+tradeAmount:"￥"+params.row.rentCharge:""
                 return h('div', [
                     h('span', str)
               ])
            }
           },
          // {
          //     title: '调整前金额',
          //     key: "tradeAmount",
          //     minWidth:80,
          //     render: (h, params) => {
          //       let str=params.row.rentCharge?"￥"+params.row.rentCharge:"￥0"
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
          {
              title: '调整后金额',
              key: "restitutionCharge",
              minWidth:70,
              sortable: true,
              render: (h, params) => {
                // let restitutionCharge = params.row.restitutionCharge?"￥"+ params.row.restitutionCharge:"---"
                //let str = restitutionCharge;
                let str = params.row.flowStatus==2?params.row.rentCharge==null?"--":"￥"+params.row.tradeAmount:""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '报障人',
              key: "restitutionCharge",
              minWidth:80,
              render: (h, params) => {
                let str = params.row.userFlag==1?"用户报障":"维护人员保障"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '报障类型',
              key: "faultType",
              minWidth:80,
          },
          {
              title: '租车状态',
              key: "restitutionCharge",
              minWidth:70,
              render: (h, params) => {
                  // let str = params.row.flowStatus==0?"未结算":"结束";
                  let str = '';
                  if(params.row.flowStatus == 0){
                    str = '未结算';
                  }
                  if(params.row.flowStatus == 1){
                    str = '已结算未支付';
                  }
                  if(params.row.flowStatus == 2){
                    str = '结束';
                  }
                  if(params.row.flowStatus == 3){
                    str = '回退';
                  }
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '操作',
          //     key: 'action',
          //     align: 'center',
          //     minWidth:500,
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //           h('Button', {
          //               props: {
          //                   type: 'primary',
          //                   size: 'default'
          //               },
          //               style: {
          //                   marginRight: '5px',
          //                   // display:_this.$hasPerm("/customerBicycle/endCost")?(params.row.solveFlag==0 && params.row.bicycleStatus==5)?"":"none":"none"
          //                   display:_this.$hasPerm("/customerBicycle/endCost")?(params.row.solveFlag==0)?"":"none":"none"
          //               },
          //               on: {
          //                   click: () => {
          //                     this.selectitem = params.row
          //                     this.addshow = true
          //                   }
          //               }
          //           }, '结束计费'),
          //           h('Button', {
          //               props: {
          //                   type: 'primary',
          //                   size: 'default'
          //               },
          //               style: {
          //                   marginRight: '5px',
          //                   // display:_this.$hasPerm('/customerBicycle/addRestitution')?(params.row.bicycleStatus==1 && params.row.solveFlag=="1")?"":"none":"none"
          //                   display:_this.$hasPerm('/customerBicycle/addRestitution')?(!params.row.restitutionCharge)?"":"none":"none"
          //               },
          //               on: {
          //                   click: () => {
          //                     if(params.row.restitutionCharge){
          //                       this.$Message.error("【"+params.row.bikeNo+"】"+"已经调整过了")
          //                       return
          //                     }
          //                     this.selectitem = params.row
          //                     this.Restitushow = true
          //                   }
          //               }
          //           }, '调整费用'),
          //           h('Button', {
          //               props: {
          //                   type: 'success',
          //                   size: 'default'
          //               },
          //               style: {
          //                   marginRight: '5px',
          //                   // display:_this.$hasPerm('/bicycle/order/setAccessStatusAndRinging')?(params.row.bicycleStatus==5 && params.row.solveFlag=="0")?"":"none":"none"
          //                   display:_this.$hasPerm('/bicycle/order/setAccessStatusAndRinging')?"":"none"
          //                },
          //               on: {
          //                   click: () => {
          //                     _this.selectitem = params.row
          //                     _this.huancheshow = true
          //                   }
          //               }
          //           }, '手工还车'),
          //           h('Button', {
          //               props: {
          //                   type: 'primary',
          //                   size: 'default'
          //               },
          //               style: {
          //                   marginRight: '5px',
          //                   // display:_this.$hasPerm('/bicycle/updateByNo')?(params.row.bicycleStatus==5 && params.row.solveFlag=="1")?"":"none":"none"
          //                   display:_this.$hasPerm('/customerBicycle/addRestitution')?(params.row.bicycleStatus!=1)?"":"none":"none"
          //               },
          //               on: {
          //                   click: () => {
          //                     this.selectitem = params.row
          //                     this.zuchepost()
          //                   }
          //               }
          //           }, '调整租车状态'),
          //           h('Button', {
          //               props: {
          //                   type: 'primary',
          //                   size: 'default'
          //               },
          //               style: {
          //                   marginRight: '5px',
          //                   display:_this.$hasPerm('/bicycle/order/getLockStatus')?(params.row.flowStatus=="0" && params.row.bicycleStatus==5)?"":"none":"none"
          //               },
          //               on: {
          //                   click: () => {
          //                     this.lock(params.row)
          //                   }
          //               }
          //           }, '查看锁状态'),
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
    if(searchList&&searchList.length>0){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
          if(vla.searchobj.pageCurrent){
             this.pageData.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.pageData.pagesize = vla.searchobj.pagesize
          }
          if(vla.searchobj.solveFlag=="1"){
            this.formCustom.solveFlag=vla.searchobj.solveFlag
          }
        }
      })
    }else{
      this.formCustom.solveFlag=""
    }
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/urgencybike/list"){
        _this.handleSubmit()
      }
    })
    _this.$vm.$on("websocket",function(){
      setTimeout(_this.checkList,1000);

    });
    _this.$vm.$on("refresh",function(){
      _this.list();
    });

  },
  methods: {
    add () {
        this.registershow = true
    },
    endPrice () {
      if(this.newdata.length<1){
        this.$Message.info("紧急车辆没有选择")
        return
      }
      if(this.newdata[0].flowStatus==2){
        this.$Message.info("已支付不能使用结束计费")
        return
      }
      this.addshow = true
    },
    shougong () {
      if(this.newdata.length<1){
        this.$Message.info("紧急车辆没有选择")
        return
      }
      this.huancheshow = true
    },
    tiaozheng () {
      if(this.newdata.length<1){
        this.$Message.info("紧急车辆没有选择")
        return
      }
      if(this.newdata[0].solveFlag==0){
        this.$Message.info("未结算不能使用调整费用")
        return
      }
      if(this.newdata[0].rentCharge!=null){
        this.$Message.info("【"+this.newdata[0].bikeNo+"】已经调整过了")
        return
      }
      this.Restitushow = true
    },
    LockStatus() {
      if(this.newdata.length<1){
        this.$Message.info("紧急车辆没有选择")
        return
      }
      this.lock(this.newdata[0])
    },
    zuchestatus () {
      if(this.newdata.length<1){
        this.$Message.info("紧急车辆没有选择")
        return
      }
      this.zuchepost()
    },
    emitendcomponent () {
        this.addshow = false
        this.Restitushow = false
        this.solveshow = false
        this.editshow =false
        this.registershow = false
        this.huancheshow = false
        this.newdata = []
        this.list()
        let _this = this;
    },
    handleSubmit() {
      this.gongtype = 0
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
      let _this = this;
    },
    zuchepost () {
      let _this = this;
      let  data = {
        token:this.$webapi.get("token"),
        bicycleNo:this.newdata[0].bikeNo
      }
      this.$api.post('/bicycle/updateByNo',data,reset => {
          if (reset.codeId === 1) {
             _this.$Message.info("调整成功")
             _this.list()
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.gongtype = 0
      this.list();
    },
    emitrolecomponent () {
      this.addroleshow = false
      this.list()
    },
    lock (e) {
      let _this = this;
      let  data = {
        token:this.$webapi.get("token"),
        lockId:e.lockId
      }
      this.$api.post('/bicycle/order/getLockStatus',data,reset => {
          if (reset.codeId === 1) {
               _this.$Message.info("当前的锁状态:【"+reset.resData+"】")
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    detail(e){
      this.$router.push({ path: '/admin/customerManage/urgencybike/view',query: {id:e.id}})
    },
    check(e){
      this.addroleshow=true;
      this.checkdata=e;
      this.id=e.id;
    },
    list (){
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
          data: JSON.stringify({
              token:this.$webapi.get('token'),
              pageNo:""+this.pageData.pageCurrent,
              pageSize:""+this.pageData.pagesize,
              mobileNo:this.formCustom.mobileNo,
              // fault_type:fault_type,
              bikeNo:this.formCustom.bikeNo,
              startTime:this.formCustom.startTime?this.formCustom.startTime+" 00:00:00":"",
              endTime:this.formCustom.endTime?this.formCustom.endTime+" 23.59:59":"",
              bikeType:'2',
              fastFlag:'2',
            flowStatus: this.formCustom.flowStatus,
            LoginAccount: this.formCustom.LoginAccount
          })
      }
      let _this =  this
      this.$api.get('/customerBicycle/urgencyBicycleList',listdata,reset => {
        if (reset.codeId === 1) {
            reset.resData.list.forEach((a)=>{
              a.checkBox = false
            })
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
    checkList(){
      var _this = this;
      //修改成全部,第一页
      _this.formCustom.flowStatus = '';
      _this.pageData.pageCurrent = 1;
      _this.list();
    }
  }
}
</script>
<style lang="less" scoped>
</style>
