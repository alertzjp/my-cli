<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="报障次数">
                  <Input v-model="formCustom.faultTime">
                     <span slot="prepend">大于等于</span>
                 </Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="车辆编号">
                  <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入车辆编号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="车锁编号">
                  <Input type="text" v-model="formCustom.lockNo" placeholder="请输入车锁编号"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="电子标签">
                  <Input type="text" v-model="formCustom.sensorsNo" placeholder="请输入电子标签"></Input>
                </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" :xxl="5">
                <FormItem label="开始日期">
                  <time-component @timeEmit="timeEmit"  :timearr="timearr"></time-component>
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
import timeComponent from '../../pub/timecomponent.vue'
let startTime,endTime;
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent
  },
  data () {
    return {
      loading:false,
      data:[],
      timearr:[],
      formCustom:{
        startTime:this.$webapi.gettime('date',(new Date().getTime()-(86400000*2))/1000),
        endTime:this.$webapi.gettime('date',new Date().getTime()/1000),
        account:"",
        faultTime:"2",
        name:"",
        mobileNo:"",
        faultName:"还不了车",
        sort:"",
        pageCurrent:1,
        pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      columns:[
          {
              title: '车辆编号',
              key: 'bikeNo',
              minWidth:120,
          },
          {
              title: '车锁编号',
              key: 'lockNo',
              minWidth:120,
          },
          {
              title: '电子标签',
              key: 'sensorsNo',
              minWidth:120,
          },
          {
              title: '报障次数',
              key: 'number',
              minWidth:120,
              sortable: true
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:80,
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
                                if(this.formCustom.startTime==""){
                                  this.$Message.info("开始日期没有选择")
                                  return
                                }
                                _this.$router.push({
                                  path:"/admin/total/unablercarview",
                                  query:{
                                    bikeNo:params.row.bikeNo,
                                    startTime:new Date(this.formCustom.startTime + " 00:00:00").getTime(),
                                    endTime:new Date(this.formCustom.endTime+" 23:59:59").getTime(),
                                  }
                                })
                              }
                          }
                      }, '明细')
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.formCustom.startTime = this.$webapi.gettime('date',(new Date().getTime()-(86400000*2))/1000)
    this.formCustom.endTime = this.$webapi.gettime('date',new Date().getTime()/1000)
    this.timearr = [this.formCustom.startTime,this.formCustom.endTime]
    let searchList=JSON.parse(this.$webapi.get('searchList'))
    if(searchList){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;
          if(vla.searchobj.startTime){
            startTime = vla.searchobj.startTime
          }
          if(vla.searchobj.endTime){
            endTime = vla.searchobj.endTime
          }
          if(vla.searchobj.pageCurrent){
             this.pageData.pageCurrent = vla.searchobj.pageCurrent
          }
          if(vla.searchobj.pagesize){
            this.pageData.pagesize = vla.searchobj.pagesize
          }
        }
        this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
      })
    }
    this.list();
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/total/unablereturnbike"){
        _this.list()
      }
    })
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
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    timeEmit (e) {
      startTime = e[0]
      endTime = e[1]
      this.formCustom.startTime = e[0],
      this.formCustom.endTime = e[1]
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    list () {
      this.loading = true
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        startTime:this.formCustom.startTime==""?"":this.formCustom.startTime+" 00:00:00",
        endTime:this.formCustom.endTime==""?"":this.formCustom.endTime+" 23:59:59",
        bikeNo:this.formCustom.bikeNo,
        lockNo:this.formCustom.lockNo,
        sensorsNo:this.formCustom.sensorsNo,
        faultTime:this.formCustom.faultTime
     }
      let _this =  this
      this.$api.get('/statistic/unable_bike',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
            _this.data = reset.resData.list
            _this.pageData.totalCount = reset.resData.totalCount;
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
