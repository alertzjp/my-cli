<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="充电桩编号">
                     <Input type="text" v-model="formCustom.chargePileNo"></Input>
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
      putinshow:false,
      formCustom:{
          chargePileNo:"",
      },
      dockSiteNo:"",
      dockSiteName:"",
      chargePileList:[],
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '型号',
              key: 'model',
              minWidth:150,
              fixed:"left"
          },
          {
              title: '站点名称',
              key: 'chargePileNo',
              minWidth:150,
          },
          {
              title: '站点编号',
              key: "chargePileNo",
              minWidth:150,
          },
          {
              title: '充电桩编号',
              key: "chargePileNo",
              minWidth:150,
          },
          {
              title: '充电桩状态',
              key: "chargePileStatus",
              minWidth:150,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:150,
              fixed:"right",
              render: (h, params) => {
                  let _this = this;
                  return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'default'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                  _this.$webapi.getMessinfo({
                                    title:"确定要删除充电桩编号【"+params.row.chargePileNo+"】?",
                                    yes () {
                                      _this.delitem(params.row)
                                    }
                                  })
                                }
                            }
                        }, '删除'),
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'default'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                   _this.$webapi.getMessinfo({
                                      title: '确定要投放到编号:' + this.$route.query.dockSiteNN + ",名称:" + this.$route.query.dockSiteName + '的停靠点吗？',
                                     yes () {
                                       _this.putin(params.row)
                                     }
                                   })
                                }
                            }
                        }, '投放'),
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
        }else{
          this.flag=false
        }
      },
      deep:true
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    goback(){
      this.$router.go(-1)
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    putin(e){
       this.chargePileList=[];
       let data = {
           id: '' + e.id,
           dockSiteId: '' +this.$route.query.dockSiteNo,
           chargePileStatus: '' +3
      }
      this.chargePileList.push(data)
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           chargePileList:this.chargePileList
         })
      }
      let _this =  this
      this.$api.post('/chargepile/launch',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    delitem(e){
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           id:""+e.id,
         })
      }
      let _this =  this
      this.$api.post('/chargepile/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize,
           dockSiteNo:"",
           chargePileNo:this.formCustom.chargePileNo,
           chargePileStatus:""+3,
         })
      }
      let _this =  this
      this.$api.get('/chargepile/list',listdata,reset => {
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
