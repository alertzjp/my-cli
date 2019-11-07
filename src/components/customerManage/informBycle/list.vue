<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="80">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车辆二维码">
                     <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆二维码"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="账号">
                   <Input type="text" v-model="formCustom.account" placeholder="请输入账号"></Input>
                  </FormItem>
               </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
               <FormItem label="手机号">
                 <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
               </FormItem>
             </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="反馈日期">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
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
    </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
  },
  data () {
    return {
      loading:false,
      flag:false,
      addroleshow:false,
      timearr:[],
      formCustom:{
          bikeNo:"",
          mobileNo:"",
          solveFlag:"",
          startTime:"",
          endTime:"",
          fault_type:"",
          type:"2",
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
            title: '举报时间',
              key: 'bikeNo',
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆二维码',
              key: "bikeNo",
              minWidth:90,
          },
          {
            title: '账号',
              key: "account",
              minWidth:90,
          },
        {
          title: '姓名',
          key: "riderName",
          minWidth: 90,
        },
        {
          title: '手机号',
          key: "mobileNo",
          minWidth: 90,
        },
          {
              title: '反馈内容',
              key: "feedbackContent",
              minWidth:90,
          },
          {
              title: '图片',
              key: "image",
              minWidth:150,
              render: (h, params) => {
                let _this = this;
               if(params.row.image){
                 return h('img',{
                   attrs:{
                     src:params.row.image
                   },
                   style:{
                     width:'50px',
                     height:'50px',
                     display:params.row.image?"":"none"
                   },
                   on:{
                     'click' () {
                        _this.$webapi.getimg(params.row.image)
                     }
                   }
                 })
               }
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
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/informBycle/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
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
            mobileNo: this.formCustom.mobileNo,
            // fault_type:this.formCustom.fault_type,
            // bikeType:'1',
            bikeNo:this.formCustom.bikeNo,
            // solveFlag:this.formCustom.solveFlag,
            type:this.formCustom.type,
            account:this.formCustom.account,
            startTime:this.formCustom.startTime,
            endTime:this.formCustom.endTime
          })
      }
      let _this =  this
      this.$api.get('/customerBicycle/reportingViolationsList',listdata,reset => {
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
