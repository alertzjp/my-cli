<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="二维码编号">
                           <Input type="text" v-model="formCustom.bikeNo"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车载终端号">
                           <Input type="text" v-model="formCustom.terminalNo"></Input>
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
       <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="24">
              <div class="">
                   <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                   <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
              </div>
          </Col>
       </Row>
     </div>
     </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      scrapviewshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      formCustom:{
        fenceId:'',
        dockSiteNo:'',
        chargePileNo:'',
        bikeNo:'',
        terminalNo:'',
        minInterval:'',
        maxInterval:'',
        bikeStatus:'',
        status:'5',
        bikeModel:""
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
                               this.setectitem = this.data[params.index]
                           }
                       }
                   })
               ])
           }
          },
          {
              title: '电子围栏名称',
              key: 'fenceName',
              minWidth:150,
          },
          {
              title: '车辆型号',
              minWidth:200,
              key: 'bikeModel',
          },
          {
              title: '二维码编号',
              minWidth:150,
              key: 'frameNo',
          },
          {
              title: '车载终端编号',
              minWidth:150,
              key: 'terminalNo',
          },
          {
              title: '车辆状态',
              minWidth:150,
              key: 'bikeStatus',
          },
          {
              title: '投入使用时间',
              key: 'updatedAt',
              minWidth:150,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.firstUseTime)/1000)
                return h('div', [
                    h('span', str)
              ])
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
    lock () {
      if(this.ifshow()){
        this.lockshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    warning () {
      if(this.ifshow()){
        this.warningshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    forcepower () {
      if(this.ifshow()){
        this.forcepowershow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    forcepoweron () {
      if(this.ifshow()){
        this.forcepoweronshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    upgradeapp () {
      if(this.ifshow()){
        this.upgradeappshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    loguploadset () {
      if(this.ifshow()){
        this.loguploadsetshow = true
      }else{
        this.$Message.error("先选择一项")
      }
    },
    ifshow () {
       return this.setectitem.id?true:false
    },
    lockemitcomponent (e) {
      this.lockshow = false
      this.warningshow = false
      this.forcepowershow = false
      this.forcepoweronshow = false
      this.upgradeappshow = false
      this.loguploadsetshow = false
      this.scrapshow = false
      this.scrapviewshow = false
    },
    fenceEmitComponent (e) {
      this.formCustom.fenceId = e.id
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
    baofeicomponent () {
      this.baofeishow = false
    },
    list () {
      this.loading = true
      let listdata = {
        data:{
          bikeModel:this.formCustom.bikeModel,
          status:this.formCustom.status,
          bikeNo:this.formCustom.bikeNo,
          terminalNo:this.formCustom.terminalNo,
          fenceId:this.formCustom.fenceId,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          token:this.$webapi.get('token'),
        }
      }
      let _this =  this
      this.$api.get('/bike/list',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData.list
              data.forEach((items)=>{
                items.checkBox = false
              })
           _this.data = data
           _this.pageData.totalCount = reset.resData.totalCount
           _this.pageshow = true
           _this.loading = false
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
