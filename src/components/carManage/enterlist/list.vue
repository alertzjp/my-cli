<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车辆二维码">
                    <Input type="text" v-model="formCustom.bicycleNo" placeholder="请输入车辆二维码"></Input>
                  </FormItem>
               </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车架号">
                    <Input type="text" v-model="formCustom.enquiriesNo" placeholder="请输入车架号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="站点编号">
                       <Input type="text" v-model="formCustom.siteNo" placeholder="请输入站点编号"></Input>
                   </FormItem>
                </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点名称">
                    <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteNo"></docksite-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" :xxl="5">
                  <FormItem label="开始日期">
                    <time-component @timeEmit="timeEmit"  :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3" >
                    <FormItem label="进出场类型" >
                      <Select v-model="formCustom.ioType">
                          <Option value="">全部</Option>
                          <Option value="0">出场</Option>
                          <Option value="1">进场</Option>
                      </Select>
                    </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="电子标签">
                     <Input type="text" v-model="formCustom.sensorsNo" placeholder="请输入电子标签"></Input>
                </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                  <FormItem label="时间">
                      <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
              </Col> -->
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
import docksiteComponent from '../../pub/bicycledocksite.vue'
import timeComponent from '../../pub/timecomponent.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    docksiteComponent,
    timeComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      timearr:[],
      formCustom:{
         bicycleNo:"",
         enquiriesNo:"",
         siteNo:"",
         siteName:"",
         startTime:"",
         endTime:"",
         docksiteNo:"",
         sensorsNo:"",
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
              title: '车辆二维码',
              key: 'bicycleNo',
              minWidth:100,
          },
          {
              title: '车架号',
              key: 'enquiriesNo',
              minWidth:100,
          },
          {
              title: '电子标签',
              key: 'sensorsNo',
              minWidth:100,
          },
          {
              title: '车锁编号',
              key: 'lockNo',
              minWidth:100,
          },
          {
              title: '站点名称',
              key: 'fenceName',
              minWidth:100,
              render: (h, params) => {
                let  str = params.row.siteName+"("+params.row.docksideNo+")"
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '进出场状态',
              key: 'fenceName',
              minWidth:100,
              render: (h, params) => {
                let  str = params.row.ioType==1?"进场":"出场"
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '进出场时间',
              key: 'createdAt',
              minWidth:100,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
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
    this.formCustom.startTime = this.$webapi.gettime('date',(new Date().getTime()-(86400000*30))/1000)
    this.formCustom.endTime = this.$webapi.gettime('date',new Date().getTime()/1000)
    this.timearr = [this.formCustom.startTime,this.formCustom.endTime]
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.list();
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/carManage/enterlist"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
    },
    EmitDocksiteComponent (e) {
      this.formCustom.siteName = e.docksiteName
      this.formCustom.docksiteNo = e.docksiteNo
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
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        bicycleNo:this.formCustom.bicycleNo,
        // enquiriesNo:this.formCustom.enquiriesNo,
        enquiriesNo:this.formCustom.enquiriesNo,
        siteNo:this.formCustom.siteNo,
        siteName:this.formCustom.siteName,
        ioType:this.formCustom.ioType,
        startTime:this.formCustom.startTime==""?"":this.formCustom.startTime+" 00:00:00",
        endTime:this.formCustom.endTime==""?"":this.formCustom.endTime+" 23:59:59",
        sensorsNo:this.formCustom.sensorsNo
     }
      let  _this =  this
      this.$api.get('/bicycleEnter/list',listdata,reset => {
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
