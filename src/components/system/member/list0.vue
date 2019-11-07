<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="用户名">
                       <Input type="text" v-model="formCustom.name"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="真实姓名">
                       <Input type="text" v-model="formCustom.userName"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="电话">
                       <Input type="text" v-model="formCustom.mobile"></Input>
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
       <Button type="primary" icon="md-add" size="large"  @click="addrole">新增</Button>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
        </Col>
     </Row>
   </div>
   <addrole-component v-if="addroleshow" :addroleshow="addroleshow" @emitrolecomponent="emitrolecomponent"></addrole-component>
   <role-component v-if="roleshow" :setlectItem="setlectItem"  @emitrolecomponent="emitrolecomponent"></role-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import addroleComponent from "./add.vue"
import roleComponent from "./editrole.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    addroleComponent,
    roleComponent
  },
  data () {
    return {
      loading:false,
      addroleshow:false,
      formCustom:{
          name:"",
          userName:"",
          mobile:""
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
              minWidth:150,
          },
          {
              title: '真名',
              key: 'userName',
              minWidth:150,
          },
          {
              title: '电话',
              key: 'mobile',
              minWidth:150,
          },
          {
              title: '角色名称',
              key: 'roleName',
              minWidth:150,
          },
          {
              title: '创建时间',sortable: true,
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('date',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:180,
              render: (h, params) => {
                let _this = this;
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
                                this.$router.push({path:"/admin/system/role/permission?roleId="+params.row.id})
                              }
                          }
                      }, '权限'),
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
                                this.setlectItem = params.row
                                this.roleshow = true
                              }
                          }
                      }, '设置角色'),
                      h('Button', [
                          h('Poptip', {
                              props: {
                                  confirm: true,
                                  title: '确定要删除吗！',
                                  type: 'error',
                                  size: 'small'
                              },
                              style: {
                                  textAlign: 'left'
                              },
                              on: {
                                  'on-ok': function(){
                                    _this.delrole(params.row)
                                  }
                              }
                          }, '删除')
                      ])
                  ]);
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
    addrole () {
      this.addroleshow = true
    },
    emitrolecomponent () {
      this.addroleshow = false
      this.list()
    },
    delrole (e) {
      let listdata = {
        data:JSON.stringify({
          id:""+e.id,
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
      this.list()
    },
    list () {
      this.loading = true
      let listdata = {
         data:{
           token:this.$webapi.get('token'),
           name:this.formCustom.name,
           userName:this.formCustom.userName,
           mobile:this.formCustom.mobile
         }
      }
      let _this =  this
      this.$api.get('/account/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = []
          _this.loading = false
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
