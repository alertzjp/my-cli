<template>
  <div id="">
    <div class="">
      <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
         <p slot="header">
             <Icon type="information-circled"></Icon>
             <span>{{title}}</span>
         </p>
         <div style="text-align:left">
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
  data () {
    return {
      title:'关联卡号',
      show:true,
      selectItem:{},
      columns:[
        {
            title: '卡号',
            key: 'cardNo',
            minWidth:150,
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            minWidth:300,
            fixed:"right",
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
                              _this.selectItem = params.row
                              _this.cancel()
                            }
                        }
                    }, '选择'),
                ]);
            }
        }
      ],
      data:[],
      loading:false,
      pageshow:false,
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    cancel () {
      this.$emit("emitcardcomponent",this.selectItem)
    },
    list () {
      this.loading = true
      let listdata = {
         data:{
           token:this.$webapi.get('token'),
           status:'1',
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize
         }
      }
      let _this =  this
      this.$api.get('/maintain/cardlist',listdata,reset => {
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
