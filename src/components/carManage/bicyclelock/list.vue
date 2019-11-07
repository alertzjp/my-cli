<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="车锁编号">
                    <Input type="text" v-model="formCustom.lockNo"></Input>
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
      <Buttoncomponent title="新增"  icon="md-add" @emitButton="handleadd" v-if="$hasPerm('/bicyclelock/add')"></Buttoncomponent>
    </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                 <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
     <add-component v-if="addshow" @bikelockcomponent="bikelockcomponent"></add-component>
     <view-component v-if="viewshow" :selectitem="selectitem" @bikelockcomponent="bikelockcomponent"></view-component>
 </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import addComponent from './add.vue'
import viewComponent from './view.vue'
export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    addComponent,
    viewComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      addshow:false,
      viewshow:false,
      formCustom:{
         lockNo:""
      },
      datashow:false,
      selectitem:{},
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '车锁编号',
              key: 'lockNo',
              minWidth:100,
              render: (h, params) => {
                let _this  = this;
                let  str = params.row.lockNo
                if(params.row.editshow){
                  return h('div', [
                    h('Input', {
                      props: {
                        value: params.row.lockNo
                      },
                      on: {
                        'on-blur': function (event) {
                          params.row.lockNo = event.target.value
                        }
                      }
                    }),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px',
                            marginTop: '5px',
                            display:params.row.editshow?"":"none"
                        },
                        on: {
                            click: () => {
                              _this.itemsave(params.row)
                            }
                        }
                    }, '保存'),
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px',
                            marginTop: '5px',
                            display:params.row.editshow?"":"none"
                        },
                        on: {
                            click: () => {
                              // params.row.lockNo = str
                              params.row.editshow = false
                              _this.data[params.index].editshow = false
                            }
                        }
                    }, '取消'),
                  ])
                }else{
                  return h('div', [
                     h('span', str)
                 ])
                }
            }
          },
          {
              title: '车锁类型',
              key: 'bicycleNo',
              minWidth:100,
              render: (h, params) => {
                let  str = this.$status.changestatus(params.row.status)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '车锁类型',
              key: 'fenceName',
              minWidth:100,
              render: (h, params) => {
                let  str = params.row.ioType==1?"旧锁":"新锁"
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '添加时间',
              key: 'createdAt',
              minWidth:100,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '更新时间',
              key: 'createdAt',
              minWidth:100,
              render: (h, params) => {
                let  str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:200,
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default',
                              icon:"ios-create-outline"
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicyclelock/add')?!params.row.editshow?"":"none":"none"
                          },
                          on: {
                              click: () => {
                               params.row.editshow = true
                               _this.data[params.index].editshow = true
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
                              display:_this.$hasPerm('/bicyclelock/delete')?params.row.status==7?"none":"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:"确定要把【"+params.row.lockNo+"】报废吗?",
                                  yes () {
                                    _this.delpost(params.row)
                                  }
                                })
                              }
                          }
                      }, '报废'),
                      h('Button', {
                          props: {
                              type: 'success',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicyclelock/findOne')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.viewshow = true
                              }
                          }
                      }, '详情')
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    bikelockcomponent (e) {
      this.viewshow = false
      this.addshow = false
      if(e){
        this.list()
      }
    },
    handleadd () {
      this.addshow = true
    },
    itemsave (e) {
      let  _this=this;
      let  listdata={
         data:JSON.stringify({
             bicycleLock:{
               id:e.id,
               lockNo:e.lockNo
             },
             token:this.$webapi.get('token'),
           })
      }
      this.$api.post('/bicyclelock/add',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    add () {
      this.$router.push({
        path:"/admin/device/areaManager/add"
      })
    },
    handleSubmit() {
      this.pageData.pageCurrent=1;
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    delpost(e){
      let  _this=this;
      let  listdata={
         data:JSON.stringify({
             id:""+e.id,
             token:this.$webapi.get('token'),
           })
      }
      this.$api.post('/bicyclelock/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list();
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.loading = true
      let  listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          lockNo:this.formCustom.lockNo
        })
     }
      let  _this =  this
      this.$api.get('/bicyclelock/list',listdata,reset => {
        if (reset.codeId === 1) {
            reset.resData.list.forEach((a)=>{
              a.editshow = false
            })
           _this.data = reset.resData.list
           _this.pageData.totalCount=reset.resData.totalCount;
           setTimeout(()=>{
              _this.loading = false
           },500)
           _this.$webapi.GETTOP()
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
          _this.pageData=[];
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
