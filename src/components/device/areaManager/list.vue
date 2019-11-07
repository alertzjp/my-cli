<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="片区编号">
                    <Input type="text" v-model="formCustom.districtNo" placeholder="请输入片区编号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="片区名称">
                     <Input type="text" v-model="formCustom.name" placeholder="请输入片区名称"></Input>
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
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="add" v-if="$hasPerm('/district/batch_add')"></Buttoncomponent>
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
   <add-component v-if="addshow" :type="type" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></add-component>
   <relevanc-component v-if="relevancshow" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></relevanc-component>
   <maintain-component v-if="maintainshow" :setlectitem="setlectitem" @emitcomponent="emitcomponent"></maintain-component>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import addComponent from './add.vue'
import relevancComponent from './relevancesite.vue'
import maintainComponent from './maintain.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    addComponent,
    relevancComponent,
    maintainComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addshow:false,
      relevancshow:false,
      maintainshow:false,
      type:1,
      setlectitem:{},
      formCustom:{
           districtNo:"",
           name:"",
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
              title: '片区编号',
              key: 'districtNo',
              minWidth:100,
          },
          {
              title: '片区名称',
              key: 'name',
              minWidth:100,
          },
          {
              title: '片区负责人',
              key: 'principalsName',
              minWidth:100,
          },
          {
              title: '联系方式',
              key: 'mobileNo',
              minWidth:100,
          },
          {
              title: '状态',
              key: 'mobileNo',
              minWidth:60,
              render: (h, params) => {
                let str = params.row.status==1?"正常":params.row.status==-1?"不正常":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '创建人',
              key: 'createName',
              minWidth:100,
          },
          {
              title: '创建时间',sortable: true,
              key: 'createdAt',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '更新时间',
              key: 'createdAt',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:330,
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
                              marginTop: '5px',
                              display:_this.$hasPerm('/bicycledocksite/list')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.setlectitem = params.row
                                 _this.relevancshow = true
                              }
                          }
                      }, '关联站点'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/maintain/maintainerUpdate')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.setlectitem = params.row
                                 _this.maintainshow = true
                              }
                          }
                      }, '关联维护人员'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/district/batch_update')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.$webapi.removeItem("emitData")
                                 _this.$webapi.removeItem("areaType")   
                                 _this.$webapi.removeItem("addItem")   
                                 _this.$router.push({
                                    path:"/admin/device/areaManagermap/list",
                                    query:{
                                      type:2,
                                      districtId:params.row.id 
                                    }
                                  })
                                //  _this.setlectitem = params.row
                                //  _this.type = 2
                                //  _this.addshow = true
                              }
                          }
                      }, '编辑'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/district/delete')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:"确定要删除片区【"+params.row.name+"】吗？",
                                  yes () {
                                    _this.delpost(params.row)
                                  }
                                })
                              }
                          }
                      }, '删除'),
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
          this.formCustom = vla.searchobj
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
      if(_this.$route.path == "/admin/device/areaManager/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    add () {      
        this.$webapi.removeItem("emitData")
        this.$webapi.removeItem("areaType")            
        this.$router.push({
          path:"/admin/device/areaManagermap/list",
          query:{
            type:1
          }
        })
    },
    emitcomponent (e) {
      this.addshow = false
      this.editshow = false
      this.relevancshow = false
      this.maintainshow = false
      if(e){
        this.list()
      }
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
      let _this=this;
      let listdata={
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
      let listdata = {
             data: JSON.stringify({
               token:this.$webapi.get('token'),
               pageNo:""+this.pageData.pageCurrent,
               pageSize:""+this.pageData.pagesize,
               districtNo:this.formCustom.districtNo,
               name:this.formCustom.name,
               // fenceId:'',
         })
     }
      let _this =  this
      this.$api.get('/district/list',listdata,reset => {
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
