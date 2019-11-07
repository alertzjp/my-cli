<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="80">
               <Row>
                  <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="车辆二维码">
                           <Input type="text" v-model="formCustom.bicycle_no" placeholder="请输入车辆二维码"></Input>
                       </FormItem>
                   </Col>
                   <!-- <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                        <FormItem label="车锁编号">
                            <Input type="text" v-model="formCustom.lockNo" placeholder="请输入车锁编号"></Input>
                        </FormItem>
                    </Col>
                    <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="电子标签">
                           <Input type="text" v-model="formCustom.bicycleSensorsNo" placeholder="请输入电子标签"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                        <FormItem label="车架号">
                            <Input type="text" v-model="formCustom.enquiriesNo" placeholder="请输入车架号"></Input>
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

    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      formCustom:{
        bicycle_no:'',
        terminalNo:'',
        lockNo:"",
        enquiriesNo:"",
        bicycleSensorsNo:"",
        status:'3',
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
            title: '车辆二维码',
            key: 'bicycleNo',
            minWidth:100,
        },
        {
            title: '车锁编号',
            minWidth:100,
            key: 'lockNo',
        },
        {
            title: '电子标签',
            minWidth:100,
            key: 'bicycleSensorsNo',
        },
        {
            title: '车架号',
            minWidth:100,
            key: 'enquiriesNo',
        },
        {
            title: '电量',
            minWidth:80,
            key: 'voltage',
        },
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
    //do something after mounting vue instance
    let _this = this;
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
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/carManage/stayPut"){
        _this.handleSubmit()
      }
    })
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
    list () {
      this.formCustom.pageCurrent = this.pageData.pageCurrent
      this.formCustom.pagesize = this.pageData.pagesize
      this.loading = true
      let listdata = {
        data:{
          // status:this.formCustom.status,
          bicycle_status:'0',
          bicycle_no:this.formCustom.bicycle_no,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          lockNo:this.formCustom.lockNo,
          enquiriesNo:this.formCustom.enquiriesNo,
          bicycleSensorsNo:this.formCustom.bicycleSensorsNo,
          token:this.$webapi.get('token'),
        }
      }
      let _this =  this
      this.$api.get('/bicycle/stayPutList',listdata,reset => {
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
