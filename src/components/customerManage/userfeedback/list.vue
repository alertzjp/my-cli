<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
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
   <reply-component v-if="show" :selectItem="selectItem" @emitreplycomponent="emitreplycomponent"></reply-component>
   <delectreply-component v-if="deleteshow" :selectItem="selectItem" @emitreplycomponent="emitreplycomponent"></delectreply-component>
   </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import timeComponent from '../../pub/timecomponent.vue'
  import replyComponent from "./reply.vue"
  import delectreplyComponent from "./delectreply.vue"

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    replyComponent,
    delectreplyComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      show:false,
      deleteshow:false,
      selectItem:{},
      timearr:[],
      formCustom:{
          account:"",
          startTime:"",
          endTime:"",
          mobileNo: "",
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
              title: '反馈日期',
              key: 'createdTime',
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
            title: '账号',
              key: 'account',
              minWidth:100,
          },
        {
          title: '姓名',
          key: 'riderName',
          minWidth: 100,
        },
        {
          title: '手机号',
          key: 'mobileNo',
          minWidth: 100,
        },
          {
              title: '反馈内容',
              key: "feedbackContent",
              minWidth:100,
          },
          {
              title: '状态',
              key: "feedbackContent",
              minWidth:80,
              render: (h, params) => {
                let str = params.row.status==1?"反馈中":"已回复"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:250,
              render: (h, params) => {
                let _this = this;
                console.log(_this.$hasPerm('/advice_reply/delete,/advice_reply/update'))
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              // display:_this.$hasPerm('/advice_reply/add')?(params.row.status==1)?"":"none":"none"
                              display:_this.$hasPerm('/advice_reply/add')?"":"none"

                          },
                          on: {
                              click: () => {
                                _this.selectItem = params.row
                                _this.show = true
                              }
                          }
                      }, '新增回复'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/advice_reply/delete,/advice_reply/update')?(params.row.status!==1)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectItem = params.row
                                _this.deleteshow = true
                              }
                          }
                      }, '编辑/删除回复'),
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
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/userfeedback/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    emitreplycomponent (e) {
      this.show = false
      this.deleteshow = false
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
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
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
          type:"1",
          // bikeType:''+1,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          account: this.formCustom.account,
          mobileNo: this.formCustom.mobileNo
        })
      }
      let _this =  this
      this.$api.get('/customerBicycle/adviceFeedbackListBicycle',listdata,reset => {
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
