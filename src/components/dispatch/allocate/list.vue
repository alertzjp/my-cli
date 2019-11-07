<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="二维码编号">
                    <Input type="text" v-model="formCustom.bikeNo"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="指令类型">
                    <Select v-model="formCustom.status">
                         <Option value="">全部</Option>
                         <Option value="0">远程升级</Option>
                         <Option value="1">已通知</Option>
                         <Option value="2">已解决</Option>
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
        bikeNo:"",
        enteringCompanyId:"",
        siteNo:"",
        siteName:"",
        status:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      columns:[
          {
              title: '通知对象',
              key: 'enteringCompanyName',
              minWidth:120,
              fixed:"left",
          },
          {
              title: '通知时间',
              key: 'bicycle_num',
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',params.row.createdAt/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '二维码编号',
              key: 'bikeNo',
              minWidth:150,
          },
          {
              title: '处理结果',
              key: 'senderName',
              minWidth:150,
              render: (h, params) => {
                let str = params.row.status==1?"已通知":"已解决"
                return h('div', [
                   h('span', str)
               ])
            }
          }
      ]
    }
  },
  mounted() {
    this.list();
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
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        bikeNo:this.formCustom.bikeNo,
        enteringCompanyId:this.formCustom.enteringCompanyId,
        siteNo:this.formCustom.siteNo,
        siteName:this.formCustom.siteName,
        status:this.formCustom.status
     }
      let _this =  this
      this.$api.get('/dispatch_sharing/list',listdata,reset => {
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
