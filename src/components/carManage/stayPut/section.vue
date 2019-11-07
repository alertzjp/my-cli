<template>
    <div class="page-component-view">
     <div class="page-component-bd">
       <!--查询条件-->
       <div class="tableListForm">
           <Form ref="formCustom" :model="formCustom" :label-width="100">
               <Row>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="起始二维码编号">
                           <Input type="text" v-model="formCustom.minInterval"></Input>
                       </FormItem>
                   </Col>
                   <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                       <FormItem label="结束二维码编号">
                           <Input type="text" v-model="formCustom.maxInterval"></Input>
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
         <Button type="primary" @click="playcard()">投放车辆</Button>
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
     <addcar-component v-if="addcarshow" @emitsectioncomponent="emitsectioncomponent"></addcar-component>
    </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import Pages from '../../pub/page.vue'
import addcarComponent from './addcar.vue'
export default {
  name: "",
  components:{
    tableComponent,
    Paging:Pages,
    addcarComponent
  },
  data () {
    return {
      loading:false,
      pageshow:false,
      addcarshow:false,
      setectitem:{},
      lockshow:false,
      warningshow:false,
      forcepowershow:false,
      forcepoweronshow:false,
      upgradeappshow:false,
      loguploadsetshow:false,
      scrapshow:false,
      formCustom:{
        bikeNo:'',
        terminalNo:'',
        status:'5',
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns: [
          {
              title: '二维码编号',
              minWidth:150,
              key: 'frameNo',
          },
          {
              title: '终端编号',
              minWidth:150,
              key: 'terminalNo',
          },
          {
              title: '电机编号',
              minWidth:150,
              key: 'motorNo',
          },
          {
              title: '电池编号',
              minWidth:150,
              key: 'batteryNo',
          },
          {
              title: '车辆型号',
              minWidth:200,
              key: 'bikeModel',
          },
          {
              title: '车辆状态',
              minWidth:150,
              key: 'status',
              render: (h, params) => {
                let str = this.$webapi.getbikeStatus(params.row.status)
                return h('div', [
                    h('span', str)
              ])
           }
         },
      ],
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    playcard () {
      this.addcarshow = true
    },
    emitsectioncomponent (e) {
      this.addcarshow = false
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
      this.loading = true
      let listdata = {
        data:{
          status:this.formCustom.status,
          bikeNo:this.formCustom.bikeNo,
          terminalNo:this.formCustom.terminalNo,
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          minInterval:this.formCustom.minInterval,
          maxInterval:this.formCustom.maxInterval,
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
