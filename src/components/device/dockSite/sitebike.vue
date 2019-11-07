<template>
  <div class="">
    <Modal v-model="show" width="700" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>站点【{{formCustom.docksiteName}}({{formCustom.docksiteNo}})】下车辆</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="8">
                     <FormItem label="二维码编号">
                          <Input type="text" v-model="formCustom.bicycle_no"></Input>
                     </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="8">
                     <FormItem label="锁编号">
                          <Input type="text" v-model="formCustom.lockNo"></Input>
                     </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="8">
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
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent
  },
  props:{
    selectItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{
        bicycle_no:"",
        lockNo:"",
        enquiriesNo:"",
        docksiteName:"",
        docksiteNo:"",
        item:{}
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '二维码编号',
              key: 'bicycleNo',
              minWidth:100,
              fixed:"left"
          },
          // {
          //     title: '车锁编号',
          //     key: 'lockNo',
          //     minWidth:150,
          // },
          // {
          //     title: '站点编号',
          //     key: 'bicycleDocksiteNo',
          //     minWidth:150,
          // },
          // {
          //     title: '站点名称',
          //     key: 'bicycleDocksiteName',
          //     minWidth:150,
          // },
          {
              title: '电子标签',
              key: 'bicycleSensorsNo',
              minWidth:100,
          },
          {
              title: '车架号',
              key: 'enquiriesNo',
              minWidth:80,
          },
          {
              title: '车辆状态',
              key: 'bicycleStatus',
              minWidth:80,
              render: (h, params) => {
                let str = this.$status.bicycleStatus(params.row.bicycleStatus)
                return h('div',str)
              }
          },
          {
              title: '电量',
              key: 'voltage',
              minWidth:80,
          },
      ],
      show:true,
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.docksiteName = this.selectItem.docksiteName
    this.formCustom.docksiteNo = this.selectItem.docksiteNo
    this.list()
  },
  methods: {
    cancel () {
      this.$emit("EMITBIAOQIAN")
    },
    EmitversionComponent (e) {
      this.formCustom.equipmentNo = e.version
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      let listdata = {
        data:JSON.stringify({
          bicycle_no:this.formCustom.bicycle_no,
          lockNo:this.formCustom.lockNo,
          bicycleDocksiteNo:this.formCustom.docksiteNo,
          bicycleDocksiteName:this.formCustom.docksiteName,
          token:this.$webapi.get("token"),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize
        })
      }
      let _this = this;
      this.$api.get('/bicycle/listBySite',listdata,reset => {
        if (reset.codeId == 1) {
          _this.data = reset.resData.list
          _this.pageData.totalCount = reset.resData.totalCount
          _this.pageshow = true
        }else{
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
