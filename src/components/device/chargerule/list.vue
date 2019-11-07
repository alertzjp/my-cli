<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
       </div>
       <div class="tableListOperator">
         <Buttoncomponent title="新增"  icon="md-add" @emitButton="addcharge" v-if="$hasPerm('/bicycleChargerule/add')"></Buttoncomponent>
       </div>
        <!--操作按钮-->
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <!-- <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging> -->
              </div>
          </Col>
       </Row>
     </div>
     <add-component v-if="addshow" @emitchargecomponent="emitchargecomponent"></add-component>
     <edit-component v-if="editshow" :selectItem="selectItem" @emitchargecomponent="emitchargecomponent"></edit-component>
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import fenceComponent from '../../pub/fencelistcommon.vue'
import addComponent from './add.vue'
import editComponent from './edit.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    fenceComponent,
    addComponent,
    editComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      addshow:false,
      editshow:false,
      formCustom:{
        fenceId:''
      },
      selectItem:{},
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '每日封顶(元/日)',
              key: 'maxCharge',
              minWidth:120,
              render: (h, params) => {
                let str = "￥" +  params.row.maxCharge
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '超过1小时计费(元/时)',
              key: 'timeCharge',
              minWidth:150,
              render: (h, params) => {
                let str = "￥" +  params.row.timeCharge
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:90,
              key: 'beginTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
         },
          {
              title: '修改时间',
              minWidth:90,
              key: 'firstTime',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '状态',
              minWidth:60,
              key: 'status',
              render: (h, params) => {
                let str = params.row.status==1?"有效":"无效"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:140,
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
                              display:_this.$hasPerm('/bicycleChargerule/update')?"":"none"
                          },
                          on: {
                              click: () => {
                                 _this.selectItem = params.row
                                 _this.editshow = true
                              }
                        }
                      }, '编辑'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicycleChargerule/delete')?"":"none"
                          },
                          on: {
                              click: () => {
                                let _this=this;
                                this.$webapi.getMessinfo({
                                  title:"确定要删除计费规则吗?",
                                  yes () {
                                      _this.del(params.row)
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
    addcharge () {
      this.addshow = true
    },
    emitchargecomponent () {
      this.addshow = false
      this.editshow = false
      this.list()
    },
    fenceEmitComponent (e) {
      this.formCustom.fenceId = e.id
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
    del (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            id:""+e.id
          })
      }
      this.$api.post("/bicycleChargerule/delete", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        data:{
          token:this.$webapi.get('token'),
        }
      }
      let _this =  this
      this.$api.get('/bicycleChargerule/findByOperatorId',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          let data = []
          if(reset.resData){
            data.push(reset.resData)
           _this.data = data
          }else {
           _this.data = data
          }
        }else if(reset.codeId === -9){
          _this.data = []
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
