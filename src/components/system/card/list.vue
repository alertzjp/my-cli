<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="维护卡号">
                       <Input type="text" v-model="formCustom.cardNo" placeholder="请输入维护卡号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="卡号状态">
                     <Select v-model="formCustom.status" placeholder="请选择卡号状态">
                         <Option value="" >全部</Option>
                         <Option value="1">有效</Option>
                         <Option value="2">已完成</Option>
                     </Select>
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
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="addrole" v-if="$hasPerm('/maintain/cardadd')"></Buttoncomponent>
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
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import addComponent from "./add.vue"
import pageComponent from "../../pub/page.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    addComponent,
    pageComponent
  },
  data () {
    return {
      loading:false,
      addshow:false,
      formCustom:{
          cardNo:"",
          status:"",
          maintainerName:"",
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
              title: '维护卡号',
              key: 'cardNo',
              minWidth:120,
              render: (h, params) => {
                let str = params.row.cardNo
                let _this = this;
                if(params.row.show){
                  return h('Input', {
                    props: {
                      value: params.row.cardNo
                    },
                    style: {
                        border: '1px solid #254CE8',
                        borderRadius:"5px"
                    },
                    on: {
                      'on-blur': function (event) {
                        if(event.target.value==""){
                          _this.$Message.info("不能为空")
                          return
                        }
                        if(event.target.value.length>0 && event.target.value.length>10){
                          _this.$Message.info("长度不能超过10位")
                          return
                        }
                        // if(isNaN(Number(event.target.value))){
                        //   _this.$Message.info("卡号只能是数字格式")
                        //   return
                        // }
                        _this.data[params.index].cardNo = event.target.value
                        _this.editpost(params.index)
                      }
                    }
                  });
                }else{
                  return h('div', [
                      h('span', str)
                ])
                }
           }
          },
          {
              title: '持有人',
              key: 'maintainerName',
              minWidth:80,
          },
          {
              title: '卡号状态',
              key: 'status',
              minWidth:80,
              render: (h, params) => {
                let str = params.row.status
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
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
              title: '修改时间',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
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
              minWidth:150,
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
                              display:_this.$hasPerm('/maintain/cardupdate')?params.row.status!='已分配'?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                 // params.row.show = true;
                                 _this.data.forEach(function(a){
                                   if(params.row.id==a.id){
                                     a.show = true;
                                   }else{
                                     a.show = false;
                                   }
                                 })
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
                              display:_this.$hasPerm('/maintain/carddelete')?params.row.status!='已分配'?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                _this.$webapi.getMessinfo({
                                  title:"确定要删除维护卡号【"+params.row.cardNo+"】?",
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
      if(_this.$route.path == "/admin/system/card/list"){
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
    editpost (index) {
      let listdata = {
        data:JSON.stringify({
          id:""+this.data[index].id,
          cardNo:this.data[index].cardNo,
          token:this.$webapi.get('token')
        })
      }
      let _this = this;
      this.$api.post('/maintain/cardupdate',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.info('编辑成功');
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
      this.$api.post('/maintain/carddelete',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.info('已删除');
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
           cardNo:this.formCustom.cardNo,
           status:this.formCustom.status,
           // maintainerName:this.formCustom.maintainerName,
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize
         }
      }
      let _this =  this
      this.$api.get('/maintain/cardlist',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
        let data  = reset.resData.list
            data.forEach((a)=>{
              a.show = false
            })
            _this.data = data
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
