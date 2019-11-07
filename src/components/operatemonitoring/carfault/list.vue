<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="终端号">
                       <Input type="text" v-model="formCustom.terminalNo"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="二维码编号">
                       <Input type="text" v-model="formCustom.frameNo"></Input>
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
      formCustom:{
          terminalNo:"",
          frameNo:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '二维码编号',
              key: 'frameNo',
              minWidth:150,
              fixed:"left",
          },
          {
              title: '终端编号',
              key: 'terminalNo',
              minWidth:150,
          },
          {
              title: '电池严重告警',
              key: 'bmsCriticalWarn',
              minWidth:150,
          },
          {
              title: '电池一般告警',
              key: 'bmsNormalWarn',
              minWidth:150,
          },
          {
              title: '控制器故障代码',
              key: 'mcFaultCode',
              minWidth:150,
          },
          {
              title: '运营商名称',
              key: 'operatorName',
              minWidth:150,
          },
          {
              title: '创建时间',sortable: true,
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.sampleTime)/1000)
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
              minWidth:150,
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
                                 this.positionview(params.row)
                              }
                          }
                      }, '位置'),
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
          this.flag=true;
        }else{
          this.flag=false
        }
      },
      deep:true
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    pageComponentDate(e){
     this.pageData.pageCurrent=e.pageCurrent;
     this.pageData.pagesize=e.pagesize;
     this.list();
   },
    handleSubmit () {
      if(this.flag){
       this.pageData.pageCurrent=1;
      }
      this.list()
    },
    positionview(e){
      //frameNo  terminalNo  id
     this.$router.push({ path: '/admin/operatemonitoring/carfault/position',query: {item:e}})
    },
    list () {
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          terminalNo:this.formCustom.terminalNo,
          frameNo:this.formCustom.frameNo,
        })
      }
      let _this =  this
      this.$api.get('/bikeTrouble/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list;
           if(reset.resData){
            _this.pageData.totalCount=reset.resData.totalCount;
            _this.pageData.pageCurrent=reset.resData.pageNo;
            _this.pageData.pagesize=reset.resData.pageSize;
          };
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
           _this.pageData=[];
          _this.loading = false
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
