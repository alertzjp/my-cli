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
                       <FormItem label="记录时间">
                           <time-component @timeEmit="timeEmit" :timearr="timearr"></time-component>
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
             <Buttoncomponent type="success" title="查看分布"  @emitButton="handleLook" v-if="$hasPerm('/tag/periphery/distribute')"></Buttoncomponent>
        </div>
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                 <span>外围车辆数:{{pageData.totalCount}}</span>
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
import mapComponent from '../silenceBicycle/map.vue'
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
              key: 'enteringCompanyName',
          },
          {
              title: '二维码',
              minWidth:80,
              key: 'bikeNo',
          },
          {
              title: '记录时间',
              minWidth: 120,
                render: (h, params) => {
                 let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                 return h('div', [
                     h('span', str)
               ])
            }
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
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/tag/periphery/del')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:`确定要删除外围车辆 ${params.row.bikeNo} 吗`,
                                  yes () {
                                    _this.delpost(params.row)
                                  }
                                })
                              }
                          }
                      }, '删除'),
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
      if(_this.$route.path == "/admin/shared/peripheryBicycle/list"){
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
          flag:2
        }
      })
    },
    delpost(e){
      if(!e.id){
        this.$Message.info("没有该外围车辆信息")
        return
      }
      let listdata = {
            token:this.$webapi.get('token'),
            id: e.id,
      }
      let _this =  this
      this.$api.get('/tag/periphery/del',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.success("删除成功")
           _this.list()
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
        startTime:this.formCustom.startTime?this.formCustom.startTime+' 00:00:00':'',
        endTime:this.formCustom.endTime?this.formCustom.endTime+' 23:59:59':'',
        enteringCompanyId:this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/tag/periphery/list',listdata,reset => {
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
