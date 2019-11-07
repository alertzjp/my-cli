<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="停靠点名称">
                     <Input type="text" v-model="formCustom.dockSiteName"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="停靠点编号">
                     <Input type="text" v-model="formCustom.dockSiteNo"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="充电桩编号">
                     <Input type="text" v-model="formCustom.chargePileNo"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="充电桩状态">
                    <Select v-model="formCustom.chargePileStatus">
                         <Option value="">全部</Option>
                         <Option value="1">空闲</Option>
                         <Option value="2">占用</Option>
                         <Option value="3">未投放</Option>
                         <Option value="10">故障中</Option>
                         <Option value="11">维修中</Option>
                         <Option value="12">已报废</Option>
                    </Select>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                       <Button type="warning" @click="noputit">投放充电桩</Button>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <!--操作按钮-->
    <!-- <div class="tableListOperator">
      <Button type="warning"  size="large"  @click="noputit">投放充电桩</Button>
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
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
  },
  data () {
    return {
      loading:false,
      addroleshow:false,
      revisionshow:false,
      formCustom:{
          dockSiteName:"",
          dockSiteNo:"",
          chargePileNo:"",
          chargePileStatus:""
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '停靠点名称',
              key: 'dockSiteName',
              minWidth:150,
              fixed:"left"
          },
          {
              title: '停靠点编号',
              key: 'dockSiteNo',
              minWidth:150,
          },
          {
              title: '充电桩型号',
              key: 'model',
              minWidth:100,
          },
          {
              title: '充电桩编号',
              key: 'chargePileNo',
              minWidth:100,
          },
          {
              title: '详细地址',
              key: 'address',
              minWidth:300,
          },
          {
              title: '充电桩状态',
              minWidth:100,
              key: 'chargePileStatus',
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
                                    title:"确定要删除【"+params.row.chargePileNo+"】?",
                                    yes () {
                                      _this.delitem(params.row)
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
  mounted() {
    this.list();
  },
  methods: {
    handleSubmit() {
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    noputit(){
      this.$router.push({
        path:"/admin/device/chargingpile/noputit"
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
           dockSiteNo:this.formCustom.dockSiteNo,
           dockSiteName:this.formCustom.dockSiteName,
           chargePileNo:this.formCustom.chargePileNo,
           chargePileStatus:this.formCustom.chargePileStatus,
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
