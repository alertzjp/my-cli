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
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="指令类型">
                    <Select v-model="formCustom.orderType">
                         <Option value="">全部</Option>
                         <Option value="0">远程升级</Option>
                         <Option value="1">获取锁的状态</Option>
                         <Option value="2">更改服务器地址</Option>
                         <Option value="3">更改震动设置</Option>
                         <Option value="4">设置是否区域锁</Option>
                         <Option value="5">设置锁车</Option>
                         <Option value="6">设置GPS定位</Option>
                    </Select>
                  </FormItem>
               </Col> -->
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70">
                         <Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent>
                       </span>
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
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent
  },
  data () {
    return {
      loading:false,
      data:[],
      formCustom:{
        orderType:"",
        bicycleNo:"",
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
              title: '指令类型',
              key: 'orderName',
              minWidth:120,
          },
          {
              title: '车辆二维码',
              key: 'bicycleNo',
              minWidth:120,
          },
          {
              title: '帐号',
              key: 'senderAccount',
              minWidth:150,
          },
          {
              title: '姓名',
              key: 'senderName',
              minWidth:90,
          },
          {
              title: '创建时间',sortable: true,
              key: 'bicycle_num',
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',params.row.sendTime/1000)
                return h('div', [
                   h('span', str)
               ])
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
          this.formCustom = vla.searchobj
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
      if(_this.$route.path == "/admin/bicycledown/app/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let  listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        // orderType:this.formCustom.orderType,
        bicycleNo:this.formCustom.bicycleNo
     }
      let  _this =  this
      this.$api.get('/downOrder/app_list',listdata,reset => {
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
