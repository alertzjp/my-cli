<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4"  >
                 <FormItem label="站点编号">
                      <Input type="text" v-model="formCustom.dockSiteNo" placeholder="请输入站点编号"></Input>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点名称">
                      <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.docksiteno"></docksite-component>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="片区名称">
                       <district-component @districtEmitComponent="districtEmitComponent" :fenceId="formCustom.fenceId"></district-component>
                 </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点类型">
                   <Select v-model="formCustom.siteType" placeholder="请选择站点类型">
                        <Option value="">全部</Option>
                        <Option value="1">无桩站点</Option>
                        <Option value="2">综合站点</Option>
                   </Select>
                 </FormItem>
               </Col> -->
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="设备号">
                      <Input type="text" v-model="formCustom.equipmentNo" placeholder="请输入设备号"></Input>
                 </FormItem>
               </Col>
               <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" v-if="tabshow(7) || formCustom.IShow==1">
                 <FormItem label="通讯状态">
                   <Select v-model="formCustom.status" placeholder="请选择通讯状态">
                        <Option value="">全部</Option>
                        <Option  value="1">正常</Option>
                        <Option  value="2">电压不足</Option>
                        <Option  value="3">线圈异常</Option>
                        <Option  value="4">电压,线圈异常</Option>
                        <Option  value="5">断开连接</Option>
                   </Select>
                 </FormItem>
               </Col> -->
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4" >
                 <FormItem label="站点状态">
                   <Select v-model="formCustom.status" placeholder="请选择站点状态">
                        <Option value="">全部</Option>
                        <Option  value="1">运营中</Option>
                        <Option  value="-1">关闭</Option>
                   </Select>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70">
                         <Buttoncomponent title="查询"   @emitButton="handleSubmit"></Buttoncomponent>
                         <!-- <Buttoncomponent title="展开"  icon="ios-arrow-down" @emitButton="tabopen" v-if="formCustom.IShow==0"></Buttoncomponent>
                         <Buttoncomponent title="收起"  icon="ios-arrow-up" @emitButton="tabopen" v-else></Buttoncomponent> -->
                       </span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <div class="tableListOperator">
       <Buttoncomponent title="新增"  icon="md-add" @emitButton="add" v-if="$hasPerm('/bicycledocksite/add')"></Buttoncomponent>
       <Buttoncomponent title="导入"  type="success" icon="md-arrow-down"  @emitButton="exportfile" v-if="$hasPerm('/bicycledocksite/import')"></Buttoncomponent>
       <Buttoncomponent title="地图站点"   @emitButton="CARSITEMAP"></Buttoncomponent>
       <Buttoncomponent title="站点下车辆"   @emitButton="SITEDNOWCAR" v-if="$hasPerm('/bicycle/listBySite')"></Buttoncomponent>
       <Buttoncomponent title="获取站点信号强度"   @emitButton="XINXI"   v-if="$hasPerm('/site/order/network_signal')"></Buttoncomponent>
       <Buttoncomponent title="统计标签数量"   @emitButton="GETBIAOQIAN" v-if="$hasPerm('/site/order/statistics_tag')"></Buttoncomponent>
       <Buttoncomponent title="查看站点共享单车"   @emitButton="DNOWSANFANGCAR" v-if="$hasPerm('/bicycledocksite/other_list')"></Buttoncomponent>
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
   <export-component v-if="exportshow" @emitcomponent="emitcomponent"></export-component>
   <siteseting-component v-if="setingshow" @bikeDockSitecomponent="bikeDockSitecomponent" :selectItem="selectItem"></siteseting-component>
   <bycle-component v-if="bycleshow" :selectItem="selectItem" @addcarcomponent="addcarcomponent"></bycle-component>
   <biaoqian-component v-if="biaoqianshow" :selectItem="selectItem" @EMITBIAOQIAN="EMITBIAOQIAN"></biaoqian-component>
   <xinxi-component v-if="xinxishow" :selectItem="selectItem" @EMITXINXICOMPONENT="EMITXINXICOMPONENT"></xinxi-component>
   <sitebike-component v-if="sitebikeshow" :selectItem="selectItem" @EMITBIAOQIAN="EMITBIAOQIAN"></sitebike-component>
   <sanfangbike-component v-if="sanfangshow" :selectItem="selectItem" @bikeSitecomponent="bikeSitecomponent"></sanfangbike-component>
   <sitesancar-component v-if="sanfangcarshow" :selectItem="selectItem" @emitcarmap="bikeSitecomponent"></sitesancar-component>
   <carmap-component v-if="carmapshow" :selectItem="selectItem" @EMITBIAOQIAN="EMITBIAOQIAN"></carmap-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import fenceComponent from '../../pub/fencelistcommon.vue'
import exportComponent from './exportcomponent.vue'
import sitesetingComponent from './setingcomponent.vue'
import bycleComponent from '../../pub/byclecomponent.vue'
import docksiteComponent from "../../pub/bicycledocksite.vue"
import biaoqianComponent from "./biaoqian.vue"
import xinxiComponent from "./xinxi.vue"
import sitebikeComponent from "./sitebike.vue"
import sanfangbikeComponent from "./sanfangbike.vue"
import sitesancarComponent from "./sitesancar.vue"
import carmapComponent from "./carmap.vue"
import districtComponent from '../../pub/districtcommon.vue'
export default {
  name: "",
  components:{
    tableComponent,
    tableComponent,
    pageComponent,
    fenceComponent,
    exportComponent,
    sitesetingComponent,
    bycleComponent,
    docksiteComponent,
    biaoqianComponent,
    xinxiComponent,
    sitebikeComponent,
    sanfangbikeComponent,
    sitesancarComponent,
    carmapComponent,
    districtComponent,
  },
  data () {
    return {
      loading:false,
      exportshow:false,
      setingshow:false,
      bycleshow:false,
      biaoqianshow:false,
      xinxishow:false,
      sitebikeshow:false,
      sanfangshow:false,
      sanfangcarshow:false,
      carmapshow:false,
      IShow:0,
      formCustom:{
           IShow:0,
          status:"",
          equipmentNo:"",
          dockSiteNo:"",
          dockSiteName:"",
          districtNo:"",
          docksiteno:"",
          fenceId:"",
          pageCurrent:1,
          pagesize:10,
      },
      selectItem:{},
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      newdata:[],
      dearalldata:[],
      data:[],
      columns:[
          {
            title: '选择',
            key: 'checkBox',
            width:50,
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
          {
              title: '站点名称',
              key: 'docksiteName',
              minWidth:80,
              fixed:"left"
          },
          {
              title: '站点编号',
              key: 'docksiteNo',
              minWidth:80,
          },
          {
              title: '片区名称',
              key: 'districtName',
              minWidth:80,
          },
          {
              title: '站点类型',
              key: "siteType",
              minWidth:80,
              render: (h, params) => {
                let str = params.row.siteType==1?"无桩站点":params.row.siteType==2?"综合站点":""
                return h('div',str)
              }
          },
          {
              title: '设备类型',
              key: "type",
              minWidth:80,
              render: (h, params) => {
                let str = this.$status.docksiteType(params.row.type)
                return h('div',str)
              }
          },
          {
              title: '设备号',
              key: "equipmentNo",
              minWidth:80,
          },
          {
              title: '低频号',
              key: "triggerNo",
              minWidth:80,
          },
          // {
          //     title: '车位',
          //     key: "totalPileNum",
          //     minWidth:80,
          //     render: (h, params) => {
          //       let str = params.row.totalPileNum?params.row.totalPileNum:0 + "个"
          //       return h('div',str)
          //     }
          // },
          // {
          //     title: '空闲车位',
          //     key: "freePileNum",
          //     minWidth:90,
          //     render: (h, params) => {
          //       let totalPileNum = params.row.totalPileNum || 0
          //       let totalBikeNum = params.row.totalBikeNum || 0
          //       let str = (totalPileNum-totalBikeNum)+ "个"
          //       return h('div',str)
          //     }
          // },
          {
              title: '总车辆',
              key: "totalBikeNum",
              minWidth:90,
              sortable: true,
              render: (h, params) => {
                let str = params.row.totalBikeNum + "辆"
                return h('div',str)
              }
          },
          {
              title: '公共自行车',
              key: "bikeNum",
              minWidth:100,
              sortable: true,
              render: (h, params) => {
                let str = params.row.bikeNum + "辆"
                return h('div',str)
              }
          },
          {
              title: '共享单车',
              key: "bicycleDocksiteOtherBikeList",
              minWidth:100,
              // render: (h, params) => {
              //   let str = this.$status.OtherBikeList(params.row.bicycleDocksiteOtherBikeList)
              //   return h('div',str)
              // }
              render: (h, params) => {
               let texts = '';
               let str = this.$status.OtherBikeList(params.row.bicycleDocksiteOtherBikeList)
               if (str !== null) {
                     if (str.length > 7) {
                         texts = str.substring(0, 7) + "....";
                      } else {
                         texts = str;
                      }
               }
                return h('p', [
                      h('Tooltip', {props: {placement: 'top',transfer: true}}, [
                           texts,//表格列显示文字
                           h('p', {
                                 slot: 'content',
                                 style: {
                                     whiteSpace: 'normal'
                                  }
                             }, str//整个的信息即气泡内文字)
                             )]
                    )
              ])
           }
          },
          {
              title: '通讯状态',
              key: "occupyPileNum",
              minWidth:80,
              render: (h, params) => {
                let str = this.$status.sitestatus(params.row.controlStatus)
                return h('div',str)
              }
          },
          {
              title: '状态',
              key: "occupyPileNum",
              minWidth:80,
              render: (h, params) => {
                let str = this.$status.docksitestatus(params.row.status)
                return h('div',str)
              }
          },
          // {
          //     title: '地址',
          //     key: "address",
          //     minWidth:150,
          // },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:230,
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
                              marginTop: '5px',
                              display:_this.$hasPerm("/bicycledocksite/update")?"":"none"
                          },
                          on: {
                              click: () => {
                                _this.$router.push({
                                  path:"/admin/device/dockSite/dockSiteEdit",
                                  query:{
                                    dockID:params.row.id
                                  }
                                })
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
                              marginTop: '5px',
                          },
                          on: {
                              click: () => {
                                _this.$router.push({
                                  path:"/admin/device/dockSite/dockSiteView",
                                  query:{
                                    dockID:params.row.id
                                  }
                                })
                              }
                          }
                      }, '详情'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/bicycledocksite/delete')?params.row.status==1?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.$webapi.getMessinfo({
                                  title:"确定站点【"+params.row.docksiteName+"】要关闭吗",
                                  yes () {
                                      _this.deletepost(params.row)
                                  }
                                })
                              }
                          }
                      }, '关闭'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/bicycledocksite/activate')?params.row.status==-1?"":"none":"none"
                          },
                          on: {
                              click: () => {
                                this.$webapi.getMessinfo({
                                  title:"确定站点【"+params.row.docksiteName+"】要开启吗",
                                  yes () {
                                      _this.activate(params.row)
                                  }
                                })
                              }
                          }
                      }, '开启'),
                      // h('Button', {
                      //     props: {
                      //         type: 'primary',
                      //         size: 'default'
                      //     },
                      //     style: {
                      //         marginRight: '5px',
                      //         marginTop: '5px',
                      //         display:_this.$hasPerm('/bicycle/put_in')?"":"none"
                      //     },
                      //     on: {
                      //         click: () => {
                      //           _this.selectItem = params.row
                      //           _this.bycleshow = true
                      //         }
                      //     }
                      // }, '投放车辆'),
                  ]);
              }
          }
      ]
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
    let _this =this
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/device/dockSite/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    tabshow (e) {
      return this.$webapi.GETTABSIZE(this.formCustom.IShow,e)
    },
    tabopen () {
      this.formCustom.IShow = this.formCustom.IShow==0?1:0
    },
    districtEmitComponent (e) {
      this.formCustom.districtNo = e.districtNo
      this.formCustom.fenceId = e.id
    },
    activate (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            id:""+e.id,
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/bicycledocksite/activate',listdata,reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    deletepost (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            id:""+e.id,
            token:this.$webapi.get("token")
          })
      }
      this.$api.post('/bicycledocksite/delete',listdata,reset => {
        if (reset.codeId == 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    CARSITEMAP () {
      this.$router.push({
        path:"/admin/device/dockSite/dockSitecar"
      })
    },
    sitedelete (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            token:this.$webapi.get("token"),
            id:""+e.id
          })
      }
      this.$api.post('/bicycledocksite/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    opendelete (e) {
      let _this = this;
      let listdata = {
          data:JSON.stringify({
            token:this.$webapi.get("token"),
            id:""+e.id
          })
      }
      this.$api.post('/bicycledocksite/activate',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    DNOWSANFANGCAR () {
      if(this.newdata.length<1){
        this.$Message.error("站点没有选择")
        return
      }
      this.selectItem = this.newdata[0]
      this.sanfangcarshow = true
    },
    SANFANGCAR () {
      if(this.newdata.length<1){
        this.$Message.error("站点没有选择")
        return
      }
      this.selectItem = this.newdata[0]
      this.sanfangshow = true
    },
    bikeSitecomponent (e) {
      this.sanfangshow = false
      this.sanfangcarshow = false
      this.list()
    },
    SITEDNOWCAR () {
      if(this.newdata.length<1){
        this.$Message.error("站点没有选择")
        return
      }
      this.selectItem = this.newdata[0]
      this.sitebikeshow = true
    },
    EMITXINXICOMPONENT () {
      this.xinxishow = false
    },
    GETBIAOQIAN () {
      //获取标签
      if(this.newdata.length<1){
        this.$Message.error("站点没有选择")
        return
      }
      if(this.newdata[0].type==1){
        this.$Message.error("获取标签数量只能在二代站点上")
        return
      }
      this.selectItem = this.newdata[0]
      this.biaoqianshow = true
    },
    XINXI () {
      //获取信息强度
      if(this.newdata.length<1){
        this.$Message.error("站点没有选择")
        return
      }
      this.selectItem = this.newdata[0]
      this.xinxishow = true
    },
    EmitDocksiteComponent (e) {
      // this.formCustom.dockSiteNo = e.docksiteNo
      this.formCustom.dockSiteName = e.docksiteName
      this.formCustom.docksiteno = e.docksiteNo
    },
    EMITBIAOQIAN () {
      this.biaoqianshow = false
      this.sitebikeshow = false
      this.sanfangcarshow = false
      this.carmapshow = false
    },
    addcarcomponent (e) {
      if(e.length<1){
        this.bycleshow = false
        return
      }
      let reset = []
      e.forEach((a)=>{
        reset.push({
          id:a.id
        })
      })
      let _this = this;
      let listdata = {
        token:this.$webapi.get("token"),
        docksiteId:parseInt(this.selectItem.id),
        data:JSON.stringify(reset)
      }
      this.$api.post('/bicycle/put_in',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
          _this.bycleshow = false
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    handleSubmit() {
      this.pageData.pageCurrent=1
      this.list()
    },
    emitcomponent () {
      this.exportshow = false
    },
    bikeDockSitecomponent (e) {
      this.setingshow = false
      if(e){
        this.list()
      }
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      let pagedata={
        pageCurrent:this.pageData.pageCurrent,
        pagesize:this.pageData.pagesize
      }
      window.sessionStorage.setItem("pagedata", JSON.stringify(pagedata) )
      this.list();
    },
    dearleSelect (option) {
      this.formCustom.fenceName=option||'';
    },
    add(){
      this.$router.push({path:"/admin/device/dockSite/add"})
   },
  exportfile () {
    this.exportshow = true
  },
  delpost(e){
      let _this = this;
      let listdata = {
            data:JSON.stringify({
              token:this.$webapi.get("token"),
              id:e.id
         })
      }
      this.$api.post('/docksite/delete',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    opensite (e) {
      let _this = this;
      let listdata = {
            data:JSON.stringify({
              token:this.$webapi.get("token"),
              equipmentNo:e.equipmentNo
         })
      }
      this.$api.post('/site/order/reboot',listdata,reset => {
        if (reset.codeId === 1) {
          _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      this.data = []
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize,
           status:this.formCustom.status,
           equipmentNo:this.formCustom.equipmentNo,
           dockSiteNo:this.formCustom.dockSiteNo,
           docksiteName:this.formCustom.dockSiteName,
           districtNo:this.formCustom.districtNo,
         })
      }
      let _this =  this
      this.$api.get('/bicycledocksite/list',listdata,reset => {
        if (reset.codeId === 1) {
          reset.resData.list.forEach((a)=>{
            a.checkBox = false
          })
           _this.data = reset.resData.list
           _this.loading = false
           if(reset.resData){
             _this.pageData.totalCount=reset.resData.totalCount;
             _this.pageData.pageCurrent=reset.resData.pageNo;
             _this.pageData.pagesize=reset.resData.pageSize;
           }
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
