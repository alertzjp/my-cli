<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="70">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="片区">
                    <district-component @districtEmitComponent="districtEmitComponent" :fenceId="formCustom.fenceId"></district-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点编号">
                     <Input type="text" v-model="formCustom.siteNo" placeholder="请输入站点编号"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点名称">
                    <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent" :status="1" :docksiteNo="formCustom.siteNo"></docksite-component>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar60"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <!--操作按钮-->
    <div class="tableListOperator">
     </div>
     <Alert type="warning">
      站点状态：
      <span class="cobaltblue">有车</span>
      <span class="grassgreen">无车</span>
      <span class="cobaltred">报警</span>
         <template slot="desc">
         L:代表站点当前低电量车   B:站点当前车辆数/站点总车位
     </template>
     </Alert>
     <!-- <div v-if="!distshow" class="siteloading">数据过大加载中...</div>  -->
     <div class="demo-spin-container" v-if="!distshow">
        <Spin fix size="large" v-if="!distshow"></Spin>
    </div>
     <div class="" v-if="distshow">
       <span>
         站点总数量:<strong class="pr10 pl10">{{data.length}}</strong>(个)
       </span>
       <span class="siteTotal pl10" v-if="show">
          <!-- <span>站内:{{totalDate.siteInNum}}</span> <span>站外:{{totalDate.siteOutNum}}</span>   -->
          <span>今日借/还次数:{{totalDate.rentNum}}/{{totalDate.returnNum}}</span>
       </span>
     </div>
     <!-- {{distList}} -->
     <div class="sitebox" v-if="distList.length>0" v-for="itemList in distList">
       <div class="site_left">
          <h2 v-if="itemList[0].districtName!=='全部'">
            {{itemList[0].districtName}}({{itemList[0].districtNo}})&nbsp;&nbsp;
            {{itemList[0].maintainerName}}&nbsp;&nbsp;
            {{itemList[0].maintainerMobile}}
            </h2>
          <h2 v-else>未分配片区</h2>
       </div>
       <Divider type="vertical" />
       <div class="site_right">
         <Row>
            <Col :xs="24" :sm="12" :md="6" :lg="4" v-for="item in itemList " style="margin-bottom:5px;" v-if="item.flag">
              <div class="zd_cardbody zd_cardorder grassgreen"  @contextmenu.prevent="contextmenu(item)" style="margin-right:5px;" v-if="item.flag==1":class="{cobaltred:item.status!==3&&item.status!==1}">
                <div class="card_hd">
                  {{item.docksiteName}}【{{item.docksiteNo}}】
                </div>
                <div class="card_bd">
                  <div class="" >
                    <span>B:{{item.bikeNum}}/{{item.totalPileNum}}</span>
                    <span>L:{{item.lowBatteryBicycleNum}} </span>
                    <span>状态:{{item.status_cn}}</span>
                  </div>
                  <div class="menuboxdonw" :class="{none:item.show}">
                    <a href="javascript:void(0)" class="none">站点录入</a>
                    <a href="javascript:void(0)" class="none">站点设备查询</a>
                    <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
                    <!-- <a href="javascript:void(0)" class="" @click="dnowcar(item)">获取车辆统计</a> -->
                    <i @click="closeItem(item)">X</i>
                  </div>
                </div>
              </div>
              <div class="zd_cardbody zd_cardorder cobaltblue" @contextmenu.prevent="contextmenu(item)"  style="margin-right:5px;" v-if="item.flag==2" :class="{cobaltred:item.status!==3&&item.status!==1}">
                <div class="card_hd">
                  {{item.docksiteName}}【{{item.docksiteNo}}】
                </div>
                <div class="card_bd">
                  <div class="" >
                     <span>B:{{item.bikeNum}}/{{item.totalPileNum}} </span>
                     <span>L:{{item.lowBatteryBicycleNum}} </span>
                     <span>状态:{{item.status_cn}}</span>
                  </div>
                  <div class="menuboxdonw" :class="{none:item.show}">
                    <a href="javascript:void(0)" class="none">站点录入</a>
                    <a href="javascript:void(0)" class="none">站点设备查询</a>
                    <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
                    <!-- <a href="javascript:void(0)" class="" @click="dnowcar(item)">获取车辆统计</a> -->
                    <i @click="closeItem(item)">X</i>
                  </div>
                </div>
              </div>
              <div class="zd_cardbody zd_cardorder cobaltred" @contextmenu.prevent="contextmenu(item)" style="margin-right:5px;" v-if="item.flag==3"  :class="{cobaltred:item.status!==3&&item.status!==1}">
                <div class="card_hd">
                  {{item.docksiteName}}【{{item.docksiteNo}}】
                </div>
                <div class="card_bd">
                  <div class="" >
                    <span>B:{{item.bikeNum}}/{{item.totalPileNum}} </span>
                    <span>L:{{item.lowBatteryBicycleNum}} </span>
                    <span>状态:{{item.status_cn}}</span>
                  </div>
                  <div class="menuboxdonw" :class="{none:item.show}">
                    <a href="javascript:void(0)" class="none">站点录入</a>
                    <a href="javascript:void(0)" class="none">站点设备查询</a>
                    <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
                    <!-- <a href="javascript:void(0)" class="" @click="dnowcar(item)">获取车辆统计</a> -->
                    <i @click="closeItem(item)">X</i>
                  </div>
                </div>
              </div>
            </Col>
         </Row>
       </div>
     </div>
   </div>
   <sitecar-component v-if="sitecarshow" :docksiteNo="siteNo" :siteName="siteName"  @emitcardcomponent="emitcardcomponent"></sitecar-component>
   <bysite-component v-if="siteshow" :siteitem="siteitem" @bysiteEmit="bysiteEmit"></bysite-component>
  </div>
</template>
<script>
import docksiteComponent from '../../pub/bicycledocksite.vue'
import districtComponent from '../../pub/districtcommon.vue'
import sitecarComponent from '../../pub/sitecarcomponent.vue'
import bysiteComponent from './/bysite.vue'
import { setTimeout } from 'timers';
export default {
  name: "",
  components:{
    docksiteComponent,
    sitecarComponent,
    districtComponent,
    bysiteComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      distshow:false,
      data:[],
      siteNo:"",
      siteName:"",
      sitecarshow:false,
      distList:[],
      totalDate:{},
      show:false,
      siteshow:false,
      siteitem:{},
      zimu:[],
      formCustom:{
         bikeNo:"",
         enquiriesNo:"",
         siteNo:"",
         siteName:"",
         districtNo:"",
         enteringCompanyId:"",
         fenceId:""
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
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  mounted() {
    let searchList=JSON.parse(this.$webapi.get('searchList'))
    if(searchList){
      searchList.map(vla=>{
        if(vla.path==this.$route.path){
          this.formCustom=vla.searchobj;        
        }
      })
    }
    this.list()
    this.realtime()
    let _this = this;
    this.$vm.$on("callbackEnter",(e)=>{
      if(_this.$route.path == "/admin/monitor/site/list"){
        _this.handleSubmit()
      }
    })
  },
  methods: {
    realtime () {
      let listdata = {
            token:this.$webapi.get('token')
         }
         let _this =  this
        this.$api.get('/site_monitor/real_time_statistic',listdata,reset => {
          if (reset.codeId === 1) {
            _this.totalDate = reset.resData
            _this.show = true
          }
        })
    },
    bysiteEmit () {
      this.siteshow = false
    },
    dnowcar (item){
      this.siteitem = item
      this.siteshow = true
    },
    contextmenu (e) {
      this.distList.forEach((a)=>{
         a.forEach((e)=>{
            e.show = true
         })
       })
       e.show = false
    },
    closeItem (e) {
      e.show = true
    },
    emitcardcomponent () {
      this.sitecarshow = false
    },
    EmitDocksiteComponent (e) {
      this.formCustom.siteName = e.docksiteName
      this.formCustom.siteNo = e.docksiteNo
    },
    handleSubmit () {
      this.list()
    },
    dnow (e) {
      this.siteNo = e.docksiteNo
      this.siteName = e.docksiteName
      this.sitecarshow = true
    },
    districtEmitComponent (e) {
     this.formCustom.districtNo = e.districtNo
     this.formCustom.fenceId = e.id
    },
    ngOnInit(data) {
      let _this = this;
      const sorted = this.groupBy(data, function (item) {
        return [item.districtName];
      });
      let newdist = sorted
      let idx = 0
          sorted.forEach((a,index)=>{
            if(a[0].districtNo==10000){
              idx = index
            }
          })
      setTimeout(()=>{
        let newitem = sorted[idx]
        let newdist = sorted
            newdist.splice(idx,1)
            newdist.push(newitem)           
        _this.getmax(sorted)  
      },1000)
    },
    getmax (sorted) {
      let _this = this
      let data = []
      let newlist = []
      sorted.forEach((item,index)=>{
        newlist.push(item[0].districtNo)
      })
      let newdata = newlist.sort((a,b)=>{return a-b})       
      newdata.forEach((list)=>{
        sorted.forEach((item,index)=>{
           if( parseInt(item[0].districtNo) == parseInt(list)){
              data.push(item)
            }
         })            
       })       
      setTimeout(()=>{
        _this.distList = data
       _this.distshow = true
      },1000)       
    },
    groupBy(array, f) {
      const groups = {};
      array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },
    list () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        siteNo:this.formCustom.siteNo,
        siteName:this.formCustom.siteName,
        districtNo:this.formCustom.districtNo
     }
      let _this =  this
      this.$api.get('/site_monitor/monitor_list',listdata,reset => {
        if (reset.codeId === 1) {
           let data  = []
           let newdata= reset.resData          
           let reg = /^[^a-zA-Z]*$/
            var A_Z=[];
            for(var i=65;i<91;i++){
              A_Z.unshift(String.fromCharCode(i))
            }           
             console.log("新总数："+newdata.length)  
            newdata.forEach((item)=>{
              let str =item.docksiteNo.substring(0,1)                
              if(reg.test(str)){
                if(data.length>0){
                  if(parseInt(data[0].docksiteNo)>parseInt(item.docksiteNo)){
                    data.unshift(item)
                  }else{  
                    data.push(item)
                  }                  
                }else{
                  data.push(item)
                }                
              }  
            })          
            
            setTimeout(()=>{
               A_Z.forEach((b)=>{
                 //let newitem01 = [] 
                 /*******zimu变量新数组******** */               
                 let zimu = []  
                  newdata.forEach((a)=>{ 
                    /***取第一个字母，全局遍历相同为一组 */
                   let str =a.docksiteNo.substring(0,1) 
                    if(((str).toUpperCase()).indexOf(b)>-1){ 
                     if(zimu.length>0){                        
                       let itemNum = a.docksiteNo.substring(1,a.docksiteNo.length)                        
                       let idx = -1
                       zimu.forEach((item,index)=>{                         
                          let newitem = item.docksiteNo.substring(1,item.docksiteNo.length)  
                          /***存在的时候，比大小，小的在前面 */                        
                          if(parseInt(itemNum)>=parseInt(newitem)){                                                       
                              idx = index                              
                          }
                          if(index == zimu.length-1){
                             if(idx==-1){
                                //newitem01.unshift(a.docksiteNo)
                                zimu.unshift(a)
                                data.unshift(a)
                              }else{
                                //newitem01.splice(parseInt(idx)+1,0,a.docksiteNo)
                                zimu.splice(parseInt(idx)+1,0,a)
                                data.splice(parseInt(idx)+1,0,a)
                            } 
                          }
                       })                      
                     }else { 
                       //newitem01.unshift(a.docksiteNo)   
                       zimu.unshift(a)  
                       data.unshift(a)                       
                     }                              
                    }                    
                  })    
                  //console.log(newitem01)       
                  //console.log(zimu)                                              
                })                 
            })    
                
            setTimeout(()=>{
              console.log("新总数："+data.length)
            },500)
             setTimeout(()=>{
               //console.log(data)
                // let distdata = _this.distList
                if(data.length<1){
                  _this.distList = []
                }
                  data.forEach((a)=>{
                    a.show = true
                    a.status_cn = _this.$status.sitestatus(a.status)
                    if(!a.districtName){
                      a.districtName = "全部"
                      a.districtNo = 10000000000000000
                    }
                  })
                  _this.ngOnInit(data)
                  // _this.distList = data
                  _this.data = data               
            },600)           
        }else if(reset.codeId === -9){
           _this.distList = [];
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
 .demo-spin-container{
    display: inline-block;
    width: 100%;
    height: 500px;
    position: relative;
  }
.siteloading{
  text-align: center;
  padding: 50px 0;
  font-size: 14px
}
.siteTotal{
  padding: 0  10px;
  span{
   padding-right: 10px;
  }
}
.card_bd{
  color: #000!important;
  height: 60px;
}
.zd_cardbody{
  position: relative;
}
.menuboxdonw{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  padding: 10px;
  i{
    position: absolute;
    top: -10px;
    right: 0;
    background: #000;
    color: #fff;
    height: 20px;
    line-height: 20px;
    width: 20px;
    border-radius: 10px;
    cursor: pointer;
    text-align:center;
  }
  a{
    display: block;
  }
}
.cobaltred{
  background: #f30!important;
  border: #f30 1px solid!important;
  .card_hd{
      color: #000!important;
      height: 50px;
      overflow: hidden;
  }
}
.grassgreen{
  background: #09f71d;
  border: #09f71d 1px solid;
  .card_hd{
      color: #000!important;
      height: 50px;
      overflow: hidden;
  }
}
.cobaltblue{
  background: #54cbe8;
  border: #54cbe8 1px solid;
  .card_hd{
      color: #000!important;
      height: 50px;
      overflow: hidden;
  }
}
.sitebox{
  float: left;
  width: 100%;
  .site_left{
    float: left;
    width: 100%;
    h2{
      height: 50px;
      line-height: 50px;
      text-align:left;
      border-bottom: #ddd 1px solid;
    }
  }
  .site_right{
    float: left;
    width: 100%;
  }
}
.ative{
  background: #409EFF;
  color: #fff
}
</style>
