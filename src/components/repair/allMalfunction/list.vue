<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="二维码编号">
                           <Input type="text" v-model="formCustom.bike_no"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车载终端编号">
                           <Input type="text" v-model="formCustom.terminal_no"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="状态" >
                         <Select v-model="formCustom.status">
                             <Option value="30">故障</Option>
                             <Option value="42">修好</Option>
                         </Select>
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
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      maintaindata:[],
      formCustom:{
        bike_no:"",
        fault_type:"",
        startTime:"",
        endTime:"",
        maintain_name:"",
        bike_type:'1',
        dockSiteName:"",
        status:"30"
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '车载终端编号',
              key: 'terminalNo',
              minWidth:150,
          },
          {
              title: '二维码编号',
              minWidth:150,
              key: 'bikeNo',
          },
          {
              title: '车辆型号',
              minWidth:200,
              key: 'bikeModel',
          },
          {
              title: '车辆报障时间',
              minWidth:150,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆故障类型',
              minWidth:150,
              key: 'bikeStatus',
              render: (h, params) => {
                let str = params.row.faultType==30?"故障":params.row.faultType==42?"修改":""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '其他问题描述',
              minWidth:150,
              key: 'addedFault',
          },
          {
              title: '其他',
              minWidth:150,
              key: 'other',
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
                                  _this.register(params.row)
                              }
                          }
                      }, '登记')
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
    list () {
      this.loading = true
      let listdata = {
        data:{
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          bike_no:this.formCustom.bike_no,
          bike_type:this.formCustom.bike_type,
          terminal_no:this.formCustom.terminal_no,
          status:this.formCustom.status
        }
      }
      let _this =  this
      this.$api.get('/repairing/allMalfunction',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData.list || []
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
