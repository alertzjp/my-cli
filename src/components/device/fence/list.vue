<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="名称">
                           <Input type="text" v-model="formCustom.name"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="地区">
                          <area-component @areaEmit="areaEmit" ></area-component>
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
       <div class="tableListOperator">
         <Button type="primary" icon="md-add" size="large"  @click="addfence">新增</Button>
       </div>
        <!--操作按钮-->
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>

    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import areaComponent from '../../pub/iviewarea.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    areaComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      formCustom:{
        name:'',
        operatorId:'',
        provinceCode:'',
        cityCode:'',
        countyCode:''
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '电子围栏名称',
              key: 'name',
              minWidth:150,
          },
          {
              title: '区域',
              minWidth:200,
              key: 'bikeModel',
              render: (h, params) => {
                let str = params.row.provinceName + "" + params.row.cityName +"" +  params.row.countyName + ""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '停靠点数量',
              minWidth:150,
              key: 'dockSiteNum',
          },
          {
              title: '总投放数量',
              minWidth:150,
              key: 'totalBikeNum',
          },
          {
              title: '总充电桩数量',
              minWidth:150,
              key: 'totalPileNum',
          },
          {
              title: '空闲充电桩数量',
              key: 'freePileNum',
              minWidth:150,
          },
          {
              title: '停车充电桩数量',
              key: 'occupyPileNum',
              minWidth:150,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:360,
              render: (h, params) => {
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
                                  this.$router.push({
                                    path:"/admin/device/fence/edit",
                                    query:{
                                      id:params.row.id
                                    }
                                  })
                              }
                        }
                      }, '编辑'),
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
                                 this.$router.push({
                                   path:"/admin/carManage/section"
                                 })
                              }
                          }
                      }, '投放车辆'),
                      // h('Button', {
                      //     props: {
                      //         type: 'error',
                      //         size: 'default'
                      //     },
                      //     style: {
                      //         marginRight: '5px'
                      //     },
                      //     on: {
                      //         click: () => {
                      //           this.setectitem = this.data[params.index]
                      //           this.scrapshow = true
                      //         }
                      //     }
                      // }, '计费规则'),
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
                                // this.setectitem = this.data[params.index]
                                // this.scrapshow = true
                                let _this=this;
                                this.$webapi.getMessinfo({
                                  title:"确定要删除"+params.row.name+"?",
                                  yes () {
                                      _this.delitem(params.row)
                                  }
                                })
                              }
                          }
                      }, '删除')
                  ]);
              }
          }
      ],
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    areaEmit(e){
     if(e){
        this.formCustom.provinceCode = e[0].code.substr(0,2)
        this.formCustom.cityCode = e[1].code.substr(0,4)
        this.formCustom.countyCode = e[2].code
     }else{
       this.formCustomthis.formCustom.provinceCode = ""
       this.formCustom.cityCode = ""
       this.formCustom.countyCode = ""
     }
    },
    addfence () {
      this.$router.push({
        path:"/admin/device/fence/addfence"
      })
    },
    ifshow () {
       return this.setectitem.id?true:false
    },
    fenceEmitComponent (e) {
      this.formCustom.fenceId = e.id
    },
    pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pagesize = e.pagesize
        this.list()
    },
    handleSubmit () {
      this.list()
    },
    delitem(e){
      let listdata = {
        data:JSON.stringify({
          id:e.id,
          token:this.$webapi.get('token')
        })
      }
      let _this = this;
      this.$api.post('/fence/delete',listdata,reset => {
        if (reset.codeId === 1) {
           if(reset.codeDes==null){
             _this.list()
           }else{
             _this.$netcode.getApiCode(reset)
           }
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        data:{
          name:this.formCustom.name,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
          provinceCode:this.formCustom.provinceCode,
          cityCode:this.formCustom.cityCode,
          countyCode:this.formCustom.countyCode
        }
      }
      let _this =  this
      this.$api.get('/fence/list',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
           _this.pageData.totalCount = reset.resData.totalCount
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
  }
}
</script>
<style lang="less" scoped>
</style>
