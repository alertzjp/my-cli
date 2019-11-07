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
                   <FormItem label="站点编号">
                     <Input type="text" v-model="formCustom.siteNo" placeholder="请输入站点编号"></Input>
                   </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点名称">
                    <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteNo" placeholder="请选择站点名称"></docksite-component>
                  </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="共享单车公司">
                    <entering-component @EmitcompanyComponent="EmitcompanyComponent" :companyid="formCustom.enteringCompanyId"></entering-component>
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
     <!--操作按钮-->
    <div class="tableListOperator">
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
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
import docksiteComponent from '../../pub/bicycledocksite.vue'
import enteringComponent from '../../pub/enteringCompany.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    docksiteComponent,
    enteringComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      formCustom:{
         bikeNo:"",
         enquiriesNo:"",
         siteNo:"",
         siteName:"",
         docksiteNo:"",
         enteringCompanyId:"",
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
              title: '车辆二维码',
              key: 'bikeNo',
              minWidth:100,
          },
          {
              title: '共享单车公司',
              key: 'enteringCompanyName',
              minWidth:150,
          },
          {
              title: '站点名称',
              key: 'bicycleNo',
              minWidth:120,
              render: (h, params) => {
                let  str = params.row.siteName+ "("+params.row.siteNo+")"
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '站点设备号',
              key: 'equipmentNo',
              minWidth:100,
          },
          {
              title: '电子标签',
              key: 'rfidTagNumber',
              minWidth:100,
          },
          {
              title: '进出场状态',
              key: 'fenceName',
              minWidth:90,
              render: (h, params) => {
                let  str = params.row.type==1?"进场":"出场"
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '创建时间',sortable: true,
              key: 'createdAt',
              minWidth:90,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
      ]
    }
  },
  watch:{
    formCustom:{
      handler (val,oldval) {
        if(val){
          let obj={
               path:this.$route.path,
               searchobj:this.formCustom
          }
          this.$store.dispatch('savesearchvla',obj)
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
      if(_this.$route.path == "/admin/carManage/bicyclerfid"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    EmitDocksiteComponent (e) {
      this.formCustom.siteName = e.docksiteName
      this.formCustom.docksiteNo = e.docksiteNo
    },
    EmitcompanyComponent (e) {
      this.formCustom.enteringCompanyId = e.id
    },
    add () {
      this.$router.push({
        path:"/admin/device/areaManager/add"
      })
    },
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    delpost(e){
      let  _this=this;
      let  listdata={
         data:JSON.stringify({
             id:""+e.id,
             token:this.$webapi.get('token'),
           })
      }
      this.$api.post('/district/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let  listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        bikeNo:this.formCustom.bikeNo,
        // enquiriesNo:this.formCustom.enquiriesNo,
        enteringCompanyId:this.formCustom.enteringCompanyId,
        siteNo:this.formCustom.siteNo,
        siteName:this.formCustom.siteName
     }
      let  _this =  this
      this.$api.get('/rfidIO/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount=reset.resData.totalCount;
           _this.loading = false
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
