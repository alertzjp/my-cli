<template>
  <div class="m20">
    <Row>
      <Col :xs="24" :sm="24" :md="12" :lg="12">
          <div class="echartsbox mr20 p20">
            <div class="" id="circle">

            </div>
          </div>
      </Col>
      <Col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="echartsbox p20">
          <div class="totalshowbox">
            <div class="" id="chemodel" >
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <Row>
      <Col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="echartsbox p20">
          <div class="totalshowbox">
            <div class="" style="height:40px;">
              <Row>
                  <Col>
                    <span class="fl" style="line-height: 30px;padding: 0 10px;font-weight:bold">站点车辆占比图</span>
                    <span class="fl"><dicksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.dockSiteNo"></dicksite-component></span>
                  </Col>
                  <Col></Col>
              </Row>
            </div>
            <div class="" id="chemodel01" v-if="distributiondata.length>0"></div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
let Jpeitotal,carJpeitotal,circleeitotal;
import dicksiteComponent from "../../pub/bicycledocksite.vue"
let colorList = ['#2878ff','#8f50c9','#d73446','#ff850c','#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
export default {
  name: "",
  components: {
    dicksiteComponent,
  },
  data () {
    return {
      data:[],
      totaldata:0,
      distributiondata:[],
      // dockSiteId:"",
      disindex:0,
      formCustom:{
        dockSiteNo:"",
        dockSiteId:""
      },
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
  mounted() {
    //do something after mounting vue instance
    // setTimeout(()=>{
    //   this.list()
    //   this.circle()
    //   this.list01()
    // },100)
    let searchList=JSON.parse(this.$webapi.get('searchList'))
    if(searchList){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;           
        }
      })
      if(this.formCustom.dockSiteId){
        this.distribution()
      }
    }
    this.getlist()
  },
  methods: {
    EmitDocksiteComponent (e) {
      this.disindex = 1
      // this.dockSiteId = e.id
      this.formCustom.dockSiteId=e.id
      if(e.id){
        this.distribution()
      }else{
        this.distributiondata = []
      }
      this.formCustom.dockSiteNo=e.docksiteNo

    },
    distribution () {
      let _this = this;
      let listdata = {
          token:this.$webapi.get("token")
      }
      if(this.formCustom.dockSiteId){
        listdata.dockSiteId = this.formCustom.dockSiteId
      }
      this.$api.get('/statistic/site_bike_distribution',listdata,reset => {
        if (reset.codeId == 1) {
          _this.distributiondata = reset.resData
          setTimeout(()=>{
            this.list01()
          },100)
          window.addEventListener('resize',function () {
              carJpeitotal.resize()
              circleeitotal.resize()
          })
        }
      })
    },
    getlist () {
        let _this = this;
        let listdata = {
            token:this.$webapi.get("token")
        }
        this.$api.get('/statistic/bike_sum_proportion',listdata,reset => {
          if (reset.codeId == 1) {
            _this.data = reset.resData.proportionList
            _this.totaldata = reset.resData.bikeSum
            setTimeout(()=>{
              this.list()
              this.circle()
            },100)
            window.addEventListener('resize',function () {
                carJpeitotal.resize()
                circleeitotal.resize()
            })
          }
        })
    },
    circle () {
     let dataList = [];
     let dataitem = []
          this.data.forEach((a)=>{
            if(a.bikeTypeStr=="公共自行车"){
              dataList.unshift(a.bikeTypeStr)
              dataitem.unshift({
                value:a.bikeNum,
                name:a.bikeTypeStr
              })
            }else {
              dataList.push(a.bikeTypeStr)
              dataitem.push({
                value:a.bikeNum,
                name:a.bikeTypeStr
              })
            }
          })
      let option = {
          title : {
              text: '总车辆('+this.totaldata+")",
              textAlign: 'left'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              x : 'center',
              y : 'bottom',
              icon: "circle",
              data:dataList
          },
          calculable : true,
          series : [
              {   name:"",
                  type:'pie',
                  radius : [30, 110],
                  center : ['50%', '50%'],
                  roseType : 'area',
                  data:dataitem,
                  itemStyle:{
                       normal:{
                          label:{
                             show: true,
                             formatter: '{b}:{c}'
                             },
                             labelLine :{show:true}
                         }
                  }
              }
          ]
      };
        circleeitotal = this.$echarts.init(document.getElementById('circle'))
        circleeitotal.setOption(option, true);
    },
    list() {
      let dataList = [];
      let dataitem = []
           this.data.forEach((a)=>{
             if(a.bikeTypeStr=="公共自行车"){
               dataList.unshift(a.bikeTypeStr)
               dataitem.unshift(a.bikeNum)
             }else {
               dataList.push(a.bikeTypeStr)
               dataitem.push(a.bikeNum)
             }
           })
      let  option = {
          tooltip: {
             trigger: 'item',
             formatter: "{a} <br/>{b} : {c}"
          },
          legend: {
              x : 'center',
              y : 'top',
              icon: "circle",
              data:dataList
          },
          xAxis: [
              {
                  type: 'category',
                  splitLine:{
                    show: true,
                    lineStyle:{
                      type:'solid',
                      color: ['#ddd', '#ddd'],
                      opacity:1
                    }
                  },
                  axisLabel: {
                     interval:0,
                     formatter:function(value){
                        let str = "";
                        let num = dataitem.length>8?2:dataitem.length>5?3:4; //每行显示字数
                        let valLength = value.length; //该项x轴字数
                        let rowNum = Math.ceil(valLength / num); // 行数

                        if(rowNum > 1) {
                            for(let i = 0; i < rowNum; i++) {
                                let temp = "";
                                let start = i * num;
                                let end = start + num;

                                temp = value.substring(start, end) + "\n";
                                str += temp;
                            }
                            return str;
                        } else {
                            return value;
                        }
                    }
                 },
                  axisLine:{
                    lineStyle:{
                      color:'#999'
                    }
                  },
                  data: dataList
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  splitLine:{
                    show: true,
                    lineStyle:{
                      type:'solid',
                      color: ['#ddd', '#ddd'],
                      opacity:1
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color:'#ccc'
                    }
                  },
              }
          ],
          series:{
            name:'',
            type:'bar',
            data:dataitem,
            barWidth : 30,//柱图宽度
            itemStyle: {
              normal: {
                  // 定制显示（按顺序）
                  color: function(params) {
                      let colorList = ['#2878ff','#8f50c9','#d73446','#ff850c','#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                      return colorList[params.dataIndex]
                  }
              },
          },
        }
      };
        carJpeitotal = this.$echarts.init(document.getElementById('chemodel'))
        carJpeitotal.setOption(option, true);
    },
    list01() {
      let dataList = [];
      let dataitem = []
         this.distributiondata.forEach((a)=>{
           if(a.bikeTypeStr=="湖州公共自行车"){
             dataList.unshift(a.enteringCompanyName)
             dataitem.unshift(a.bikeNum)
           }else {
             dataList.push(a.enteringCompanyName)
             dataitem.push(a.bikeNum)
           }
         })
      let option = {
          tooltip: {
             trigger: 'item',
             formatter: "{a} <br/>{b} : {c}"
          },
          legend: {
              x : 'center',
              y : 'top',
              icon: "circle",
              data:dataList
          },

          xAxis: [
              {
                  type: 'category',
                  splitLine:{
                    show: true,
                    lineStyle:{
                      type:'solid',
                      color: ['#ddd', '#ddd'],
                      opacity:1
                    }
                  },
                  axisLabel: {
                     interval:0,
                     formatter:function(value){
                        let str = "";
                        let num = dataitem.length>8?3:4; //每行显示字数
                        let valLength = value.length; //该项x轴字数
                        let rowNum = Math.ceil(valLength / num); // 行数

                        if(rowNum > 1) {
                            for(let i = 0; i < rowNum; i++) {
                                let temp = "";
                                let start = i * num;
                                let end = start + num;

                                temp = value.substring(start, end) + "\n";
                                str += temp;
                            }
                            return str;
                        } else {
                            return value;
                        }
                    }
                 },
                  axisLine:{
                    lineStyle:{
                      color:'#999'
                    }
                  },
                  data: dataList
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  splitLine:{
                    show: true,
                    lineStyle:{
                      type:'solid',
                      color: ['#ddd', '#ddd'],
                      opacity:1
                    }
                  },
                  axisLine:{
                    lineStyle:{
                      color:'#ccc'
                    }
                  },
              }
          ],
          series:{
            name:'',
            type:'bar',
            data:dataitem,
            barWidth : 30,//柱图宽度
            itemStyle: {
              normal: {
                  // 定制显示（按顺序）
                  color: function(params) {
                      let colorList = ['#2878ff','#8f50c9','#d73446','#ff850c','#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                      return colorList[params.dataIndex]
                  }
              },
          },
        }
      };
        Jpeitotal = this.$echarts.init(document.getElementById('chemodel01'))
        Jpeitotal.setOption(option, true);
    }
  }
}
</script>
<style lang="less" scoped>
  .echartsbox{
    height: 500px;
    background: #fff;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    flex:1;
  }
  .totalshowbox{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  #chemodel,#circle,#chemodel01{
    flex: 1
  }
  .totalFlex{
    flex: 1;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    text-align:center;

  }
</style>
