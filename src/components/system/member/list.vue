<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="用户名">
                       <Input type="text" v-model="formCustom.name" placeholder="请输入用户名"></Input>
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
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="addrole" v-if="$hasPerm('/account/add')"></Buttoncomponent>
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
   <addrole-component v-if="addshow"  @emitmembercomponent="emitmembercomponent"></addrole-component>
   <edit-component v-if="editshow" :setlectItem="setlectItem"  @emitmembercomponent="emitmembercomponent"></edit-component>
   <pass-component v-if="passshow" :setlectItem="setlectItem"  @emitmembercomponent="emitmembercomponent"></pass-component>
   <role-component v-if="roleshow" :setlectItem="setlectItem"  @emitrolecomponent="emitrolecomponent"></role-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import addroleComponent from "./add.vue"
import editComponent from "./edit.vue"
import passComponent from "./pass.vue"
import roleComponent from "./editrole.vue"
import Pages from '../../pub/page.vue'
  export default {
  name: "",
  components:{
    tableComponent,
    addroleComponent,
    editComponent,
    Paging:Pages,
    roleComponent,
    passComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      addshow:false,
      editshow:false,
      passshow:false,
      roleshow:false,
      setlectItem:{},
      formCustom:{
          name:"",
          flag:"",
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
              title: '用户名',
              key: 'name',
              minWidth:80,
          },
          {
              title: '角色名称',
              key: 'roleName',
              minWidth:80,
          },
          {
              title: '姓名',
              key: 'userName',
              minWidth:80,
          },
          {
              title: '手机号',
              key: 'mobile',
              minWidth:110,
          },
          {
              title: '创建时间',sortable: true,
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('date',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建人',
              key: 'creatorName',
              minWidth:90,
          },
          {
              title: '修改时间',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('date',(params.row.updatedAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '修改人',
              key: 'updatorName',
              minWidth:90,
          },
          {
              title: '状态',
              key: 'status',
              minWidth:90,
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:350,
              fixed:"right",
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
                              display:_this.$hasPerm('/account/update')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setlectItem = params.row
                                this.editshow = true
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
                              display:_this.$hasPerm('/account/add')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setlectItem = params.row
                                this.passshow = true
                              }
                          }
                      }, '编辑密码'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/accountRole/editor')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setlectItem = params.row
                                this.roleshow = true
                              }
                          }
                      }, '设置角色'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/account/delete')?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:"确定要删除"+params.row.name+"?",
                                  yes () {
                                      _this.delrole(params.row)
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
      if(_this.$route.path == "/admin/system/member/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    addrole () {
      this.addshow = true
    },
    emitmembercomponent () {
      this.addshow = false
      this.editshow = false
      this.passshow = false
      this.list()
    },
    emitrolecomponent () {
      this.roleshow = false
      this.list()
    },
    pageComponentDate (e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    },
    delrole (e) {
      let listdata = {
        data:JSON.stringify({
          id:JSON.stringify(e.id),
          token:this.$webapi.get('token')
        })
      }
      let _this = this;
      this.$api.post('/account/delete',listdata,reset => {
        if (reset.codeId === 1) {
           _this.list()
        }else {
          _this.loading = false
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
           name:this.formCustom.name,
           flag:this.formCustom.flag,
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize
          }
      }
      let _this =  this
      this.$api.get('/account/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.pageData.totalCount = reset.resData.totalCount
           _this.loading = false
           _this.pageshow = true
        }else if(reset.codeId === -9){
          _this.data = []
          _this.pageData.totalCount = 0
          _this.loading = false
          _this.pageshow = true
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
