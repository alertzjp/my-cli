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
                   <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入账号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="来电时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
             <!--               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">-->
             <!--                 <FormItem label="报障类型">-->
             <!--                  <faultType-component @emitfault="emitfault" :faulttype="formCustom.faulttype"></faultType-component>-->
             <!--                 </FormItem>-->
             <!--               </Col>-->
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                  <FormItem label="解决状态">
                    <Select v-model="formCustom.solveFlag" placeholder="请选择解决状态">
                       <Option value="">全部</Option>
                       <Option value="1">已解决</Option>
                       <Option value="0">未解决</Option>
                   </Select>
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
     <div class="tableListOperator">
       <Buttoncomponent title="新增"  @emitButton="add" icon='md-add' ></Buttoncomponent>
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
    <add-component v-if="addroleshow" :addroleshow="addroleshow" @emitrolecomponent="emitrolecomponent"></add-component>
    <updateSolveById-component v-if="solveshow" :selectitem="selectitem"  @emitendcomponent="emitendcomponent"></updateSolveById-component>
   </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import addComponent from "./add.vue"
  import updateSolveByIdComponent from './updateSolveById.vue'
  // import faultTypeComponent from "../../pub/faultTypecomponent.vue"

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    addComponent,
    updateSolveByIdComponent
    // faultTypeComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addroleshow:false,
      solveshow:false,
      selectitem:{},
      timearr:[],
      formCustom:{
          bikeNo:"",
          mobileNo:"",
          solveFlag:"",
          startTime:"",
          endTime: "",
          pageCurrent:1,
          pagesize:10,
        // fault_type:"",
        // faulttype:""
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
            title: '账号',
              key: "mobileNo",
              minWidth:100,
          },
        {
          title: '姓名',
          key: "name",
          minWidth: 100,
        },
        {
          title: '来电号码',
          key: "callMobile",
          minWidth: 100,
        },
        {
              title: '来电时间',
              key: 'created_time',
            minWidth: 120,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.created_time)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
        },
        {
          title: '登记人',
          key: "workerName",
          minWidth: 100,
        },
        {
              title: '登记时间',
              key: 'created_time',
            minWidth: 120,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.created_time)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
        },
        {
              title: '报障类型',
              minWidth:100,
              key: 'fault_type',
          },
          {
              title: '问题描述',
              key: "fault_content",
              minWidth:100,
          },
          {
              title: '客服记录',
              key: "detail",
              minWidth:100,
          },
          {
            title: '状态',
              key: "detail",
              minWidth:100,
              render: (h, params) => {
                  let _this = this;
                  let str = '';
                  if(params.row.solveFlag==1){
                    str="已解决"
                  }else if(params.row.solveFlag==0){
                    str="未解决"
                  }else{
                    str="--"
                  }
                  return h('div', {

                    },str)
              }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:120,
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
                            display:_this.$hasPerm("/customerBicycle/updateSolveById")?params.row.solveFlag!==1?"":"none":"none"
                        },
                        on: {
                            click: () => {
                              this.selectitem = params.row
                              this.solveshow = true
                            }
                        }
                    }, '解决问题'),
                  ]);
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
          if(vla.searchobj.pageCurrent){
             this.pageData.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.pageData.pagesize = vla.searchobj.pagesize
          }
        }
      })
    }
    this.list();
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/comingcall/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    emitendcomponent () {
        this.addshow = false
        this.Restitushow = false
        this.solveshow = false
        this.list()
    },
    // emitfault (e) {
    //   this.formCustom.fault_type = ""+e.id
    //   this.formCustom.faulttype=e.id
    // },
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
    },
    emitrolecomponent(e){
     this.addroleshow = false;
     this.list()
   },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    add(){
      this.addroleshow = true;
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
          data: JSON.stringify({
            token:this.$webapi.get('token'),
            pageNo:""+this.pageData.pageCurrent,
            pageSize:""+this.pageData.pagesize,
            mobileNo:this.formCustom.mobileNo,
            // fault_type:this.formCustom.fault_type,
            bikeType:'1',
            bikeNo:this.formCustom.bikeNo,
            solveFlag:this.formCustom.solveFlag,
            startTime:this.formCustom.startTime?this.formCustom.startTime+" 00:00:00":"",
            endTime:this.formCustom.endTime?this.formCustom.endTime+" 23:59:59":""
          })
      }
      let _this =  this
      this.$api.get('/customerBicycle/lightalkBicycle',listdata,reset => {
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
