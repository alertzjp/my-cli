<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
         <Form ref="formCustom" :model="formCustom" :label-width="80">
             <Row>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="公司名称">
                         <Input type="text" v-model="formCustom.name" placeholder="请输入公司名称"></Input>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="审核状态">
                       <Select v-model="formCustom.codeType" placeholder="请选择审核状态">
                           <Option value="" >全部</Option>
                           <Option value="1" >待审核</Option>
                           <Option value="2" >审核通过</Option>
                           <Option value="3" >审核不通过</Option>
                       </Select>
                     </FormItem>
                 </Col>
                 <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="在线状态">
                       <Select v-model="formCustom.lineStatus" placeholder="请选择在线状态">
                           <Option value="" >全部</Option>
                           <Option value="1" >在线</Option>
                           <Option value="2" >离线</Option>
                       </Select>
                     </FormItem>
                 </Col>
                 <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                     <FormItem label="所在位置">
                          <area-component @areaEmit="areaEmit" :level="1"></area-component>
                     </FormItem>
                 </Col> -->
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
       <div class="tableListOperator">
         <Buttoncomponent title="新增" icon='md-add'  @emitButton="handleadd" v-if="$hasPerm('/bicycle_entering_company/add')"></Buttoncomponent>
         <Buttoncomponent title="编辑帐号和密码"  @emitButton="handleedit" v-if="$hasPerm('/bicycle_entering_company/update/loginName_password')"></Buttoncomponent>
         <Buttoncomponent title="查看运营范围"  @emitButton="handlescope" v-if="$hasPerm('/bicycle_entering_company/getRegionScope')"></Buttoncomponent>
       </div>
        <!--操作按钮-->
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     <add-component v-if="addshow" @EmitComponent="EmitComponent"></add-component>
     <edit-component v-if="editshow" @EmitComponent="EmitComponent" :setectitem="setectitem[0]"></edit-component>
     <auto-component v-if="autoshow" @emitautocomponent="emitautocomponent"></auto-component>
     <login-component v-if="loginshow" @EmitComponent="EmitComponent" :setectitem="setectitem[0]"></login-component>
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import areaComponent from '../../pub/iviewarea.vue'
import autoComponent from '../../pub/autocomponent.vue'
import addComponent from './add.vue'
import editComponent from './edit.vue'
import loginComponent from './login.vue'
 export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    areaComponent,
    addComponent,
    editComponent,
    autoComponent,
    loginComponent
   },
  data () {
    return {
      loading:false,
      pageshow:false,
      addshow:false,
      editshow:false,
      autoshow:false,
      loginshow:false,
      setectitem:[],
      formCustom:{
        name:"",
        provinceCode:"",
        cityCode:"",
        areaCode:"",
        status:"",
        lineStatus:"",
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
           title: ' ',
           align:'center',
           key: 'checkBox',
           minWidth:50,
           render:(h,params)=>{
               return h('div',[
                   h('Checkbox',{
                       props:{
                           value:params.row.checkBox,
                           size:'large'
                       },
                       on:{
                           'on-change':(e)=>{
                               this.data.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                                   this.$set(items,'checkBox',false)
                               });
                               this.data[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                               this.setectitem = []
                               if(e){
                                 this.setectitem.push(params.row)
                               }
                           }
                       }
                   })
               ])
           }
          },
          {
              title: '公司名称',
              key: 'name',
              minWidth:100,
          },
          {
             title: '公司图标',
             align: 'center',
             minWidth:150,
             render: (h, params) => {
               var _this = this;
                 params.row.iconUrl
                 if(params.row.iconUrl){
                   return h('div', [
                     h('img', {
                           attrs: {
                               src: params.row.iconUrl
                           },
                           style: {
                               width: '40px',
                               height: '40px',
                               display:params.row.iconUrl?"auto":"---"
                           },
                       }),
                   ]);
                }else{
                  return h('div','---')
                }
             }
          },
          {
              title: '二维码类型',
              key: 'codeType',
              minWidth:90,
              render:(h,params)=>{
                let str = params.row.codeType==1?"一对一":params.row.codeType==2?"一对多":""
                  return h('div',str)
              }
          },
          {
              title: '固定电话',
              key: 'telephone',
              minWidth:80,
          },
          {
              title: '联系人姓名',
              key: 'contactName',
              minWidth:90,
          },
          {
              title: '联系人手机',
              key: 'contactMobile',
              minWidth:90,
          },
          {
              title: '地址',
              key: 'status',
              minWidth:150,
              render: (h, params) => {
                let str = params.row.provinceName+""+params.row.cityName+""+params.row.areaName+""+params.row.address+""
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '添加时间',
              key: 'address',
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '更新时间',
              key: 'address',
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '审核状态',
              key: 'status',
              minWidth:50,
              render: (h, params) => {
                let str = params.row.status==1?"待审核":params.row.status==2?"审核通过":"审核不通过"
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '在线状态',
              key: 'status',
              minWidth:50,
              render: (h, params) => {
                let str = params.row.lineStatus==1?"在线":params.row.lineStatus==2?"离线":""
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
              minWidth:250,
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
                              display:_this.$hasPerm('/bicycle_entering_company/update')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.setectitem = []
                                this.setectitem.push(params.row)
                                this.editshow = true
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
                              display:_this.$hasPerm('/bicycle_entering_company/audit')?params.row.status!=2?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.setectitem = []
                                this.setectitem.push(params.row)
                                this.autoshow = true
                              }
                          }
                      }, '审核'),
                      h('Button', {
                          props: {
                              type: 'success',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              display:_this.$hasPerm('/bicycle_entering_company/supplement')?params.row.status==2?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                 this.$webapi.getMessinfo({
                                   title:"确定要补增站点吗?",
                                   yes () {
                                     _this.supplement(params.row)
                                   }
                                 })
                              }
                          }
                      }, '补增站点'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/shared_bike_code_rule/getList')?"":"none"
                          },
                          on: {
                              click: () => {
                                this.$router.push({
                                  path:"/admin/system/sitecompany/qrcoderule",
                                  query:{
                                    id:params.row.id,
                                    name:params.row.name
                                  }
                                })
                              }
                          }
                      }, '二维码规则')
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
      if(_this.$route.path == "/admin/system/sitecompany/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    handleadd () {
      this.addshow = true
    },
    handleedit () {
      if(this.setectitem.length<1){
        this.$Message.info("公司没有选择")
        return
      }
      this.loginshow = true
    },
    handlescope(){
      if(this.setectitem.length<1){
        this.$Message.info("公司没有选择")
        return
      }
      this.$router.push({
        path:"/admin/system/sitecompany/setscope",
        query:{
          id:this.setectitem[0].id,
          // mapstr:this.setectitem[0].regionScope,
        }
      })
    },
    areaEmit (e) {
      this.formCustom.provinceCode = (e[0].code).substring(0,2)
      this.formCustom.cityCode = (e[1].code).substring(0,4)
    },
    EmitComponent (e) {
      this.addshow = false
      this.editshow = false
      this.loginshow = false
      this.setectitem=[]
      this.list()
    },
    supplement (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        id:parseInt(e.id)
      }
      this.$api.post("/bicycle_entering_company/supplement", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    emitautocomponent (e) {
      if(e){
        let _this = this;
        let listdata = {
          token:this.$webapi.get('token'),
          auditOpinion:e.auditOpinion,
          status:e.status,
          id:this.setectitem[0].id
        }
        this.$api.post("/bicycle_entering_company/audit", listdata, reset => {
          if (reset.codeId == 1) {
            _this.autoshow = false
            _this.list()
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      }else {
        this.setectitem=[]
        this.autoshow = false
      }
    },
    pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pagesize = e.pagesize
        this.list()
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    shengji (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
        id:""
      }
      this.$api.post("/bicycleLocation/list", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    reboot (e) {
      let _this = this;
      let listdata = {
        token:this.$webapi.get('token'),
        equipmentNo:""+e.equipmentNo,
      }
      this.$api.post("/site/order/reboot", listdata, reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.setectitem = []
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        pageNo:""+this.pageData.pageCurrent,
        pageSize:""+this.pageData.pagesize,
        name:this.formCustom.name,
        provinceCode:this.formCustom.provinceCode,
        cityCode:this.formCustom.cityCode,
        // areaCode:this.formCustom.areaCode,
        status:this.formCustom.status,
        lineStatus:this.formCustom.lineStatus,
      }
      let _this =  this
      this.$api.get('/bicycle_entering_company/page',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
        }else if(reset.codeId === -9){
          _this.data = []
          _this.pageData.totalCount = 0
           _this.pageshow = true
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
