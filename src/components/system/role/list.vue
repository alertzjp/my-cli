<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm"></div>
      <!--操作按钮-->
     <div class="tableListOperator">
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="addrole" v-if="$hasPerm('/role/editor')"></Buttoncomponent>
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
   <editrole-component v-if="editroleshow" :editroleshow="editroleshow" :seleteItem="seleteItem" @emitrolecomponent="emitrolecomponent"></editrole-component>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import addroleComponent from "./addrole.vue"
import editroleComponent from "./editrole.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    addroleComponent,
    editroleComponent
  },
  data () {
    return {
      loading:false,
      addroleshow:false,
      editroleshow:false,
      seleteItem:{},
      data:[],
      columns: [
          {
              title: '名称',
              key: 'name',
              minWidth:80,
              render: (h, params) => {
                let _this = this
                 if (params.row.show) {
                   return h('Input', {
                     props: {
                       value: params.row.name
                     },
                     on: {
                       "on-blur": function (event) {
                         if(event.target.value.length<2 || event.target.value.length>30){
                           _this.$Message.info("角色名称最小2个字符,最大值30个字符")
                           return
                         }
                         params.row.name = event.target.value
                         _this.editpost(params.row)
                       }
                     }
                   });
                 } else  {
                   return h('div', params.row.name);
                 }
             }
          },
          {
              title: '角色类型',
              minWidth:100,
              key: 'flag',
              sortable:true,
              sortType:"asc",
              render: (h, params) => {
                let str = params.row.flag==2?"运营商":"维护人员"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:100,
              key: 'terminalNo',
              sortable:true,
              sortType:"asc",
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.create_date)/1000)
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
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/roleResources/editor')?"":"none"
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
                              marginRight: '5px',
                              display:_this.$hasPerm('/role/update')?"":"none"
                           },
                          on: {
                              click: () => {
                                _this.seleteItem = params.row
                                _this.editroleshow = true
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
                              display:_this.$hasPerm('/role/del')?"":"none"
                           },
                          on: {
                              click: () => {                               
                                _this.$webapi.getMessinfo({
                                  title:`确定要删除『 ${params.row.name} 』`,
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
      this.editroleshow = false
      this.list()
    },
    editpost (e) {
      let listdata = {
        id:JSON.stringify(e.id),
        name:e.name,
        token:this.$webapi.get('token')
      }
      let _this = this;
      this.$api.post('/role/update',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.info("编辑成功")
           e.show = false
        }else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    delrole (e) {
      let listdata = {
        id:JSON.stringify(e.id),
        name:'',
        status:'-1',
        token:this.$webapi.get('token')
      }
      let _this = this;
      this.$api.post('/role/del',listdata,reset => {
        if (reset.codeId === 1) {
          _this.$Message.success('删除成功');
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
          token:this.$webapi.get('token'),
      }
      let _this =  this
      this.$api.get('/role/list',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          let data = reset.resData
              data.forEach((a)=>{
                  a.show = false
              })
              _this.data = data
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
