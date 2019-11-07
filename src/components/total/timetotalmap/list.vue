 <template>
   <div class="page-component-view">
    <div class="page-component-bd">
      <!--查询条件-->
      <div class="tableListForm">
        <Form ref="formCustom" :model="formCustom" :label-width="90">
            <Row>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="站点">
                      <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :docksiteNo="formCustom.dockSiteNo"></docksite-component>
                   </FormItem>
                </Col>
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                   <FormItem label="统计时间">
                     <time-component @timeEmit="timeEmit" type="date" :timevale="1" :timeprop="formCustom.startTime"></time-component>
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
      <Row>
          <Col :xs="24" :sm="24" :md="12" :lg="12">
              <div class="h500 itemlist" id="J_componentonline" >

              </div>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :lg="12">
            <div class="h500 itemlist" id="J_componentlineall">

            </div>
          </Col>
     </Row>
     <Row>
         <Col :xs="24" :sm="24" :md="12" :lg="12">
            <div class="m10">
              <table-component :loading="loading" :columnsdata="columns" :datas="datas"></table-component>
            </div>
         </Col>
         <Col :xs="24" :sm="24" :md="12" :lg="12">
          <div class="m10">
              <table-component :loading="loading" :columnsdata="columnes" :datas="dataes"></table-component>
          </div>
        </Col>
    </Row>
    </div>
  </div>
 </template>
 <script>
 import timeComponent from "../../pub/timeonecomponent.vue"
 import tableComponent from '../../pub/tablecommon.vue'
 import docksiteComponent from "../../pub/bicycledocksite.vue"
 export default {
   name: "",
   components: {
     timeComponent,
     tableComponent,
     docksiteComponent
   },
   data () {
     return {
      formCustom:{
        startTime:"",
        dockSiteNo:""
      },
      loading:false,
      data:[],
      dataes:[],
      columnes: [
          {
              title: '站点名称',
              key: 'bicycleDocksiteName',
              minWidth:150,
          },
          {
              title: '借出次数',
              key: 'rentSum',
              minWidth:150,
          },
          {
              title: '占比',
              key: 'timeCharge',
              minWidth:150,
              render:(h,params)=>{
                let str = ""+params.row.rentSum==0?0:((((params.row.rentSum/params.row.rentSums).toFixed(4))*100).toFixed(2))+"%"
                return h('div',str)
              }
          },
      ],
      datas:[],
      columns: [
          {
              title: '站点名称',
              key: 'bicycleDocksiteName',
              minWidth:150,
          },
          {
              title: '借出次数',
              key: 'rentSum',
              minWidth:150,
          },
          {
              title: '占比',
              key: 'timeCharge',
              minWidth:150,
              render:(h,params)=>{
                let str = ""+params.row.rentSum==0?0:((((params.row.rentSum/params.row.rentSums).toFixed(4))*100).toFixed(2))+"%"
                return h('div',str)
              }
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
     let searchList=JSON.parse(this.$webapi.get('searchList'))
     let flag=0;
     if(searchList){
       searchList.map(vla=>{
         if(vla.path==this.$route.path){
           this.formCustom=vla.searchobj;           
           flag=1
         }
       })
     }
     if(flag==0){
       let time = (new Date().getTime()-86400000)/1000
       this.formCustom.startTime = this.$webapi.gettime("date",time)
     }

     if(this.formCustom.dockSiteNo!==""){
       this.docksite()
     }else {
       this.list()
     }
     this.total()
     let _this = this;
     this.$vm.$on("callbackEnter",(e)=>{
       if(_this.$route.path == "/admin/total/timemap"){
         _this.handleSubmit()
       }
     })
   },
   methods: {
     timeEmit (e) {
       this.formCustom.startTime = e
     },
     handleSubmit () {
       if(this.formCustom.dockSiteNo!==""){
         this.docksite()
       }else {
         this.list()
       }
       this.total()
     },
     total () {
       this.daysort()
       this.daysort01()
     },
     EmitDocksiteComponent (e) {
       this.formCustom.dockSiteNo = e.docksiteNo
     },
     daysort () {
       let listdata = {
         token:this.$webapi.get('token'),
         startTime:this.formCustom.startTime,
         pageNo:"1",
         pageSize:"25",
         flag:2
      }
       let _this =  this
       this.loading = true
       this.$api.get('/statistic/docksite_day_sort',listdata,reset => {
         _this.loading = false
         if (reset.codeId === 1) {
           _this.datas = reset.resData.list
         }
         else {
           _this.$netcode.getApiCode(reset)
        }
       })
     },
     daysort01 () {
       let listdata = {
         token:this.$webapi.get('token'),
         startTime:this.formCustom.startTime,
         pageNo:"1",
         pageSize:"25",
         flag:1
      }
       let _this =  this
       this.loading = true
       this.$api.get('/statistic/docksite_day_sort',listdata,reset => {
         _this.loading = false
         if (reset.codeId === 1) {
           _this.dataes = reset.resData.list
         }
         else {
           _this.$netcode.getApiCode(reset)
        }
       })
     },
     docksite () {
         let listdata = {
           token:this.$webapi.get('token'),
           startTime:this.formCustom.startTime + " 00:00:00",
           endTime:this.formCustom.startTime+" 23:59:59",
           dockSiteNo:this.formCustom.dockSiteNo,
           pageNo:"1",
           pageSize:"25"
        }
         let _this =  this
         this.$api.get('/statistic/docksite_hour',listdata,reset => {
           if (reset.codeId === 1) {
              _this.data = reset.resData.list
              _this.listview()
              _this.listview01()
           }
           else {
             _this.$netcode.getApiCode(reset)
          }
         })
     },
     list() {
       let listdata = {
         token:this.$webapi.get('token'),
         startTime:this.formCustom.startTime + " 00:00:00",
         endTime:this.formCustom.startTime+" 23:59:59",
         pageNo:"1",
         pageSize:"25"
      }
       let _this =  this
       this.$api.get('/statistic/operator_hour',listdata,reset => {
         if (reset.codeId === 1) {
            _this.data = reset.resData.list
            _this.listview()
            _this.listview01()
         }
         else {
           _this.$netcode.getApiCode(reset)
        }
       })
     },
     listview () {
       let itemdata = {
          hour:[],
          data:[]
       }
       if(this.data.length<1){
         return
       }
       for(let i=0;i<this.data.length;i++){
           let item = this.data[i]
           let str = (item.times).substring(11,16)
           let data = 0
           if(item.rentSum!==null && item.rentSums!==0){
               data = parseInt(item.rentSum)
           }
           itemdata.hour.push(str)
           itemdata.data.push(data)
       }
       let option = {
               title: {
                   text: this.formCustom.startTime+' 借车次数',
                   x:'center'
               },
               tooltip: {
                   trigger: 'axis'
               },
               legend: {
                   data:[]
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: itemdata.hour,
                   splitLine:{
                       lineStyle: {
                           type: 'solid',
                           color:'#f0f0f0',
                           width:'1'
                       }
                   },
                   axisLine: {
                       lineStyle: {
                           type: 'solid',
                           color:'#dedede',
                           width:'1'
                       }
                   },
                   axisLabel: {
                       interval:0,
                       textStyle: {
                           color: '#333'
                       }
                   }
               },
               yAxis: {
                   type: 'value',
                   axisLine: {
                       textStyle: {
                           color: '#666'
                       },
                       show:false
                   },
               },
               series:[{
                   name:'借车次数',
                   type:'line',
                   stack: '占比',
                   data: itemdata.data
               }
               ]
           };
       let Jcomponentonline = this.$echarts.init(document.getElementById('J_componentonline'))
           Jcomponentonline.setOption(option, true);
     },
     listview01 () {
       let itemdata = {
          hour:[],
          data:[]
       }
       if(this.data.length<1){
         return
       }
       for(let i=0;i<this.data.length;i++){
           let item = this.data[i]
           let str = (item.times).substring(11,16)
           if(item.rentSum!==0){
             let data ={
                 value:parseInt(item.rentSum),
                 name:str
               }
              itemdata.hour.push(str)
              itemdata.data.push(data)
          }
       }
       let option = {
                title : {
                    text: this.formCustom.startTime+' 借车占比',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data:itemdata.hour,
                    // selected: data.selected
                },
                series : [
                    {
                        name: '时间段:借车次数(占比)',
                        type: 'pie',
                        radius : '55%',
                        center: ['40%', '50%'],
                        data: itemdata.data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
       let Jcomponentlineall = this.$echarts.init(document.getElementById('J_componentlineall'))
           Jcomponentlineall.setOption(option, true);
     }
   }
 }
 </script>
 <style lang="less" scoped>
  .m10{
    margin: 10px
  }
 .itemlist{
   width: 100%
 }
 .h500{
   height: 500px;
 }
 </style>
