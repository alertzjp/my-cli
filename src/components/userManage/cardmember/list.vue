<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="姓名">
                       <Input type="text" v-model="formCustom.name"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="手机">
                       <Input type="text" v-model="formCustom.mobile"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="账号">
                       <Input type="text" v-model="formCustom.nowCardNo"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="会员号">
                       <Input type="text" v-model="formCustom.memberNo"></Input>
                   </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="时间选择">
                      <time-component @timeEmit="timeEmit"></time-component>
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
       <Buttoncomponent title="新增"  icon="md-add" v-if="$hasPerm('/universalCard/add')" @emitButton="addrole"></Buttoncomponent>
       <!-- <Button type="error" icon="ios-eye" size="large"  @click="showdel(1)" v-if="$hasPerm('/rider/blacklist')">加入黑名单</Button>
       <Button type="success" icon="ios-eye" size="large"  @click="showdel(2)" v-if="$hasPerm('/rider/activate_rider')">激活黑名单</Button>
       <Button type="error" size="large"  @click="showdel(3)" v-if="$hasPerm('/universalCard/report_loss_card')">挂失</Button>
       <Button type="success" size="large"  @click="showdel(4)" v-if="$hasPerm('/universalCard/activate_loss_card')">激活挂失</Button>
       <Button type="error" size="large"  @click="showdel(5)" v-if="$hasPerm('/universalCard/return_card')">退卡</Button> -->
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

   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import timeComponent from '../../pub/timecomponent.vue'
// import addroleComponent from "./add.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    timeComponent
    // addroleComponent
  },
  data () {
    return {
      loading:false,
      addroleshow:false,
      formCustom:{
          name:"",
          memberNo:"",
          mobile:"",
          startTime:"",
          endTime:"",
          nowCardNo:"",
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
              title: '会员号',
              key: 'memberNo',
              minWidth:100,
              fixed:"left"
          },
          {
              title: '卡类型',
              key: 'memberNo',
              minWidth:60,
              render: (h, params) => {
                   let _this = this;
                   let status = '';
                   if(params.row.cardType==1){
                     status="会员卡"
                   }else if(params.row.cardType==2){
                     status="团体卡"
                   }
                   return h('div', {
                  },status)
             }
          },
          {
              title: '账号',
              key: 'nowCardNo',
              minWidth:100,
          },
          {
              title: '姓名',
              key: 'name',
              minWidth:100,
          },
          {
              title: '手机',
              key: 'mobile',
              minWidth:110,
          },
          {
              title: '性别',
              key: 'sex',
              minWidth:60,
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
          {
              title: '充值',
              key: 'balanceAccount',
              minWidth:60,
          },
          {
              title: '押金',
              key: 'foregift',
              minWidth:60,
          },
          {
              title: '卡费',
              key: 'amount',
              minWidth:60,
          },
          {
              title: '证件',
              minWidth:80,
              render: (h, params) => {
                   let _this = this;
                   let str = '身份证';
                   return h('div', {
                  },str)
             }
          },
          {
              title: '证件号码',
              key: 'identityCard',
              minWidth:180,
          },
          {
              title: '出生日期',
              key: 'birthday',
              minWidth:90,
          },
          {
              title: '学生',
              key: 'student',
              minWidth:60,
              render: (h, params) => {
                   let _this = this;
                   let type = '';
                   if(params.row.student==1){
                     type="是"
                   }else{
                     type="否"
                   }
                   return h('div', {
                  },type)
             }
          },
          {
              title: '固定电话',
              key: 'telephone',
              minWidth:100,
          },
          {
              title: '所在单位',
              key: 'workUnit',
              minWidth:100,
          },
          {
              title: '备注',
              key: 'remark',
              minWidth:100,
          },
          {
              title: '  帐号状态',
              key: 'isDeleted',
              minWidth:100,
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
              title: '注冊时间',
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createDate)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          // {
          //     title: '操作',
          //     key: 'action',
          //     align: 'center',
          //     fixed:"right",
          //     minWidth:100,
          //     render: (h, params) => {
          //       let _this = this;
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px',
          //                     display:_this.$hasPerm('/universalCard/update')?(params.row.nowCard!=null)?"":"none":"none"
          //                 },
          //                 on: {
          //                     click: () => {
          //                       this.editItem(params.row)
          //                     }
          //                 }
          //             }, '删除'),
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'default'
          //                 },
          //                 style: {
          //                     marginRight: '5px'
          //                 },
          //                 on: {
          //                     click: () => {
          //                       this.$router.push({
          //                          path:"/admin/userManage/usermember/balance",
          //                          query:{
          //                            id:params.row.id,
          //                            name:params.row.name
          //                          }
          //                        })
          //                     }
          //                 }
          //             }, '查看余额'),
          //         ]);
          //     }
          // }
      ],
    }
  },
  watch:{
    formCustom:{
      handler (val,oldval) {
        if(val){
          this.flag=true;
        }else{
          this.flag=false
        }
      },
      deep:true
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    timeEmit (e) {
      this.formCustom.startTime = e[0]
      this.formCustom.endTime = e[1]
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
          _this.list()
       }else {
         _this.$netcode.getApiCode(reset)
      }
     })
   },
   activatelosscard () {
     let e = this.newdata[0]
     let listdata = {
         card_no:e.cardNo,
         token:this.$webapi.get('token')
     }
     let _this = this;
     this.$api.post('/universalCard/activate_loss_card',listdata,reset => {
       if (reset.codeId === 1) {
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
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          memberNo:this.formCustom.memberNo,
          name:this.formCustom.name,
          cardSerialNumber:this.formCustom.cardSerialNumber,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          nowCardNo:this.formCustom.nowCardNo,
          mobile:this.formCustom.mobile
        })
      }
      let _this =  this
      this.$api.get('/universalCard/page',listdata,reset => {
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
