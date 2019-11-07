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
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="解决状态">
                    <Select v-model="formCustom.solveFlag"  placeholder="请选择解决状态">
                       <Option value="">全部</Option>
                       <Option value="1">解决</Option>
                       <Option value="0">未解决</Option>
                   </Select>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="故障类型">
                   <Select v-model="formCustom.fault_type">
                      <Option value="">全部类型</Option>
                      <Option value="1">结构故障</Option>
                      <Option value="2">电器故障</Option>
                      <Option value="3">其他</Option>
                  </Select>
                  <faultTypecomponent @emitfault="emitfault"></faultTypecomponent>
                 </FormItem>
               </Col> -->
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
     <!-- <div class="tableListOperator">
       <Button type="primary" icon="md-add" size="large" @click="add">新增</Button>
     </div> -->
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
    <add-component v-if="addroleshow" :selectitem="selectitem" @emitcomponent="emitendcomponent"></add-component>
    <updateSolveById-component v-if="solveshow" :selectitem="selectitem"  @emitendcomponent="emitendcomponent"></updateSolveById-component>
   </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import addComponent from "./add.vue"
  import updateSolveByIdComponent from './updateSolveById.vue'
  import faultTypecomponent from '../../pub/faultTypecomponent.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    addComponent,
    updateSolveByIdComponent,
    faultTypecomponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      solveshow:false,
      addroleshow:false,
      timearr:[],
      formCustom:{
          bikeNo:"",
          mobileNo:"",
          solveFlag:"",
          startTime:"",
          endTime:"",
          fault_type:"",
        LoginAccount: "",
        pageCurrent:1,
        pagesize:10,
      },
      selectitem:{},
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
          },
          {
              title: '报障日期',
              key: 'created_time',
              minWidth:150,
              sortable: true,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.createTime)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
          },
        {
          title: '账号',
          key: "LoginAccount",
          minWidth: 150,
        },
        {
          title: '姓名',
          key: "name",
          minWidth: 150,
        },
          {
            title: '手机号',
              key: "mobileNo",
              minWidth:150,
          },
          {
              title: '报障类型',
              key: "faultType",
              minWidth:100,
          },
          {
              title: '报障人',
              minWidth:100,
              render: (h, params) => {
               let str = params.row.userFlag==1?"用户报障":params.row.userFlag==2?"维修巡检":""
               return h('div', [
                   h('span', str)
             ])
           }
          },
          {
              title: '状态',
              key: "solveFlag",
              minWidth:100,
              render: (h, params) => {
               let str = params.row.solveFlag==1?"解决":params.row.solveFlag==0?"未解决":""
               return h('div', [
                   h('span', str)
             ])
           }
          },
          {
              title: '报障描述',
              key: "faultContent",
              minWidth:100,
          },
          {
              title: '维修日期',
              key: "detail",
              minWidth:150,
              sortable: true,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.endTime)/1000)
               return h('div', [
                   h('span', str)
             ])
           }
          },
          {
              title: '其他',
              key: 'action',
              align: 'center',
              minWidth:100,
              render: (h, params) => {
                let _this = this;
                  if(params.row.image){
                    return h('div', [
                      h('img', {
                            attrs: {
                                src: params.row.image
                            },
                            style: {
                                width: '40px',
                                height: '40px'
                            },
                            on:{
                              'click':function () {
                                if(params.row.image){
                                  _this.$webapi.getimg(params.row.image)
                                }
                              }
                            }
                        }),
                    ]);
                  }else {
                    return h('div',"---");
                  }
              }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:150,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                    // h('Button', {
                    //     props: {
                    //         type: 'primary',
                    //         size: 'default'
                    //     },
                    //     style: {
                    //         marginRight: '5px',
                    //         marginRight: '5px',
                    //     },
                    //     on: {
                    //         click: () => {
                    //           this.selectitem = params.row
                    //           this.solveshow = true
                    //         }
                    //     }
                    // }, '设置车辆维修状态'),
                    h('Button', {
                        props: {
                            type: 'warning',
                            size: 'default'
                        },
                        style: {
                            marginRight: '5px',
                            display:_this.$hasPerm("/customerBicycle/update")?params.row.solveFlag==0?"":"none":"none"
                        },
                        on: {
                            click: () => {
                               _this.selectitem = params.row
                               _this.addroleshow = true
                            }
                        }
                    }, '分配维修人员')
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
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/peopletotal/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    emitendcomponent (e) {
        this.addroleshow = false
        this.Restitushow = false
        this.solveshow = false
        if(e){
            this.list()
        }
    },
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
    emitfault(e){
      this.formCustom.fault_type=e.id||"";
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
            // fault_type:''+this.formCustom.fault_type,
            bikeNo:this.formCustom.bikeNo,
            solveFlag:this.formCustom.solveFlag,
            startTime:this.formCustom.startTime,
            endTime: this.formCustom.endTime,
            LoginAccount: this.formCustom.LoginAccount,
          })
      }
      let _this =  this
      this.$api.get('/customerBicycle/userReportingList',listdata,reset => {
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
