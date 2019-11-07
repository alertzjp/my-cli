<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="维修站点名称">
                           <Input type="text" v-model="formCustom.maintainSiteName"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="维修站点编号">
                           <Input type="text" v-model="formCustom.maintainSiteNo"></Input>
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
          <Button type="primary" icon="md-add" size="large"  @click="add">新增</Button>
        </div>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     <district-component v-if="datalistshow" :setectitem="setectitem" @bikeDockSitecomponent="bikeDockSitecomponent"></district-component>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import districtComponent from '../../pub/bikedocksitecomponent.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    districtComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      setectitem:{},
      addshow:false,
      editshow:false,
      datalistshow:false,
      maintaindata:[],
      formCustom:{
        maintainSiteName:"",
        maintainSiteNo:"",
        status:"1"
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '维修站点编号',
              key: 'maintainSiteNo',
              minWidth:200,
          },
          {
              title: '维修站点名称',
              minWidth:150,
              key: 'maintainSiteName',
          },
          {
              title: '维修站点地区',
              minWidth:200,
              render: (h, params) => {
                let str = "" + params.row.provinceName + "" + params.row.cityName + "" + params.row.countyName
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '具体地址',
              minWidth:200,
              key: 'address',
          },
          {
              title: '维修站点负责人',
              minWidth:150,
              key: 'principalsName',
          },
          {
              title: '联系方式',
              minWidth:150,
              key: 'principalsMobile',
          },
          {
              title: '创建时间',sortable: true,
              minWidth:150,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:280,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
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
                                 _this.$router.push({
                                   path:"/admin/repair/maintainStation/edit",
                                   query:{
                                     id:params.row.id
                                   }
                                 })
                              }
                          }
                      }, '编辑'),
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
                                _this.setectitem = params.row
                                _this.datalistshow = true
                              }
                          }
                      }, '关联片区'),
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
                                   title:"确定要删除"+params.row.maintainSiteNo+ "?",
                                   yes() {
                                     _this.delpost(params.row)
                                   }
                                 })
                              }
                          }
                      }, '删除')
                  ]);
              }
          }
      ],
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.getmaintainlist()
  },
  methods: {
    add (){
      this.$router.push({
        path:"/admin/repair/maintainStation/add"
      })
    },
    getmaintainlist () {
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get("token"),
           pageNo:"1",
           pageSize:"10000"
         })
      }
      let _this = this;
      this.$api.get('/maintain/maintainerlist',listdata,reset => {
        if (reset.codeId == 1) {
          _this.maintaindata = reset.resData.list
          _this.list()
        }
      })
    },
    oktime (e) {
      let [x,y] = e
        this.formCustom.startTime = x
        this.formCustom.endTime = y
    },
    pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pagesize = e.pagesize
        this.list()
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    bikeDockSitecomponent () {
        this.datalistshow = false
    },
    delpost (e) {
      let _this = this;
      let listdata = {
        data:JSON.stringify({
          id:""+e.id,
          token:this.$webapi.get("token")
        })
      }
      this.$api.post('/maintainsite/delete',listdata,reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        data:{
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          maintainSiteNo:this.formCustom.maintainSiteNo,
          maintainSiteName:this.formCustom.maintainSiteName,
          status:this.formCustom.status
        }
      }
      let _this =  this
      this.$api.get('/maintainsite/list',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = []
          _this.pageData.totalCount = 0
          _this.pageshow = true
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
