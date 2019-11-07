<template>
  <Row>
     <Col :xs="24" :sm="24" :md="24" :lg="24">
         <div class="">
              <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
              <!-- <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component> -->
          </div>
     </Col>
  </Row>
</template>
<script>
import tableComponent from '../pub/tablecommon.vue'
import pageComponent from '../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
  },
  props: {
    listUrl: {
      type: [String],
      default () {
        return ''
      }
    },
    params: {
      type: [Object],
      default () {
        return {}
      }
    },
    columns:{
      default () {
        return []
      }
    }
  },
  data () {
    return {
      loading:false,
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pageSize:10,
      },
      data:[]
    }
  },
  created () {
    this.searchList()
  },
  methods: {
    searchList () {
      let _this =  this      
      this.$api.get(this.listUrl,this.params,reset => {
        if (reset.codeId === 1) {
          reset.resData.list.forEach((a)=>{
            a.checkBox = false
          })
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
    pageComponentDate() {

    }
  }
}
</script>
<style lang="less" scoped>
</style>
