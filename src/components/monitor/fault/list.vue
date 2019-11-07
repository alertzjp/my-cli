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
                      <Input type="text" v-model="formCustom.docksiteNo" placeholder="请输入站点编号"></Input>
                   </FormItem>
                </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="还车站点">
                   <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteNo01" placeholder="请输入还车站点"></docksite-component>
                 </FormItem>
               </Col>
              <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="报障时间">
                      <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
              </Col> -->
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3" >
                   <FormItem label="操作类型" >
                     <Select v-model="formCustom.operateType">
                         <Option value="">全部</Option>
                         <Option value="1">手工还车</Option>
                         <Option value="2">结束计费</Option>
                     </Select>
                   </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3" >
                  <FormItem label="锁状态" >
                    <Select v-model="formCustom.lockStatus">
                        <Option value="">全部</Option>
                        <Option value="0">锁车</Option>
                        <Option value="1">开锁</Option>
                        <Option value="2">离线</Option>
                    </Select>
                  </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                <FormItem label="操作时间">
                    <time-component @timeEmit="timeEmit01" :timearr="timearr01"></time-component>
                </FormItem>
            </Col>
              <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="账号">
                    <Input type="text" v-model="formCustom.account" placeholder="请输入账号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="姓名">
                       <Input type="text" v-model="formCustom.accountName" placeholder="请输入姓名"></Input>
                   </FormItem>
                </Col> -->

              <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="操作者">
                     <Input type="text" v-model="formCustom.updatorName" placeholder="请输入操作者"></Input>
                </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3" >
                   <FormItem label="解决状态" >
                     <Select v-model="formCustom.status">
                         <Option value="">全部</Option>
                          <Option value="0">未解决</Option>
                         <Option value="1">已解决</Option>
                         <Option value="2">未分配</Option>
                         <Option value="3">已分配</Option>
                     </Select>
                   </FormItem>
             </Col> -->
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
   <distmain-component v-if="distmainshow" :selectitem="selectitem" @emitcomponent="emitcomponent"></distmain-component>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import docksiteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
import distmainComponent from './distMaintainer.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    docksiteComponent,
    timeComponent,
    distmainComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      distmainshow:false,
      timearr:[],
      timearr01:[],
      formCustom:{
         bikeNo:"",
         lockStatus:"",
         b30StartTime:"",
         b30EndTime:"",
         startTime:"",
         endTime:"",
         operateType:"",
         status:"",
         accountName:"",
         docksiteName:"",
         docksiteNo:"",
         docksiteNo01:"",
         updatorName:"",
         sort:"",
         account:"",
         pageCurrent:1,
         pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      selectitem:{},
      columns:[
          {
              title: '车辆二维码',
              key: 'bikeNo',
              minWidth:100,
          },
          {
              title: '锁状态',
              key: 'enquiriesNo',
              minWidth:80,
              render: (h, params) => {
                let  str = params.row.lockStatus==0?"锁车":params.row.lockStatus==1?"开锁":params.row.lockStatus==2?"离线":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '报障时间',
              key: 'sensorsNo',
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.b30Time)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作时间',
              key: 'lockNo',
              sortable: true,
              minWidth:100,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作类型',
              key: 'operateType',
              minWidth:100,
              render: (h, params) => {
                let  str = params.row.operateType==1?"手工还车":params.row.operateType==2?"结束计费":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '账号',
              key: 'riderAccount',
              minWidth:90,
          },
          {
              title: '姓名',
              key: 'riderName',
              minWidth:90,
          },
          {
              title: '还车站点编号',
              key: 'docksiteNo',
              minWidth:100,
          },
          {
              title: '还车站点',
              key: 'docksiteName',
              minWidth:90,
          },
          {
              title: '误差值(m)',
              key: 'distance',
              sortable: true,
              minWidth:100,
              render: (h, params) => {
                let  str = params.row.distance==null?"没有定位":params.row.distance
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作者',
              key: 'updatorName',
              minWidth:100,
          },
          {
              title: '操作次数',
              key: 'operateNum',
              minWidth:80,
          },
          {
              title: '解决状态',
              key: 'bikeNo',
              minWidth:100,
              render: (h, params) => {
                let str = ""
                if(params.row.status==0){
                  str = "未解决"
                }
                if(params.row.status==1){
                  str = "已解决"
                }
                if(params.row.status==2){
                  str = "未分配"
                }
                if(params.row.status==3){
                  str = "已分配"
                }
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:230,
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
                          },
                          on: {
                              click: () => {
                                if(params.row.distance==null){
                                  _this.$Message.info("当前坐标没有")
                                }else{
                                  _this.$router.push({
                                    path:"/admin/monitor/faultmonitor/map",
                                    query:{
                                      Latitude:params.row.gpsLatitude,
                                      Longitude:params.row.gpsLongitude,
                                      docksiteLongitude:params.row.docksiteLongitude,
                                      docksiteLatitude:params.row.docksiteLatitude,
                                      docksiteName:params.row.docksiteName,
                                      docksiteNo:params.row.docksiteNo,
                                      distance:params.row.distance,
                                      bikeNo:params.row.bikeNo
                                    }
                                  })
                                }
                              }
                          }
                      }, '地图'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/fault_monitor/getOne')?(params.row.operateType==2&&params.row.status==3)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                _this.$router.push({
                                  path:"/admin/monitor/faultmonitor/view",
                                  query:{
                                    id:params.row.id
                                  }
                                })
                              }
                          }
                      }, '查看详情'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/fault_monitor/distMaintainer')?(params.row.status==2&&params.row.lockStatus==1)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                 _this.selectitem = params.row
                                 _this.distmainshow = true
                              }
                          }
                      }, '分配维护人员')
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
          this.formCustom=vla.searchobj;
          if(vla.searchobj.pageCurrent){
               this.pageData.pageCurrent = vla.searchobj.pageCurrent
            }
            if(vla.searchobj.pagesize){
              this.pageData.pagesize = vla.searchobj.pagesize
            }
          this.timearr=[this.formCustom.b30StartTime,this.formCustom.b30EndTime]
          this.timearr01=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.list();
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/faultmonitor/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    emitcomponent (e) {
        this.distmainshow = false
        if(e){
          this.list()
        }
    },
    timeEmit(e) {
      this.formCustom.b30StartTime = e[0]
      this.formCustom.b30EndTime = e[1]
    },
    timeEmit01(e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteName = e.docksiteName
      this.formCustom.docksiteNo01 = e.docksiteNo
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
        lockStatus:this.formCustom.lockStatus,
        b30StartTime:this.formCustom.b30StartTime==""?"":this.formCustom.b30StartTime+" 00:00:00",
        b30EndTime:this.formCustom.b30EndTime==""?"":this.formCustom.b30EndTime+" 23:59:59",
        startTime:this.formCustom.startTime==""?"":this.formCustom.startTime+" 00:00:00",
        endTime:this.formCustom.endTime==""?"":this.formCustom.endTime+" 23:59:59",
        operateType:this.formCustom.operateType,
        status:this.formCustom.status,
        accountName:this.formCustom.accountName,
        docksiteNo:this.formCustom.docksiteNo,
        updatorName:this.formCustom.updatorName,
        account:this.formCustom.account,
        docksiteName:this.formCustom.docksiteName
     }
      let  _this =  this
      this.$api.get('/fault_monitor/list',listdata,reset => {
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
