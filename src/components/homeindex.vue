<template>
  <div class="m20" v-if="show">
      <Row>
          <Col :xs="24" :sm="24" :md="24" :lg="8">
            <Card style="">
                 <p slot="title">
                     逾期急修车辆监控
                 </p>
                 <a href="#" slot="extra" @click.prevent="changeLimit">
                     进入急修车辆
                 </a>
                 <div class="" style="text-align:center">
                   <i-circle :percent="100" stroke-color="#ff5500">
                       <span class="demo-Circle-inner" style="font-size:24px;color:#f30">{{data.urgencySum}}</span>
                   </i-circle>
                 </div>
             </Card>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="8">

          </Col>
     </Row>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      show:false,
      data:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list () {
      let data = {
        token:this.$webapi.get('token')
      }
      let _this = this
      this.$api.get('/bicycle_monitor/overdue_urgentRepair',data,reset=>{
        if (reset.codeId === 1) {
            _this.data = reset.resData
            _this.show = true
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    changeLimit() {
      this.$router.push({
        path:"/admin/customerManage/urgencybike/list"
      })
    }
  }
}
</script>
<style lang="less" scoped>
.m20{
  margin: 20px;
}
</style>
