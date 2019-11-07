<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="90">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="单车公司">
                            <entering-component @EmitcompanyComponent="EmitcompanyComponent" :companyid="formCustom.enteringCompanyId"></entering-component>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="二维码" >
                            <Input type="text" v-model="formCustom.bikeNo" placeholder="请输入共享二维码"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="沉默天数">
                         <Select v-model="formCustom.silenceDayType">
                             <Option value="">全部</Option>
                             <Option value="1">4-6天</Option>
                             <Option value="2">7天以上</Option>
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
             <Buttoncomponent type="success" title="查看分布"  @emitButton="handleLook" v-if="$hasPerm('/tag/silenceBicycle/distribute')"></Buttoncomponent>
        </div>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                 <span>共享沉默车数:{{pageData.totalCount}}</span>
              </div>
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     <map-component v-if="mapshow" :listdata="data" :selectitem='selectitem' @mapemitcomponent="mapemitcomponent"></map-component>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import timeComponent from '../../pub/timecomponent.vue'
import Pages from '../../pub/page.vue'
import enteringComponent from '../../pub/enteringCompany.vue'
import mapComponent from './map.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    enteringComponent,
    mapComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      exporeloading:false,
      mapshow:false,
      selectitem:{},
      timearr:[],
      formCustom:{
        bikeNo:"",
        silenceDayType:"",
        enteringCompanyId:"",
        startTime:"",
        endTime:"",
        pageCurrent:1,
        pagesize:10,
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '单车公司',
              minWidth:100,
              key: 'companyName',
          },
          {
              title: '二维码',
              minWidth:80,
              key: 'bikeNo',
          },
          {
              title: '沉默天数',
              minWidth:100,
              key: 'day',
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:100,
              flexd:"right",
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.mapshow = true
                              }
                          }
                      }, '位置'),
                  ]);
              }
          }
      ],
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
          if(vla.searchobj.pageCurrent){
               this.pageData.pageCurrent = vla.searchobj.pageCurrent
            }
            if(vla.searchobj.pagesize){
              this.pageData.pagesize = vla.searchobj.pagesize
            }
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/shared/silenceBicycle/list"){
        _this.handleSubmit()
        return false
      }
    })
  },
  methods: {
    timeEmit (e) {
      let [x,y] = e
        this.formCustom.startTime = x
        this.formCustom.endTime = y
    },
    EmitcompanyComponent (e) {
      this.formCustom.enteringCompanyId = e.id
    },
    mapemitcomponent(){
      this.mapshow=false
      this.list()
    },
    pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pagesize = e.pagesize
        this.list()
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    handleLook(){
      this.$router.push({
        path:"/admin/shared/silenceBicycle/allbikemap",
        query:{
          flag:1
        }
      })
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        pageNo:this.pageData.pageCurrent,
        pageSize:this.pageData.pagesize,
        token:this.$webapi.get('token'),
        bikeNo:this.formCustom.bikeNo,
        silenceDayType:this.formCustom.silenceDayType,
        enteringCompanyId:this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/tag/silenceBicycle/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
           _this.loading = false
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
  }
}
</script>
<style lang="less" scoped>
</style>
