<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="账号">
                       <Input type="text" v-model="formCustom.loginAccount" placeholder="请输入账号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="姓名">
                       <Input type="text" v-model="formCustom.name" placeholder="请输入姓名"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="卡号">
                       <Input type="text" v-model="formCustom.nowCard" placeholder="请输入卡号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="手机号">
                       <Input type="text" v-model="formCustom.mobileNo" placeholder="请输入手机号"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="身份证">
                       <Input type="text" v-model="formCustom.idCardNo" placeholder="请输入身份证"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="客户来源">
                   <Select v-model="formCustom.SourceChannel" placeholder="请选择客户来源">
                      <Option value="">全部</Option>
                      <Option value="1">APP</Option>
                      <Option value="2">IC卡</Option>
                      <Option value="3">市民卡</Option>
                      <Option value="4">公交卡</Option>
                      <Option value="5">工商银行</Option>
                  </Select>
                 </FormItem>
              </Col>
              <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                <FormItem label="帐号状态">
                  <Select v-model="formCustom.IsDeleted" placeholder="请选择帐号状态">
                     <Option value="">全部</Option>
                     <Option value="0">正常</Option>
                     <Option value="1">删除</Option>
                 </Select>
                </FormItem>
             </Col>
               <Col :xs="24" :sm="12" :md="12" :lg="8">
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
       <Buttoncomponent title="新增"  icon="md-add" v-if="$hasPerm('/universalCard/add')" @emitButton="addrole"></Buttoncomponent>
       <span @click="showdel(1)">
         <Buttoncomponent type="error" icon="ios-eye" title="拉入黑名单" v-if="$hasPerm('/rider/blacklist')"></Buttoncomponent>
       </span>
       <span @click="showdel(2)">
         <Buttoncomponent type="success" icon="ios-eye" title="撤销黑名单" v-if="$hasPerm('/rider/activate_rider')"></Buttoncomponent>
       </span>
       <span @click="showdel(3)">
         <Buttoncomponent type="error" title="挂失卡"  v-if="$hasPerm('/rider/blacklist')"></Buttoncomponent>
       </span>
       <span @click="showdel(4)">
         <Buttoncomponent type="success" title="解除挂失" v-if="$hasPerm('/universalCard/activate_loss_card')"></Buttoncomponent>
       </span>
       <span @click="showdel(5)">
         <Buttoncomponent type="error" title="退卡" v-if="$hasPerm('/rider/blacklist')"></Buttoncomponent>
       </span>
       <!-- <Buttoncomponent type="error" title="查看租车记录" @emitButton="zucheClick" v-if="$hasPerm('/universalCard/return_card')"></Buttoncomponent> -->
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
             <div class="">
                <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
   <!-- <addrole-component v-if="addroleshow" :addroleshow="addroleshow" @emitmembercomponent="emitmembercomponent"></addrole-component> -->
   <!-- <zuche-component v-if="zucheshow" :itemdata="newdata[0]" @lockemitcomponent="lockemitcomponent"></zuche-component> -->
   <zuche-component v-if="zucheshow" :itemdata="itemdata" @lockemitcomponent="lockemitcomponent"></zuche-component>
   <refundComponent v-if="refundshow" :refundshow="refundshow" :propsid="id" :selectitem="itemdata" @emitcomponent="emitcomponent"></refundComponent>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import zucheComponent from './zuche.vue'
// import addroleComponent from "./add.vue"
import refundComponent from './refund.vue'
  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    zucheComponent,
    refundComponent
  },
  data () {
    return {
      loading:false,
      addroleshow:false,
      zucheshow:false,
      refundshow:false,
      itemdata:[],
      id:"",
      formCustom:{
          name:"",
          mobileNo:"",
          nowCard:"",
          loginAccount:"",
          idCardNo:"",
          SourceChannel:"",
          IsDeleted:"",
          pageCurrent:1,
          pagesize:10,
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      newdata:[],
      data:[],
      columns: [
          {
            title: ' ',
            key: 'checkBox',
            minWidth:40,
            fixed:"left",
             render:(h,params)=>{
                 return h('div',[
                     h('Checkbox',{
                         props:{
                             value:params.row.checkBox,
                             size:"large"
                         },
                         on:{
                             'on-change':(e)=>{
                                 this.data.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                                     this.$set(items,'checkBox',false)
                                 });
                                 this.newdata = []
                                 this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                                 if(e){
                                      this.newdata.push(this.data[params.index])
                                 }
                             }
                         }
                     })
                 ])
             }
          },
          // {
          //     title: '会员号',
          //     key: 'memberNo',
          //     minWidth:100,
          //     fixed:"left"
          // },
           {
              title: '账号',
              key: 'loginAccount',
              minWidth:100,
          },
          {
              title: '姓名',
              key: 'name',
              minWidth:100,
          },
          {
              title: '手机号',
              key: 'mobileNo',
              minWidth:100,
          },
          {
              title: '性别',
              key: 'sex',
              minWidth:50,
              render: (h, params) => {
                   let _this = this;
                   let status = '';
                   if(params.row.sex==1){
                     status="男"
                   }else if(params.row.sex==2){
                     status="女"
                   }
                   return h('div', {
                  },status)
             }
          },
          // {
          //     title: '充值',
          //     key: 'recharge',
          //     minWidth:50,
          // },
          {
              title: '押金(元)',
              key: 'foregift',
              minWidth:60,
          },
          {
              title: '账号余额(元)',
              key: 'balance',
              minWidth:60,
          },
          {
              title: '卡号',
              key: 'nowCard',
              minWidth:150,
          },
          // {
          //     title: '卡费',
          //     key: 'amount',
          //     minWidth:60,
          // },
          {
              title: '卡类型',
              key: 'cardType',
              minWidth:60,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.cardType==1){
                     type="会员卡"
                   }else if(params.row.cardType==2){
                     type="团体卡"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '客户来源',
              key: 'sourceChannel',
              minWidth:80,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.sourceChannel==1){
                     type="App"
                   }else if(params.row.sourceChannel==2){
                     type="IC卡"
                   }else if(params.row.sourceChannel==3){
                     type="市民卡"
                   }else if(params.row.sourceChannel==4){
                     type="公交卡"
                   }else if(params.row.sourceChannel==5){
                     type="工商银行"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '卡的状态',
              key: 'remark',
              minWidth:60,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.status==-1){
                     type="黑名单"
                   }else if(params.row.status==1){
                     type="正常"
                   }else if(params.row.status==2){
                     type="退卡"
                   }else if(params.row.status==3){
                     type="挂失"
                   }else if(!params.row.status){
                        type="无卡"
                   }
                   return h('div', {
                  },type)
             }
          },

          // {
          //     title: '证件',
          //     minWidth:80,
          //     render: (h, params) => {
          //          let _this = this;
          //          let str = '身份证';
          //          return h('div', {
          //         },str)
          //    }
          // },
          {
              title: '证件号码',
              key: 'idCardNo',
              minWidth:150,
          },
          // {
          //     title: '出生日期',
          //     key: 'birthday',
          //     minWidth:100,
          // },
          // {
          //     title: '学生',
          //     key: 'student',
          //     minWidth:60,
          //     render: (h, params) => {
          //          let _this = this;
          //          let type = '';
          //          if(params.row.student==1){
          //            type="是"
          //          }else{
          //            type="否"
          //          }
          //          return h('div', {
          //         },type)
          //    }
          // },
          // {
          //     title: '固定电话',
          //     key: 'telephone',
          //     minWidth:100,
          // },
          // {
          //     title: '所在单位',
          //     key: 'workUnit',
          //     minWidth:100,
          // },
          // {
          //     title: '备注',
          //     key: 'remark',
          //     minWidth:100,
          // },
          {
              title: '  帐号状态',
              key: 'isDeleted',
              minWidth:80,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.isDeleted==1){
                     type="删除"
                   }else if(params.row.isDeleted==0){
                     type="正常"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '创建时间',sortable: true,
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '修改时间',
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.lastModifyDate)/1000)
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
              minWidth:300,
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
                              display:_this.$hasPerm('/bicyclerent/list')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.itemdata=params.row;
                                this.zucheshow = true
                              }
                          }
                      }, '租车记录'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/universalCard/update')?(params.row.nowCard!=null&&params.row.status!=3)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.editItem(params.row)
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
                              display:"none"
                          },
                          on: {
                              click: () => {
                                this.$router.push({
                                   path:"/admin/userManage/usermember/balance",
                                   query:{
                                     id:params.row.id,
                                     name:params.row.name
                                   }
                                 })
                              }
                          }
                      }, '查看余额'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/rider/balance_refund')?(params.row.balance&&params.row.balance>0)?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.id=params.row.balanceId;
                                this.itemdata=params.row;
                                this.refundshow = true
                              }
                          }
                      }, '余额退款'),
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
          this.flag=true;
          let obj={
               path:this.$route.path,
               searchobj:this.formCustom
          }
          this.$store.dispatch('savesearchvla',obj)
        }else{
          this.flag=false
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
          this.timearr=[this.formCustom.startTime,this.formCustom.endTime]
        }
      })
    }
    this.list()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/userManage/usermember/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    zucheClick () {
      if(this.newdata.length<1){
        this.$Message.info("会员信息没有选择")
        return
      }
      this.zucheshow = true
    },
    lockemitcomponent () {
      this.zucheshow = false
      this.itemdata=[];
    },
    emitcomponent(e){
      this.refundshow=false;
      this.list()
    },
    emitendcomponent () {
      this.balacereshow =false
      this.list()
    },
    addrole () {
       this.$router.push({
         path:"/admin/userManage/usermember/add"
       })
    },
    editItem (e) {
       this.$router.push({
         path:"/admin/userManage/usermember/edit",
         query:{
           id:e.id
         }
       })
    },
    emitmembercomponent () {
      this.addroleshow = false
      this.list()
    },
    pageComponentDate(e){
     this.pageData.pageCurrent=e.pageCurrent;
     this.pageData.pagesize=e.pagesize;
     this.list();
   },
   showdel (e) {
     if(this.newdata.length<1){
       this.$Message.info("会员信息没有选择")
       return
     }
     let _this = this;
     let str = ""
     if(e==1){
       str = "加入黑名单"
     }
     if(e==2){
       str = "激活"
     }
     if(e==3){
       str = "挂失"
     }
     if(e==4){
       str = "激活挂失"
     }
     if(e==5){
       str = "退卡"
     }
     _this.$webapi.getMessinfo({
          title:"确定要将【"+this.newdata[0].name+"】"+str+"?",
          yes () {
            if(e==1){
              _this.delpost()
            }else if(e==2){
              _this.activatecard()
            }else if(e==3){
              _this.losscard()
            }else if(e==4){
              _this.activatelosscard()
            }else if(e==5){
              _this.returncard()
            }
          }
        })
   },
   returncard () {
     let e = this.newdata[0]
     let listdata = {
         rider_id:e.id,
         token:this.$webapi.get('token'),
         refund:true
     }
     let _this = this;
     this.$api.post('/universalCard/return_card',listdata,reset => {
       if (reset.codeId === 1) {
          _this.list()
       }else {
         _this.$netcode.getApiCode(reset)
      }
     })
   },
   losscard () {
     let e = this.newdata[0]
     let listdata = {
         rider_id:e.id,
         token:this.$webapi.get('token')
     }
     let _this = this;
     this.$api.post('/universalCard/report_loss_card',listdata,reset => {
       if (reset.codeId === 1) {
           _this.$Message.info("挂失成功")
          _this.list()
       }else {
         _this.$netcode.getApiCode(reset)
      }
     })
   },
   activatelosscard () {
     let e = this.newdata[0]
     let listdata = {
         card_no:e.nowCard,
         token:this.$webapi.get('token')
     }
     let _this = this;
     this.$api.post('/universalCard/activate_loss_card',listdata,reset => {
       if (reset.codeId === 1) {
          _this.$Message.info(e.nowCard+"解挂成功")
          _this.list()
       }else {
         _this.$netcode.getApiCode(reset)
      }
     })
   },
   activatecard () {
     let e = this.newdata[0]
     let listdata = {
         riderId:e.id,
         token:this.$webapi.get('token')
     }
     let _this = this;
     this.$api.post('/rider/activate_rider',listdata,reset => {
       if (reset.codeId === 1) {
          _this.list()
       }else {
         _this.$netcode.getApiCode(reset)
      }
     })
   },
   delpost () {
      let e = this.newdata[0]
      let listdata = {
          riderId:e.id,
          token:this.$webapi.get('token')
      }
      let _this = this;
      this.$api.post('/rider/blacklist',listdata,reset => {
        if (reset.codeId === 1) {
           _this.list()
        }else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    handleSubmit () {
      if(this.flag){
       this.pageData.pageCurrent=1;
      }
      this.list()
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      this.newdata = []
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          mobileNo:this.formCustom.mobileNo,
          name:this.formCustom.name,
          loginAccount:this.formCustom.loginAccount,
          SourceChannel:this.formCustom.SourceChannel,
          nowCard:this.formCustom.nowCard,
          IsDeleted:this.formCustom.IsDeleted,
          IdCardNo:this.formCustom.idCardNo,
        })
      }
      let _this =  this
      this.$api.get('/rider/riderlist',listdata,reset => {
        if (reset.codeId === 1) {
          reset.resData.list.forEach((a)=>{
            a.checkBox = false
          })
          _this.data = reset.resData.list;
           if(reset.resData){
            _this.pageData.totalCount=reset.resData.totalCount;
            _this.pageData.pageCurrent=reset.resData.pageNo;
            _this.pageData.pagesize=reset.resData.pageSize;
          };

           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
           _this.pageData=[];
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
