<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <div class="tableListOperator">
       <Button type="primary" icon="md-add" size="large" @click="add" v-if="$hasPerm('/shared_bike_code_rule/save')">添加规则</Button>
     </div>
     <div class="mb10">
       企业名称: 【{{this.$route.query.name}}】
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
        </Col>
     </Row>
   </div>
   <addcoderule-component v-if="addcodeshow" @emitcomponent="emitcomponent" :enteringCompanyId="formCustom.enteringCompanyId"></addcoderule-component>
   <editcoderule-component v-if="editcodeshow" @emitcomponent="emitcomponent" :enteringCompanyId="formCustom.enteringCompanyId" :selectitem="selectitem"></editcoderule-component>
    </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import pageComponent from '../../pub/page.vue'
  import addcoderuleComponent from './addcoderule.vue'
  import editcoderuleComponent from './editcoderule.vue'

  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    addcoderuleComponent,
    editcoderuleComponent
  },
  data () {
    return {
      loading:false,
      addcodeshow:false,
      editcodeshow:false,
      selectitem:{},
      formCustom:{
        enteringCompanyId:""
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[          
          {
              title: '规则详情',
              key: 'bikeNoRule',
              minWidth:90,
          },
          {
              title: '规则类型',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.bikeType==1?"自行车":params.row.bikeType==2?"助力车":""
                return h('div', [
                    h('span', str)
              ])
            }
          },
           {
              title: '二维码位置',
              key: 'noIndex',
              minWidth:90,             
          },
          {
              title: '创建时间',
              minWidth:150,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
               return h('div', [
                   h('span', str)
             ])
           }
          },
          {
              title: '修改时间',
              minWidth:150,
              render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
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
                              display:_this.$hasPerm('/shared_bike_code_rule/update')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.editcodeshow = true
                              }
                          }
                      }, '修改'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/shared_bike_code_rule/del')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:`确定要删除当前规则吗`,
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
      ]
    }
  },
  mounted() {
    this.formCustom.enteringCompanyId=this.$route.query.id
    if(this.formCustom.enteringCompanyId){
      this.list();
    }
  },
  methods: {
    add(){
      this.addcodeshow=true
    },
    emitcomponent(){
      this.addcodeshow=false
      this.editcodeshow = false
      this.list()
    },
    delpost(e){
      let listdata = {
            token:this.$webapi.get('token'),
            id:e.id,
      }
      let _this =  this
      this.$api.get('/shared_bike_code_rule/del',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.success("删除成功")
           _this.list()
        }
      })
    },
    list () {
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
            enteringCompanyId: this.formCustom.enteringCompanyId,
      }
      let _this =  this
      this.$api.get('/shared_bike_code_rule/getList',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
           _this.data = reset.resData
        }else if(reset.codeId === -9){
           _this.data = [];
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
