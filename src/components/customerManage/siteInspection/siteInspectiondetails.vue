<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
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
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '车辆编号',
              key: 'bicycleNo',
              minWidth:90,
          },
          {
              title: '状态',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.status==1?"新增":params.row.status==2?"删除":params.row.status==3?"正常":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
          {
              title: '所属公司',
              key: 'enteringCompanyName',
              minWidth:90,
          },
      ]
    }
  },
  mounted() {
    let inspectionId=this.$route.query.id
    if(inspectionId){
      this.list(inspectionId);
    }
  },
  methods: {
    list (inspectionId) {
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
            inspectionId: inspectionId,
      }
      let _this =  this
      this.$api.get('/inspection/inspectionDetails',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
           _this.data = reset.resData.resData
        }else if(reset.codeId === -9){
           _this.data = [];
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
