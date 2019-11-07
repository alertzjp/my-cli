<template>
  <div id="">
    <div class="">
      <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
         <p slot="header">
             <Icon type="information-circled"></Icon>
             <span>站点下的车辆</span>
         </p>
         <div style="text-align:left">
           <!--查询条件-->
           <div class="tableListForm">
             <Form ref="formCustom" :model="formCustom" :label-width="90">
                 <Row>
                     <Col :xs="24" :sm="24" :md="12" :lg="8">
                        <FormItem label="二维码编号">
                            <Input type="text" v-model="formCustom.bicycle_no"></Input>
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
           <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
           <page-component :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></page-component>
         </div>
         <div slot="footer">
         </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import tableComponent from "./tablecommon.vue"
import pageComponent from "./page.vue"
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent
  },
  props:{ 
    siteName:{
      default () {
        return ""
      }
    },
    docksiteNo:{
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      title:'关联卡号',
      show:true,
      selectItem:{},
      columns:[
        {
            title: '二维码编号',
            key: 'bicycleNo',
            minWidth:150,
            fixed:"left"
        },
        {
            title: '车锁编号',
            key: 'lockNo',
            minWidth:150,
        },
        {
            title: '站点编号',
            key: 'bicycleDocksiteNo',
            minWidth:150,
        },
        {
            title: '站点名称',
            key: 'bicycleDocksiteName',
            minWidth:150,
        },
        {
            title: '电子标签',
            key: 'bicycleSensorsNo',
            minWidth:150,
        },
        {
            title: '车架号',
            key: 'enquiriesNo',
            minWidth:150,
        },
        {
            title: '车辆状态',
            key: 'bicycleStatus',
            minWidth:150,
            render: (h, params) => {
             let str= this.$status.bicycleStatus(params.row.bicycleStatus)
             return h('div', [
                h('span', str)
            ])
         }
        },
        {
            title: '电量',
            key: 'voltage',
            minWidth:150,
        },
      ],
      data:[],
      loading:false,
      pageshow:false,
      formCustom:{
        bicycleDocksiteNo:"",
        bicycle_no:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.bicycleDocksiteNo = this.docksiteNo
    this.list()
  },
  methods: {
    cancel () {
      this.$emit("emitcardcomponent",this.selectItem)
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      this.loading = true
      let listdata = {
         data:{
           token:this.$webapi.get('token'),
           bicycleDocksiteNo:this.formCustom.bicycleDocksiteNo,
           bicycleDocksiteName:this.siteName, 
           bicycle_no:this.formCustom.bicycle_no,
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize
         }
      }
      let _this =  this
      this.$api.get('/bicycle/list',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
          _this.pageData.totalCount = reset.resData.totalCount
          _this.data = reset.resData.list
          _this.pageshow = true
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
    pageComponentDate(e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
