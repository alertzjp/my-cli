<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="70">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="故障名称">
                            <faultType-component @emitfault="EmitDocksiteComponent"></faultType-component>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <div class="">
                       <FormItem>
                           <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
       </div>
        <!--操作按钮-->
       <div class="tableListOperator">
        </div>
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
import timeComponent from '../../pub/timecomponent.vue'
import faultTypeComponent from '../../pub/faultTypecomponent.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    timeComponent,
    faultTypeComponent,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      formCustom:{
        name:"",
       },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      maintaindata:[],
      data:[],
      columns: [
          {
              title: '故障名称',
              minWidth:90,
              key: 'name',
          },
          {
              title: '上级分类',
              minWidth:90,
              key: 'parentName',
          },
          {
              title: '创建人',
              minWidth:90,
              key: 'createName',
          },
          {
              title: '创建时间',sortable: true,
              width:90,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
         },
         {
             title: '更新人',
             minWidth:90,
             key: 'updateName',
         },
         {
             title: '更新时间',
             width:90,
             key: 'beginTime',
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
               return h('div', [
                   h('span', str)
             ])
          }
         }
      ],
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    handleDnow () {
        let listdata = this.formCustom
            listdata.token = this.$webapi.get('token')
        let _this =  this
        this.$api.get('/bicycle/low_voltage/export',listdata,reset => {
          if(reset.codeId==undefined || reset.codeId==null){
              window.location.href = _this.$webapicommon + _this.$webapi.getobjurl('/bicycle/low_voltage/export',listdata)
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })

    },
    emitbikeStatus (e) {
      this.formCustom.bicycleStatus = e.value
    },
    EmitDocksiteComponent (e) {
      this.formCustom.name = e.name
    },
    timeEmit (e) {
      let [x,y] = e
        this.formCustom.startTime = x
        this.formCustom.endTime = y
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
    list () {
      this.loading = true
      let listdata = {
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        token:this.$webapi.get('token'),
        name:this.formCustom.name
      }
      let _this =  this
      this.$api.get('/bicycleFaultType/list',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
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
