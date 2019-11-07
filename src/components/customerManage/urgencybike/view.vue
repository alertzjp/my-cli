<template>
  <div class="page-component-view">
   <div class="page-component-bd" v-if="viewshow">
     <div class="pagelist">
          <div class="pagelist-hd">调整详情</div>
          <div class="pagelist-bd">
            <Form  :label-width="80">
               <Row>
                 <Col :xs="24" :sm="24" :md="12" :lg="8">
                   <FormItem label="原始金额" >
                       {{formCustom.rentCharge}}
                   </FormItem>
                 </Col>
                 <Col :xs="24" :sm="24" :md="12" :lg="8">
                   <FormItem label="调整金额" >
                       {{formCustom.restitutionCharge}}
                   </FormItem>
                 </Col>
                <Col :xs="24" :sm="24" :md="12" :lg="8">
                  <FormItem label="原因" >
                      {{formCustom.cause}}
                  </FormItem>
                </Col>
                <Col :xs="24" :sm="24" :md="12" :lg="8">
                  <FormItem label="创建时间" >
                      {{formCustom.createdTime/1000 | formatDate('time')}}
                  </FormItem>
                </Col>
                </Row>
             </Form>
          </div>
          <div class="page-divider page-divider-horizontal "></div>
      </div>
  </div>
</div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
export default {
  name: "",
  components: {
    tableComponent
  },
  data () {
    return {
      viewshow:false,
      loading:true,
      formCustom:{},
      data:[],
      columns: [
          {
              title: '配件名称',
              key: 'partTypeName',
              minWidth:150,
              fixed:"left"
          },
          {
              title: '车辆型号',
              key: 'flag',
              minWidth:180,
              render: (h, params) => {
                let str = params.row.bikeModel
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '单位',
              key: 'unit',
              minWidth:150,
          },
          {
              title: '数量',
              key: 'amount',
              minWidth:150,
          },
          {
              title: '损耗',
              key: 'wastage',
              minWidth:150,
          },
          {
              title: '需要相关数量',
              key: 'addamout',
              minWidth:150,
          },
          {
              title: '出库总数量',
              key: 'sumAmount',
              minWidth:150,
          }
      ]
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list () {
      let listdata = {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            id:""+this.$route.query.id
          })
      }
      let _this =  this
      this.$api.get('/customerBicycle/findEstitution',listdata,reset => {
        if (reset.codeId === 1) {
          _this.formCustom  =  reset.resData
          _this.viewshow = true
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
