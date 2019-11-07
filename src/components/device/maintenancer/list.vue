<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点编号">
                     <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入站点编号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点名称">
                     <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteno"></docksite-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="片区名称">
                     <Input type="text" v-model="formCustom.districtName" placeholder="请输入片区名称"></Input>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="维护人员">
                     <Input type="text" v-model="formCustom.name"  placeholder="请输入维护人员"></Input>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="维护卡号">
                     <Input type="text" v-model="formCustom.icCardNo" placeholder="请输入维护卡号"></Input>
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
import docksiteComponent from '../../pub/bicycledocksite.vue'
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    docksiteComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      formCustom:{
          name:"",
          loginAccount:"",
          icCardNo:"",
          mobileNo:"",
          districtName:"",
          dockSiteName:"",
          dockSiteNo:"",
          docksiteno:"",
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
              title: '站点名称',
              key: 'dockSiteName',
              minWidth:100,
              fixed:"left"
          },
          {
              title: '站点编号',
              key: 'dockSiteNo',
              minWidth:100,
          },
          {
              title: '片区名称',
              key: "",
              minWidth:220,
              render: (h, params) => {
                let str = params.row.districtName + "(" +params.row.districtNo+")";
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '维护人员',
              key: "name",
              minWidth:80,
          },
          {
              title: '维护卡',
              key: "icCardNo",
              minWidth:100,
          },
          {
              title: '手机号码',
              key: "loginAccount",
              minWidth:120,
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
  },
  methods: {
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    EmitDocksiteComponent (e) {
      this.formCustom.dockSiteName = e.docksiteName
      this.formCustom.docksiteno = e.docksiteNo
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
           name: this.formCustom.name,
           loginAccount: this.formCustom.loginAccount,
           icCardNo: this.formCustom.icCardNo,
           mobileNo:this.formCustom.mobileNo,
           districtName:this.formCustom.districtName,
           dockSiteName:this.formCustom.dockSiteName,
           dockSiteNo:this.formCustom.dockSiteNo
         })
      }
      let _this =  this
      this.$api.get('/maintain/maintain_bicycledocksitelist',listdata,reset => {
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
