<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="操作名">
                     <Input type="text" v-model="formCustom.methodName" ></Input>
                  </FormItem>
               </Col> -->
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="操作人员">
                      <Input type="text" v-model="formCustom.userName" placeholder="请输入操作人员"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="帐户名">
                      <Input type="text" v-model="formCustom.accountName" placeholder="请输入帐户名"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
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
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
  },
  data () {
    return {
      loading:false,
      flag:false,
      formCustom:{
          accountName:"",
          methodName:"",
          userName:"",
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
              title: '操作人员',
              key: "userName",
              minWidth:90,
          },
          {
              title: '帐户名',
              key: "accountName",
              minWidth:90,
          },
          {
              title: '操作内容',
              key: 'methodName',
              minWidth:90,
          },
          {
              title: '操作时间',
              key: "accountName",
              minWidth:90,
              render: (h, params) => {
                let _this = this;
                let str = _this.$webapi.gettime("time",params.row.createdAt/1000)
                  return h('div',str )
                }
          },
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
        }
      })
    }
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/userManage/log"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    view(e){
      this.$router.push({ path: '/admin/userManage/recharge/view',query: {id:e.riderId}})
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata= {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        accountName:""+this.formCustom.accountName,
        // methodName:""+this.formCustom.methodName,
        userName:""+this.formCustom.userName
      }
      let _this =  this
      this.$api.get('/operation_log/list',listdata,reset => {
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
