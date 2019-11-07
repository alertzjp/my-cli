<template>
  <div class="page-component-view">
   <div class="page-component-bd" v-if="show">
      <Row>
        <Col :xs="24" :sm="24" :md="12" :lg="12">
           <div style="height: 500px;widht:100%" :id="'chart'"> </div>
        </Col>
        <Col :xs="24" :sm="24" :md="12" :lg="12" v-for="(item,index) in fenceList">
           <div style="height: 500px;widht:100%" :id="'chart'+index"> </div>
        </Col>
      </Row>
   </div>
 </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      show:true,
      formCustom:{},
      fenceList:[],
      stats:[{name:'待租',status:12},{name:'租用中',status:20},{name:'临时停车',status:21},{name:'待维修',status:30},{name:'维修中',status:41},{name:'维修完成',status:42},{name:'报废',status:49}]
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    list() {
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token")
      }
      this.$api.get('/bike/statistics',listdata,reset => {
        if (reset.codeId == 1) {
          _this.formCustom = reset.resData
          _this.fenceList = reset.resData.fenceList
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
            amy:[]
          }
            _this.stats.forEach(function (totallist) {
                let idx = 0
                _this.formCustom.bikeStatusSum.forEach(function (list) {
                    if(totallist.status == list.BikeStatus){
                        data.amy.push(list.sumCount);
                        idx = 1
                    }
                })
                if(idx == 0){
                    data.amy.push(0);
                }
            })

            // 绘制图表
           let option =  {
                title: {
                    text: '总助力车数量：'+this.formCustom.sumTotal,
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
                        data : this.stats.map((a)=>{
                          return name = a.name
                        }),
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
            };
          let myChart = this.$echarts.init(document.getElementById('chart'));
              myChart.setOption(option)
    },
    echarts () {
      let _this = this;
      this.fenceList.forEach((a,index)=>{
        let data = {
                time:[],
                amy:[],
              }
            _this.stats.forEach(function (totallist) {
                let idx = 0
                a.detailsList.forEach(function (list) {
                    if(totallist.status == list.status){                       
                        data.amy.push(list.sumCount);
                        idx = 1
                    }
                })
                if(idx == 0){
                    data.amy.push(0);
              }
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
                        data : this.stats.map((a)=>{
                          return name = a.name
                        }),
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
          let myChart = this.$echarts.init(document.getElementById('chart'+index));
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
