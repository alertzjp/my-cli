<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="80">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点名称">
                      <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :siteId="formCustom.docksiteId"  :type="2"></docksite-component>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="换电人">
                    <maintainerid-component @emitmaintainer='emitmaintainer' placeholder='请选择换电人' type="1" :propsid="formCustom.maintainerId"></maintainerid-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="检测状态">
                    <Select v-model="formCustom.status"  placeholder="请选择检测状态">
                       <Option value="">全部</Option>
                       <Option value="0">未检测</Option>
                       <Option value="1">已检测</Option>
                   </Select>
                  </FormItem>
               </Col>

               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="5">
                 <FormItem label="完成时间">
                     <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="3">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
               <span>共计换电次数：{{pageData.totalCount}}</span>
            </div>
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
  import timeComponent from '../../pub/timecomponent.vue'
  import docksiteComponent from "../../pub/bicycledocksite.vue"
  import maintaineridComponent from "../../pub/maintainerIdcomponent.vue"

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent,
    docksiteComponent,
    maintaineridComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addroleshow:false,
      timearr:[],
      formCustom:{
          docksiteNo:"",
          docksiteId:"",
          maintainerId:"",
          status:"",
          startTime:"",
          endTime:"",
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
              title: '站点名称',
              key: 'docksiteName',
              minWidth:90,
          },
          {
              title: '站点编号',
              key: "docksiteNo",
              minWidth:90,
          },
          {
              title: '换电人',
              key: "createrName",
              minWidth:90,
          },
          {
              title: '换前电量',
              key: "oldVoltage",
              minWidth: 90,
          },
          {
              title: '换后电量',
              key: "newVoltage",
              minWidth: 90,
          },

          {
              title: '图片',
              key: "image",
              minWidth:150,
              render: (h, params) => {
                let _this = this;
                return h('div',[
                  h('img',{
                    attrs:{
                      src:params.row.oldImgUrl
                    },
                    style:{
                      width:'50px',
                      height:'50px',
                      marginRight:'10px',
                      marginTop:'5px',
                      display:params.row.oldImgUrl?"":"none"
                    },
                    on:{
                      'click' () {
                         _this.$webapi.getimg(params.row.oldImgUrl)
                      }
                    }
                  }),
                  h('img',{
                    attrs:{
                      src:params.row.newImgUrl
                    },
                    style:{
                      width:'50px',
                      height:'50px',
                      marginTop:'5px',
                      display:params.row.newImgUrl?"":"none"
                    },
                    on:{
                      'click' () {
                         _this.$webapi.getimg(params.row.newImgUrl)
                      }
                    }
                  })
               ])
           }
         },
         {
             title: '检测状态',
             key: "status",
             minWidth: 90,
             render: (h, params) => {
               let str = params.row.status==0?"未检测":'已检测'
               return h('div', [
                   h('span', str)
             ])
          }
         },
         {
             title: '站点信号强度',
             key: "signalStatus",
             minWidth:90,
         },
         {
             title: '预警时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.warnTime)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
         },
         {
             title: '完成换电时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.finishTime)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
         },
         {
             title: '检测时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.checkTime)/1000)
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
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  mounted() {
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
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/customerManage/changeBattery/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      if(this.flag){
        this.pageData.pageCurrent=1;
      }
      this.list()
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteId = e.id
      this.formCustom.docksiteNo = e.docksiteNo
    },
    emitmaintainer(e){
      let _this = this;
      // this.$nextTick(()=>{
      //   _this.formCustom.maintainerId = e.id
      // })
       this.$set(this.formCustom, 'maintainerId', e.id||'')
    },
    timeEmit(e){
      this.formCustom.startTime=e[0]||"";
      this.formCustom.endTime=e[1]||"";
    },
    emitrolecomponent(e){
     this.addroleshow = false;
     this.list()
   },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    add(){
      this.addroleshow = true;
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
            pageNo:this.pageData.pageCurrent,
            pageSize:this.pageData.pagesize,
            docksiteId: this.formCustom.docksiteId,
            docksiteNo:this.formCustom.docksiteNo,
            maintainerId:this.formCustom.maintainerId,
            status:this.formCustom.status,
            startTime:this.formCustom.startTime?this.formCustom.startTime+" 00:00:00":"",
            endTime:this.formCustom.endTime?this.formCustom.endTime+" 23:59:59":""
      }
      let _this =  this
      this.$api.get('/bicycledocksite/batery_record/page',listdata,reset => {
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
