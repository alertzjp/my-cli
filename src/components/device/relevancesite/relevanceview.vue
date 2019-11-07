<template>
  <div class="">
    <Modal v-model="eshow" width="660" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <div class="">
               <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
          </div>
          <div class="">
               <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
          </div>
          <div class="" style="margin-top:20px;">
              <span>新关联停靠点：</span>
              <newdocksiteComponent @EmitComponent="EmitComponent" style="width:50%;"></newdocksiteComponent>
              <Button type="primary" @click="addSubmit()">新增</Button>
          </div>
       </div>
       <div slot="footer" style="text-align:left;">
           <!-- <Button type="primary" @click="addSubmit()">保存</Button>
           <Button type="primary" @click="cancel()">返回</Button> -->
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import newdocksiteComponent from '../../pub/newdocksite.vue'
export default {
  name: "",
  props:{
    relevanceshow:{
      default:false
    },
    id:"",
  },
  components:{
    tableComponent,
    pageComponent,
    newdocksiteComponent
  },
  data () {
    return {
      title:"关联助力车停靠点",
      eshow:false,
      loading:false,
      bikeDockSiteId:"",
      formCustom:{
        dockSiteNo:"",
      },
      pageData:{
         totalCount:1,
         pageCurrent:1,
         pagesize:10,
     },
      data:[],
      columns:[
          {
              title: '已关联停靠点编号',
              key: 'dockSiteNo',
              align: 'center',
              minWidth:150,
          },
          {
              title: '已关联停靠点名称',
              key: 'dockSiteName',
              align: 'center',
              minWidth:150,
          },
          {
              title: '操作',
              key: 'action',
              minWidth:180,
              align: 'center',
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
                             this.delitem(params.row)
                           }
                       }
                     }, '删除'),
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.eshow = this.relevanceshow;
    this.getlist()
  },
  watch:{
    putinshow:{
      handler (val,oldval) {
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
      cancel () {
        this.$emit("emitcomponent")
      },
      EmitComponent(e){
        this.bikeDockSiteId=e||"";
      },
      pageComponentDate(e){
        this.pageData.pageCurrent=e.pageCurrent;
        this.pageData.pagesize=e.pagesize;
        this.list();
      },
      delitem(e){
        let _this = this;
        let listdata= {
            data:JSON.stringify({
                token:this.$webapi.get('token'),
                bikeDockSiteId:e.id
            })
        }
        this.$api.post('/districtbike/delete/by_bikeDockSiteId',listdata,reset => {
          if (reset.codeId === 1) {
             _this.getlist();
          }else {
             _this.$netcode.getApiCode(reset)
         }
        })
      },
      addSubmit() {
        let _this = this;
        if(!this.bikeDockSiteId){
          this.$Message.warning('新关联停靠点没有选择');
          return;
        }
        let listdata= {
            data:JSON.stringify({
                token:this.$webapi.get('token'),
                district:{
                  districtId:this.id,
                  bikeDockSiteId:this.bikeDockSiteId
                }
            })
        }
        this.$api.post('/districtbike/add',listdata,reset => {
          if (reset.codeId === 1) {
             _this.getlist();
          }else {
             _this.$netcode.getApiCode(reset)
         }
        })
      },
      select(e){
        let _this = this;
        let listdata= {
            data:JSON.stringify({
                token:this.$webapi.get('token'),
            })
        }
        this.$api.post('/chargepile/launch',listdata,reset => {
          if (reset.codeId === 1) {
             _this.list();
          }else {
             _this.$netcode.getApiCode(reset)
         }
        })
      },
      getlist(){
        let _this = this;
        let listdata= {
                token:this.$webapi.get('token'),
                pageNo:this.pageData.pageCurrent,
                pageSize:this.pageData.pagesize,
                districtId:this.id,
        }
        this.$api.get('/docksite/find/by_districtId',listdata,reset => {
          if (reset.codeId === 1) {
             _this.data=reset.resData.list;
             if(reset.resData){
             _this.pageData.totalCount=reset.resData.totalCount;
             _this.pageData.pageCurrent=reset.resData.pageNo;
             _this.pageData.pagesize=reset.resData.pageSize;
           }
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
