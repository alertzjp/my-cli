<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="时间">
                     <timeymd-component @timeymd="timeymd" ></timeymd-component>
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
      <Row v-if="show">
        <Col :xs="24" :sm="24" :md="24" :lg="24">
           <div style="height: 500px;widht:100%" id="achart"> </div>
        </Col>
        <Col :xs="24" :sm="24" :md="12" :lg="12" v-for="(item,index) in fenceList">
           <div style="height: 500px;widht:100%" :id="'chart'+index"> </div>
        </Col>
      </Row>
   </div>
 </div>
</template>
<script>
import timeymdComponent from "../../pub/timeymdComponent.vue"
export default {
  name: "",
  components: {
    timeymdComponent
  },
  data () {
    return {
      show:true,
      formCustom:{},
      startTime:"",
      endTime:"",
      operatorRent:[],
      fenceList:[],
      stats:[{name:'空闲',status:1},{name:'占用',status:2},{name:'未投放',status:3},{name:'故障',status:10},{name:'维修中',status:11},{name:'已报废',status:12}]
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    handleSubmit () {
      this.list()
    },
    timeymd (e) {
      this.startTime = e.startTime
      this.endTime = e.endTime
    },
    list() {
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token"),
          startTime:this.startTime,
          endTime:this.endTime,
      }
      this.$api.get('/rent/statistics',listdata,reset => {
        if (reset.codeId == 1) {
          _this.formCustom = reset.resData
          _this.fenceList = reset.resData.fenceDetails
          _this.operatorRent = reset.resData.operatorRent
          _this.show = true
          setTimeout(function () {
            _this.allecharts()
            _this.echarts()
          },1000)
        }
      })
    },
    allecharts () {
      let _this = this;
      let data = {
           time:[],
            amy:[]
       }
       _this.operatorRent.forEach(function (list) {
           data.time.push(list.Name)
           data.amy.push(list.amount)
       })
       let option = {
               title: {
                   text: '总消费：'+_this.formCustom.sumTotal,
                   subtext: ''
               },
               color: ['#3398DB'],
               tooltip : {
                   trigger: 'axis',
                   axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                       type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                   }
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               xAxis : [
                   {
                       type : 'category',
                       data : data.time,
                       axisTick: {
                           alignWithLabel: true
                       }
                   }
               ],
               yAxis : [
                   {
                       type : 'value',
                       axisLine:{
                           show:false
                       }
                   }
               ],
               series : [
                   {
                       name:'直接访问',
                       type:'bar',
                       barWidth: '60%',
                       data:data.amy
                   }
               ]
           }
      let myChart = this.$echarts.init(document.getElementById('achart'));
          myChart.setOption(option)
    },
    echarts () {
      let _this = this;
      this.fenceList.forEach((a,index)=>{
        let data = {
                time:[],
                amy:[],
              }
            a.fenceDetails.forEach((item)=>{
                data.time.push(item.createDates)
                data.amy.push(item.amount)
            })
        let option = {
                title: {
                    text: a.name,
                    subtext: ''
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data :data.time,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine:{
                            show:false
                        }
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:data.amy
                    }
                ]
              }
          let myChart = _this.$echarts.init(document.getElementById('chart'+index));
              myChart.setOption(option)
      })
    }
  }
}
</script>
<style lang="less" scoped>
#chart_example{
    width: 50%;
    height: 500px;
    border: 1px solid red;
    margin: 0 auto;
  }
</style>
