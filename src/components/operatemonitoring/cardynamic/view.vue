<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <div class="pagelist">
       <div class="pagelist-hd"></div>
       <div class="pagelist-bd">
         <Form ref="formCustom"  :label-width="180">
         <Row>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="终端号：">{{items.terminalNo}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="二维码编号：">{{items.bikeNo}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="采样时间：">{{items.sampleTime | formatDate('time')}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前总电压：">{{items.bmsBatteryVol}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前电流：">{{items.bmsCurrent}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前SOC（百分比)：">{{items.bmsSoc}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最高温度：">{{items.bmsHighTemp}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最低温度：">{{items.bmsLowTemp}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前平均温度：">{{items.bmsAvgTemp}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最高单体电压：">{{items.bmsHighMonoVol}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最高单体序号：">{{items.bmsHighMonoIndex}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最低单体电压：">{{items.bmsBatteryVol}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最低单体序号：">{{items.bmsLowMonoIndex}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前平均单体电压：">{{items.bmsAvgMonoVol}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前电池容量：">{{items.bmsCapacity}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电池的健康度（百分比）：">{{items.bmsHealth}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电池单体数：">{{items.bmsMonoNum}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前最大压差：">{{items.bmsHighVolDiff}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="当前未充电时间（小时）：">{{items.bmsUnchargeHours}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="历史最长未充电时间（小时）：">{{items.bmsMaxUnchargeHours}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电池组容量：">{{items.bmsFullCapacity}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="充电桩序号：">{{items.cdzNo}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="充电桩状态：">
                  <div v-if="items.cdzState==0x10">锁定未充电</div>
                  <div v-if="items.cdzState==0x20">锁定充电中</div>
                  <div v-if="items.cdzState==0x30">锁定放电中</div>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="车锁状态：">
                   <div v-if="items.bikeLockState==0x10">锁定</div>
                   <div v-if="items.bikeLockState==0x10">开启</div>
                 </FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="档位：">{{items.mcGear}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="实时电流：">{{items.mcElectricCurrent}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电机转速，单位：转/分：">{{items.mcMotorSpeed}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="车速 单位：Km/H：">{{items.mcBikeSpeed}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="续航公里数，单位：Km：">{{items.mcRangeKm}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电机控制器是否工作：">{{items.mcIsWorking}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="电机控制器故障代码：">{{items.mcFaultCode}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="脚踏频率 单位rpm：">{{items.mcPedalFreq}}</FormItem>
             </Col>
             <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="力矩传感器信号 电压单位mV：">{{items.mcTorqueVol}}</FormItem>
             </Col>
         </Row>
         </Form>
       </div>
     </div>
  </div>
 </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      show:false,
      items:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list() {
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get("token"),
          id:""+this.$route.query.id
        })
      }
      let _this = this;
      this.$api.get('/dynamicinfo/detail',listdata,reset => {
        if (reset.codeId === 1) {
          _this.items = reset.resData
          _this.show = true
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
