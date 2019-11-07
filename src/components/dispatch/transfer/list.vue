<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="调度类型">
                     <Select v-model="formCustom.type">
                        <Option value="">全部</Option>
                        <Option value="1">调入</Option>
                        <Option value="2">调离</Option>
                    </Select>
                </FormItem>
              </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点名称">
                        <site-component @EmitDocksiteComponent="outSiteName" :docksiteNo="formCustom.siteNo"></site-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点编号">
                       <Input type="text" v-model="formCustom.siteNo" placeholder="请输入站点编号"></Input>
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
        <!-- <Button type="primary" icon="md-add" size="large"  @click="add" v-if="$hasPerm('/site_monitor_parameter/add')">新增站点监控</Button> -->
     </div>
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
import siteComponent from '../../pub/bicycledocksite.vue'
export default {
  name: "",
  components:{
    tableComponent,
    siteComponent
  },
  data () {
    return {
      loading:false,
      data:[],
      formCustom:{
         siteName:"",
         siteNo:"",
         type:"",
      },
      columns:[
          {
              title: '类型',
              key: 'minBicycleNum',
              minWidth:80,
              render: (h, params) => {
                let str = params.row.type==1?"调入":params.row.type==2?"调离":""
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '站点名称',
              key: 'siteName',
              minWidth:150,
          },
          {
              title: '站点编号',
              key: 'siteNo',
              minWidth:120,
          },
          {
              title: '车辆数',
              key: 'bicycle_num',
              minWidth:80,
          },
          {
              title: '站点车辆',
              key: 'bicycle_num',
              minWidth:80,
              render: (h, params) => {
                let str = params.row.site_free_pile>0?params.row.site_bicycle:params.row.site_total_pile
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '空闲车位',
              key: 'site_free_pile',
              minWidth:80,
          },
          {
              title: '总车位',
              key: 'site_total_pile',
              minWidth:100,
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
          this.formCustom=vla.searchobj;           
        }
      })
    }
    this.list();
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/dispatch/transfer/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleSubmit(){
      this.list();
    },
    outSiteName (e) {
      this.formCustom.siteName = e.docksiteName
      // this.formCustom.siteNo = e.docksiteNo
    },
    list () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        type:this.formCustom.type,
        siteName:this.formCustom.siteName,
        siteNo:this.formCustom.siteNo,
     }
      let _this =  this
      this.$api.get('/site_monitor/transfer',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
            _this.data = reset.resData
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
