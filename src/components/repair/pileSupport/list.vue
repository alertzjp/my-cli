<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="充电桩编号">
                           <Input type="text" v-model="formCustom.bike_no"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="维修人员">
                           <Input type="text" v-model="formCustom.maintain_name"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="维修完成时间">
                           <DatePicker type="daterange" @on-change="oktime" placeholder="维修完成时间" style="width: 100%"></DatePicker>
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
      formCustom:{
        bike_no:"",
        fault_type:"",
        startTime:"",
        endTime:"",
        maintain_name:"",
        bike_type:'3',
        dockSiteName:"",
        status:"2"
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
              key: 'frameNo',
          },
          {
              title: '车辆型号',
              minWidth:200,
              key: 'bikeModel',
          },
          {
              title: '车辆报障时间',
              minWidth:150,
              key: 'terminalNo',
          },
          {
              title: '车辆带回时间',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '维修完成时间',
              key: 'updatedAt',
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.firstUseTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆故障类型',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '其他问题描述',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '其他',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '实际维修项目',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '更换配件',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '补充描述',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '维修人',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '备注',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:280,
              render: (h, params) => {
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
                                  if(params.row.userType==1){
                                      this.$router.push({path:"/member/detail/"+params.row.id})
                                  }else{
                                    this.$router.push({path:"/member/companydetail/"+params.row.id})
                                  }
                              }
                          }
                      }, '维修记录详情'),
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
                                  this.editshow=true;
                                  this.editdata=params.row;
                              }
                          }
                      }, '位置'),
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
                                this.setectitem = this.data[params.index]
                                this.scrapshow = true
                              }
                          }
                      }, '报废')
                  ]);
              }
          }
      ],
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
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
          fault_type:this.formCustom.fault_type,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          maintain_name:this.formCustom.maintain_name,
          bike_type:this.formCustom.bike_type,
          dockSiteName:this.formCustom.dockSiteName
        }
      }
      let _this =  this
      this.$api.get('/repairing/list',listdata,reset => {
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
