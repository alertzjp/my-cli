<template>
  <div class="">
    <Modal v-model="eshow" width="660" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
          <div class="" style="margin-bottom:20px;">
              <Form ref="formCustom" :model="formCustom" :label-width="90">
                  <Row>
                      <Col :xs="24" :sm="24" :md="12" :lg="12">
                        <FormItem label="停靠点编号" prop="name">
                            <Input v-model="formCustom.dockSiteNo" placeholder="停靠点编号"></Input>
                        </FormItem>
                      </Col>
                      <Col :xs="24" :sm="24" :md="12" :lg="12">
                        <FormItem label="" >
                          <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                        </FormItem>
                      </Col>
                  </Row>
              </Form>
          </div>
         <div class="">
               <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
          </div>
          <div class="">
               <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
          </div>
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
  props:{
    putinshow:{
      default:true
    },
    setitem:{
      default:()=>{}
    }
  },
  components:{
    tableComponent,
    pageComponent,
  },
  data () {
    return {
      title:"选择停靠点",
      eshow:false,
      loading:false,
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
              title: '停靠点编号',
              key: 'dockSiteNo',
              align: 'center',
              minWidth:150,
          },
          {
              title: '停靠点名称',
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
                           type: 'primary',
                           size: 'default'
                       },
                       style: {
                           marginRight: '5px'
                       },
                       on: {
                           click: () => {
                             _this.select(params.row)
                           }
                       }
                     }, '选择'),
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.eshow = this.putinshow;
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
        this.$emit("emitputincomponent")
      },
      handleSubmit() {
        this.getlist();
      },
      select(e){
        let _this = this;
        let reset = [{
          id:_this.setitem.id,
          dockSiteId:e.id,
          chargePileStatus:'1'
        }]
        let listdata= {
            data:JSON.stringify({
                token:_this.$webapi.get('token'),
                chargePileList:reset
            })
        }
        this.$api.post('/chargepile/launch',listdata,reset => {
          if (reset.codeId === 1) {
             _this.$Message.success('投放成功');
             _this.cancel()
          }else {
             _this.$netcode.getApiCode(reset)
         }
        })
      },
      getlist(){
        let _this = this;
        let listdata= {
            data:JSON.stringify({
                token:this.$webapi.get('token'),
                pageNo:""+this.pageData.pageCurrent,
                pageSize:""+this.pageData.pagesize,
                fenceName:"",
                dockSiteNo:this.formCustom.dockSiteNo
            })
        }
        this.$api.get('/docksite/list',listdata,reset => {
          if (reset.codeId === 1) {
             _this.data=reset.resData.list;
             if(reset.resData){
             _this.pageData.totalCount=reset.resData.totalCount;
             _this.pageData.pageCurrent=reset.resData.pageNo;
             _this.pageData.pagesize=reset.resData.pageSize;
           }
          }else {

         }
        })
      },
      pageComponentDate(e){
        this.pageData.pageCurrent=e.pageCurrent;
        this.pageData.pagesize=e.pagesize;
        this.list();
      },
      addrolepost () {
        let listdata = {
             data:JSON.stringify({
               riderParams:{
                  mcModel:this.formValidate.mcModel,
                  speedLimit:this.formValidate.speedLimit,
                  wheelDiameter:this.formValidate.wheelDiameter,
                  bikeModel:this.formValidate.bikeModel,
                  startDelay:this.formValidate.startDelay,
                  bomId:this.formValidate.bomId
              },
               token:this.$webapi.get('token')
             })
        }
        let _this = this
        this.$api.post("/riderparams/add", listdata, reset => {
          if (reset.codeId == 1) {
            _this.cancel()
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      },
      handleReset (name) {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
</style>
