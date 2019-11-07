<template>
  <div class="page-component-view" v-if="show">
     <div class="page-component-bd">
       <div class="p20">
         <Form :label-width="100">
           <div class="">
             运营操作者:{{data.updatorName}}
           </div>
            <Divider />
           <div class="">
             用户信息
           </div>
            <Divider />
         <Row>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="用户账号:">
               {{data.riderAccount}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="用户姓名:">
               {{data.riderName}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="用户手机号:">
               {{data.phone}}
             </FormItem>
           </Col>
         </Row>
         <div class="">
           维护人员信息
         </div>
           <Divider />
         <Row>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="维护账号:">
               {{data.maintainerAccount}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="维护姓名:">
               {{data.maintainerName}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="维护手机号:">
               {{data.maintainerPhone}}
             </FormItem>
           </Col>
         </Row>
         <div class="">
           监控信息
         </div>
           <Divider />
         <Row>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="车辆二维码:">
               {{data.bikeNo}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="锁状态:">
               {{data.lockStatus==0?"锁车":data.lockStatus==1?"开锁":data.lockStatus==2?"离线":""}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="操作类型:">
              {{data.operateType==1?"手工还车":data.lockStatus==2?"结束计费":""}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="报障时间:">
               {{$webapi.gettime("time",data.b30Time/1000)}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="操作时间:">
               {{$webapi.gettime("time",data.updatedAt/1000)}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="还车站点:">
               {{data.docksiteName}}
             </FormItem>
           </Col>
           <Col :xs="24" :sm="24" :md="12" :lg="8">
             <FormItem label="误差值(m):">
               {{data.distance}}
             </FormItem>
           </Col>
         </Row>
       </Form>
       </div>
     </div>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
        data:{},
        show:false,
        formCustom:{

        }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list() {
      let  _this=this;
      let  listdata={
        id:""+this.$route.query.id,
        token:this.$webapi.get('token'),
      }
      this.$api.get('/fault_monitor/getOne',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData
           _this.show = true
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
