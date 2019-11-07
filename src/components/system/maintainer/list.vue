<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="登录帐号">
                       <Input type="text" v-model="formCustom.loginAccount" placeholder="请输入登录帐号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="姓名">
                       <Input type="text" v-model="formCustom.name" placeholder="请输入姓名"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="手机号码">
                       <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号码"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="维护卡号">
                       <Input type="text" v-model="formCustom.icCardNo" placeholder="请输入维护卡号"></Input>
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
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="addrole" v-if="$hasPerm('/maintain/maintaineradd')"></Buttoncomponent>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                 <page-component :pageData="pageData" @pageComponentDate="pageComponentDate" ></page-component>
             </div>
        </Col>
     </Row>
   </div>
   <add-component v-if="addshow"  @emitcomponent="emitcomponent"></add-component>
   <edit-component v-if="editshow" :selectitem="selectitem"  @emitcomponent="emitcomponent"></edit-component>
   <card-component v-if="cardshow" :selectitem="selectitem"  @emitcardcomponent="emitcardcomponent"></card-component>
   <editrole-component v-if="editroleshow" :setlectItem="selectitem"  @emitcomponent="emitcomponent"></editrole-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import addComponent from "./add.vue"
import editComponent from "./edit.vue"
import cardComponent from "../../pub/cardcomponent.vue"
import pageComponent from "../../pub/page.vue"
import editroleComponent from "./editrole.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    addComponent,
    editComponent,
    cardComponent,
    pageComponent,
    editroleComponent
  },
  data () {
    return {
      loading:false,
      addshow:false,
      editshow:false,
      cardshow:false,
      editroleshow:false,
      selectitem:{},
      formCustom:{
          loginAccount:"",
          name:"",
          mobile:"",
          icCardNo:"",
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
              title: '登录帐号',
              key: 'loginAccount',
              minWidth:100,
          },
          {
              title: '姓名',
              key: 'name',
              minWidth:90,
          },
          {
              title: '性别',
              key: 'mobile',
              minWidth:80,
              render: (h, params) => {
                let str = params.row.sex==1?"男":"女"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '身份证号',
              key: 'idCard',
              minWidth:120,
              render: (h, params) => {
                let str =   params.row.idCard.substring(0,4) + "****" + params.row.idCard.substring(params.row.idCard.length-4,params.row.idCard.length)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '手机号码',
              key: 'mobileNo',
              minWidth:120,
          },
          {
              title: '维护卡',
              key: 'roleName',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.icCardNo==null?"未绑定":params.row.icCardNo
                return h('div', [
                    h('span', str)
              ])
           }
          }, 
          {
              title: '角色管理',
              key: 'roleName',
              minWidth:90,               
          },
          {
              title: '片区名称',
              key: 'roleName',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.districtName==null?"未关联":params.row.districtName
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建人',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.creatorName
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '修改人',
              minWidth:90,
              render: (h, params) => {
                let str = params.row.updatorName
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:330,
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
                              display:_this.$hasPerm('/maintain/maintainerUpdate')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.editshow = true
                              }
                          }
                      }, '编辑'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              // display:_this.$hasPerm('/maintain/maintainer_set_role')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.editroleshow = true
                              }
                          }
                      }, '设置角色'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/maintain/maintainercard')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.selectitem = params.row
                                _this.cardshow = true
                              }
                          }
                      }, '关联卡号'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/maintain/maintainerdelete')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:`确定要删除维护人员『 ${params.row.name} 』`,
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
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/system/maintainer/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    pageComponentDate(e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    },
    addrole () {
      this.addshow = true
    },
    emitcomponent () {
      this.addshow = false
      this.editshow = false
      this.editroleshow = false
      this.list()
    },
    emitcardcomponent (e) {
      if(!e.id){
        this.cardshow = false
        return
      }
      let listdata = {
        data:JSON.stringify({
          id:""+this.selectitem.id,
          icCardNo:""+e.cardNo,
          token:this.$webapi.get('token')
        })
      }
      let _this = this;
      this.$api.post('/maintain/maintainercard',listdata,reset => {
        if (reset.codeId === 1) {
           _this.cardshow = false
           _this.$Message.info("绑定成功")
           _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    delpost (e) {
      let listdata = {
        data:JSON.stringify({
          id:""+e.id,
          token:this.$webapi.get('token')
        })
      }
      let _this = this;
      this.$api.post('/maintain/maintainerdelete',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.info("已删除")
           _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
         data:{
           token:this.$webapi.get('token'),
           loginAccount:this.formCustom.loginAccount,
           name:this.formCustom.name,
           icCardNo:this.formCustom.icCardNo,
           mobileNo:this.formCustom.mobileNo,
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize
         }
      }
      let _this =  this
      this.$api.get('/maintain/maintainerlist',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
        }else if(reset.codeId === -9){
          _this.data = []
          _this.pageData.totalCount = 0
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
