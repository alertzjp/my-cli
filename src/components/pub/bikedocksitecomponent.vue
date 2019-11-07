<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{title}}</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="片区名称">
                        <district-component @districtEmitComponent="districtEmitComponent"></district-component>
                      </FormItem>
                   </Col>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                     <div class="">
                       <FormItem>
                           <Button type="primary" @click="handleSubmit()">新增</Button>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
         </div>
         <div class="">
           <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
           <page-component :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></page-component>
         </div>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from "./tablecommon.vue"
import pageComponent from "./page.vue"
import districtComponent from "./districtcommon.vue"
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent,
    districtComponent
  },
  props:{
    setectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{},
      title:"维修站点关联片区",
      columns:[
        {
            title: '已关联片区名称',
            key: 'name',
            minWidth:150,
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            minWidth:100,
            fixed:"right",
            render: (h, params) => {
              let _this = this;
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'default'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                              _this.delpost(params.row)
                            }
                        }
                    }, '删除'),
                ]);
            }
        }
      ],
      district:{
          districtId:"",
          bikeDockSiteId:"",
      },
      data:[],
      show:true,
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.district.districtId =this.setectitem.id
    this.list()
  },
  methods: {
    cancel () {
      this.$emit("bikeDockSitecomponent")
    },
    districtEmitComponent (e) {
      this.district.bikeDockSiteId = e.id
    },
    delpost (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            districtId:""+e.id,
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/districtmaintain/delete/by_districtId',listdata,reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    handleSubmit () {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            district:{
                districtId:""+this.district.bikeDockSiteId,
                maintainSiteId:this.setectitem.id
            },
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/districtmaintain/add',listdata,reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    list () {
      let listdata = {
        maintainSiteId:this.setectitem.id,
        token:this.$webapi.get("token"),
        pageNo:this.pageData.pageCurrent,
        pageSize:this.pageData.pagesize
      }
      let _this = this;
      this.$api.get('/district/find/by_maintainSiteId',listdata,reset => {
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
