<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bike_no" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆带回时间">
                           <DatePicker type="daterange" @on-change="oktime" :value="timearr" placeholder="车辆带回时间" style="width: 100%"></DatePicker>
                       </FormItem>
                   </Col>
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="状态" >
                         <Select v-model="formCustom.fault_type">
                             <Option value="">全部</Option>
                             <Option value="1">结构故障</Option>
                             <Option value="2">电器故障</Option>
                             <Option value="3">其他</Option>
                         </Select>
                       </FormItem>
                   </Col> -->
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="故障类型" >
                        <faultType-component @emitfault="emitfault" :faulttype="formCustom.faulttype"></faultType-component>
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
              <div class="mianbox">
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
import faultTypeComponent from '../../pub/faultTypecomponent.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    faultTypeComponent
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
      timearr:[],
      formCustom:{
        bike_no:"",
        fault_type:"",
        startTime:"",
        endTime:"",
        maintain_name:"",
        dockSiteName:"",
        status:"1",
        faulttype:"",
        pageCurrent:1,
        pagesize:10,
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      maintaindata:[],
      data:[],
      columns: [
          {
              title: '车辆二维码',
              minWidth:100,
              key: 'bikeNo',
          },
          {
              title: '车辆报障时间',
              minWidth:100,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '车辆带回时间',
              minWidth:100,
              key: 'backTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.backTime)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '维修完成时间',
          //     key: 'overTime',
          //     minWidth:100,
          //     render: (h, params) => {
          //       let str = this.$webapi.gettime('time',(params.row.overTime)/1000)
          //       return h('div', [
          //           h('span', str)
          //     ])
          //  }
          // },
          {
              title: '车辆故障类型',
              minWidth:100,
              key: 'bikeStatus',
              render: (h, params) => {
                let str = params.row.addedFault
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '其他问题描述',
          //     minWidth:100,
          //     key: 'addedFault',
          // },
          {
              title: '其他',
              minWidth:80,
              key: 'other',
          },
          {
              title: '实际维修项目',
              minWidth:100,
              key: 'real_maintain',
             render: (h, params) => {
               let _this = this;
              return h('div', [
                 h('Input', {
                    props: {
                        value:params.row.real_maintain?params.row.real_maintain:""
                    },
                    on: {
                        'on-blur': (e) => {
                          params.row.real_maintain = event.target.value
                          _this.data[params.index].real_maintain = event.target.value
                        }
                    }
                  }),
                ])
              }
          },
          {
              title: '更换配件',
              minWidth:100,
              key: 'replace_part',
              render: (h, params) => {
                let _this = this;
               return h('div', [
                  h('Input', {
                     props: {
                         value:params.row.replace_part?params.row.replace_part:""
                     },
                     on: {
                         'on-blur': (e) => {
                           params.row.replace_part = event.target.value
                           _this.data[params.index].replace_part = event.target.value
                         }
                     }
                   }),
                 ])
               }
          },
          {
              title: '补充描述',
              minWidth:100,
              key: 'describe',
              render: (h, params) => {
                let _this = this;
               return h('div', [
                  h('Input', {
                     props: {
                         value:params.row.describe?params.row.describe:""
                     },
                     on: {
                         'on-blur': (e) => {
                           params.row.describe = event.target.value
                           _this.data[params.index].describe = event.target.value
                         }
                     }
                   }),
                 ])
               }
          },
          {
              title: '维修人',
              minWidth:100,
              key: 'selectdata',
              render: (h, params) => {
                let _this = this;
                 return h('Select',{
                     props:{
                       value:params.row.maintain?params.row.maintain:""
                   },
                   on: {
                       'on-change':(event) => {
                          params.row.maintain = event
                          _this.data[params.index].maintain = event                                                    
                      }
                    },
                  },
                 this.maintaindata.map((item) =>{
                   return h('Option', {
                       props: {
                           value: item.id                           
                       }
                   },item.name)
                  })
                 )
              }
          },
          {
              title: '备注',
              minWidth:80,
              key: 'remark',
              render: (h, params) => {
              let _this =  this;
               return h('div', [
                  h('Input', {
                     props: {
                         value:params.row.remark?params.row.remark:""
                     },
                     on: {
                         'on-blur': (event) => {
                            params.row.remark = event.target.value
                            _this.data[params.index].remark = event.target.value
                         }
                     }
                   }),
                 ])
               }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:100,
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
    //do something after mounting vue instance
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.getmaintainlist()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/repair/moped"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    register (e) {
      let _this = this;
      if(e.maintain==null){
        this.$Message.info("维护人员没有选择")
        return
      }
      if(e.real_maintain==null){
        this.$Message.info("实际维修项目没有填写")
        return
      }
      if(e.replace_part==null){
        this.$Message.info("更换配件没有填写")
        return
      }
      if(e.describe==null){
        this.$Message.info("补充描述没有填写")
        return
      }
      // if(e.remark==null){
      //   this.$Message.info("备注没有填写")
      //   return
      // }
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get("token"),
            id:""+e.id,
            bike_model:e.bikeModel,
            other:e.other,
            describe:e.describe,
            real_maintain:e.real_maintain,
            replace_part:e.replace_part,
            maintainId:e.maintain,
            remark:e.remark,
            fault_type:this.formCustom.fault_type,
            status:this.formCustom.status
         })
      }
      this.$api.post('/repairingBicycle/register',listdata,reset => {
        if (reset.codeId == 1) {
        _this.$Message.info("登记成功")
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    getmaintainlist () {
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get("token"),
         })
      }
      let _this = this;
      this.$api.get('/maintain/maintainerlist_noPage',listdata,reset => {
        if (reset.codeId == 1) {
          let data  = reset.resData
              // data.unshift({
              //   id:"",
              //   name:"未选择"
              // })
          _this.maintaindata = data
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
    emitfault (e) {
      this.formCustom.fault_type = e.name
      this.formCustom.faulttype=e.id
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        data:{
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          bike_no:this.formCustom.bike_no,
          fault_type:this.formCustom.fault_type,
          startTime:this.formCustom.startTime!=""?this.formCustom.startTime+" 00:00:00":"",
          endTime:this.formCustom.endTime!=""?this.formCustom.endTime+" 23:59:59":"",
          // maintain_name:this.formCustom.maintain_name,
          // bike_type:this.formCustom.bike_type,
          // dockSiteName:this.formCustom.dockSiteName,
          status:this.formCustom.status
        }
      }
      let _this =  this
      this.$api.get('/repairingBicycle/list',listdata,reset => {
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
<style lang="less">
.mianbox .ivu-table-wrapper{
  overflow: inherit!important
}
</style>
