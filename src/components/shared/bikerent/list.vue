<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车辆编号">
                     <Input type="text" v-model="formCustom.bikeNo" placeholder="车辆编号"></Input>
                  </FormItem>
               </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="共享公司">
                    <sharecompany-component @EmitComponent="EmitComponent"></sharecompany-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="租用类型">
                   <Select v-model="formCustom.rentType" placeholder="租用类型">
                      <Option value="">全部</Option>
                      <Option value="1">站点内租车</Option>
                      <Option value="2">站点外租车</Option>
                      <Option value="3">站内租车站内还车正常结束</Option>
                      <Option value="4">站内租车站外还车</Option>
                      <Option value="5">站外租车站内还车</Option>
                      <Option value="6">站外租车站外还车</Option>
                      <Option value="7">未租车站内还车</Option>
                      <Option value="8">未租车站外还车</Option>
                  </Select>
                 </FormItem>
              </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="租车状态">
                    <Select v-model="formCustom.status" placeholder="请选择租车状态">
                       <Option value="">全部</Option>
                       <Option value="1">租车中</Option>
                       <Option value="2">租车结束</Option>
                   </Select>
                  </FormItem>
               </Col>            
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="租车时间">
                      <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
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
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import sharecompanyComponent from '../../pub/sharecompany.vue'
import timeComponent from '../../pub/timecomponent.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    sharecompanyComponent,
    timeComponent
  },
  data() {
    return {
      formCustom:{
          bikeNo:"",
          rentType:"",
          enteringCompanyId:"",
          status:"",
          startTime:"",
          endTime:"",
          pageCurrent:1,
          pagesize:10,
      },
      timearr:[],
      loading:false,
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
              minWidth:80,
          },
          {
              title: '共享公司',
              key: "enteringCompanyName",
              minWidth:120,
          },
          {
              title: '租用类型',
              key: "endTime",
              minWidth:100,
              render: (h, params) => {
                let str = ""
                if(params.row.rentType==1){
                  str = "站点内租车"
                }
                if(params.row.rentType==2){
                  str = "站点外租车"
                }
                if(params.row.rentType==3){
                  str = "站内租车站内还车正常结束"
                }
                if(params.row.rentType==4){
                  str = "站内租车站外还车"
                }
                if(params.row.rentType==5){
                  str = "站外租车站内还车"
                }
                if(params.row.rentType==6){
                  str = "站外租车站外还车"
                }
                if(params.row.rentType==7){
                  str = "未租车站内还车"
                }
                if(params.row.rentType==8){
                  str = "未租车站外还车"
                }
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车状态',
              minWidth:100,
              key: 'beginTime',
              render: (h, params) => {
                let str = params.row.status==1?"租车中":"租车结束"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '租车时间',
              minWidth:80,
              key: 'status',
              sortable: true,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.rentedAt)/1000)
               return h('div', [
                  h('span', str)
              ])
           }
          },
          {
              title: '还车时间',
              minWidth:80,
              key: 'status',
              sortable: true,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.returnedAt)/1000)
               return h('div', [
                  h('span', str)
              ])
           }
          },
      ]
    }
  },
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.startTime = this.$webapi.gettime('date',(new Date().getTime()-(86400000*30))/1000)
    this.formCustom.endTime = this.$webapi.gettime('date',new Date().getTime()/1000)
    this.timearr = [this.formCustom.startTime,this.formCustom.endTime]
    let searchList=JSON.parse(this.$webapi.get('searchList'))
    if(searchList){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
          if(vla.searchobj.pageCurrent){
             this.pageData.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.pageData.pagesize = vla.searchobj.pagesize
          }
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/shared/bikerent/list"){
        _this.handleSubmit()
      }
    })
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
  methods: {
      timeEmit (e) {
        this.formCustom.startTime = e[0]
        this.formCustom.endTime = e[1]
      },
      handleSubmit () {
        this.pageData.pageCurrent = 1
        this.list();
      },
      EmitComponent (e) {
        this.formCustom.enteringCompanyId = e.id || ""
      },
      pageComponentDate (e) {
        this.pageData.pageCurrent=e.pageCurrent;
        this.pageData.pagesize=e.pagesize;
        this.list();
      },
      list (){
        this.formCustom.pageCurrent = this.pageData.pageCurrent
        this.formCustom.pagesize = this.pageData.pagesize
        this.loading = true
        let listdata = {
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          bikeNo:this.formCustom.bikeNo,
          rentType:this.formCustom.rentType,
          enteringCompanyId:this.formCustom.enteringCompanyId,
          status:this.formCustom.status,
          startTime:this.formCustom.startTime==""?"":this.formCustom.startTime,
          endTime:this.formCustom.endTime==""?"":this.formCustom.endTime
        }
        let _this =  this
        this.$api.get('/shared_bike_rent/page',listdata,reset => {
            _this.loading = false
          if (reset.codeId === 1) {
             _this.data = reset.resData.list
             _this.loading = false
             _this.pageData.totalCount=reset.resData.totalCount;
          }else if(reset.codeId === -9){
            _this.data = [];
            _this.pageData=[];
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
