<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>维修记录</span>
       </p>
       <div style="text-align:left;">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="">
                     <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                     <paging :pageData="pageData" @pageComponentDate="pageComponentDate" v-if="pageshow"></paging>
                </div>
            </Col>
         </Row>
       </div>
       <div slot="footer">
       </div>
    </Modal>
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
  props:{
    itemdata:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      warningBikeType:'1',
      warningInfo:"",
      pageshow:false,
      show:true,
      loading:false,
      formCustom:{
        status:"",
        startTime:"",
        endTime:"",
        bike_no:""
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
              key: 'bikeNo',
              minWidth:150,
              fixed:"left",
          },
          {
              title: '车辆型号',
              minWidth:100,
              key: 'bikeModel',
          },
          {
              title: '车辆报障时间',
              minWidth:150,
              key: 'bicycleDocksiteNo',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.beginTime)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '车辆带回时间',
              minWidth:150,
              key: 'bicycleDocksiteName',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.backTime)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '车辆故障类型',
              minWidth:150,
              key: 'bicycleSensorsNo',
          },
          {
              title: '其他问题描述',
              minWidth:150,
              key: 'addedFault',
          },
          {
              title: '其他',
              minWidth:150,
              key: 'other',
          },
          {
              title: '实际维修项目',
              minWidth:150,
              key: 'realMaintain',
          },
          {
              title: '更换配件',
              minWidth:150,
              key: 'replacePart',
          },
          {
              title: '维修完成时间',
              minWidth:150,
              key: 'voltage',
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.overTime)/1000)
                return h('div', [
                   h('span', str)
               ])
            }
          },
          {
              title: '补充描述',
              minWidth:150,
              key: 'other',
          },
          {
              title: '维修人',
              minWidth:150,
              key: 'maintainId',
          },
          {
              title: '填单人',
              minWidth:150,
              key: 'fillId',
          },
          {
              title: '备注',
              minWidth:150,
              key: 'remark',
          }
      ],
    }
  },
  mounted() {
    //do something after mounting vue instance
      this.formCustom.bike_no = this.itemdata.bicycleNo
      // this.formCustom.bike_no = "5721702959"
      this.list()
  },
  methods: {
    pageComponentDate (e) {       
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pageSize = e.pagesize
      this.list()
    },
    list() {
      let _this = this
      let data = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          pageNo:""+this.pageData.pageCurrent,
          pageSize:""+this.pageData.pagesize,
          bike_no:this.formCustom.bike_no,
          status:this.formCustom.status,
          startTime:this.formCustom.startTime,
          endTime:this.formCustom.endTime,
          id:this.formCustom.id
        })
      }
      this.loading = true
      this.$api.get('/repairingBicycle/listByBikeNo',data,reset => {
        _this.loading = false
          if (reset.codeId === 1) {
              _this.data = reset.resData.list
              _this.pageData.totalCount = reset.resData.totalCount
              _this.pageshow = true
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("lockemitcomponent",this.formCustom)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
