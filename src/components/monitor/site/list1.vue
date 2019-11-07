<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="站点">
                    <docksite-component @EmitDocksiteComponent="EmitDocksiteComponent"></docksite-component>
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
     <!--操作按钮-->
    <div class="tableListOperator">
     </div>
     <Alert type="warning">
      站点状态：<span class="cobaltblue">无车</span> <span class="grassgreen">有车</span>  <span class="cobaltred">报警</span>
         <template slot="desc">
         L:代表站点当前低电量车   B:站点当前车辆数/站点总车位
     </template>
     </Alert>
     <div class="sitebox">
       <div class="">
         <div class=""  v-for="itemList in distList">
           <div class="">
               {{itemList[0].docksiteName}}【{{itemList[0].docksiteNo}}】
           </div>
           <div class="">
             <Row>
                <Col :xs="24" :sm="12" :md="6" :lg="6" v-for="item in itemList" style="margin-bottom:5px;" v-if="item.flag">
                  <div class="zd_cardbody zd_cardorder grassgreen"  @contextmenu.prevent="contextmenu(item)" style="margin-right:5px;" v-if="item.flag==1":class="{cobaltred:item.status!==3&&item.status!==1}">
                    <div class="card_hd">
                      {{item.docksiteName}}【{{item.docksiteNo}}】
                    </div>
                    <div class="card_bd">
                      <div class="" >
                        <span>B:{{item.bikeNum}}/{{item.totalPileNum}} </span>
                        <span>L:{{item.lowBatteryBicycleNum}} </span>
                        <span>状态:断开连接</span>
                      </div>
                      <div class="menuboxdonw" :class="{none:item.show}">
                        <a href="javascript:void(0)" class="none">站点录入</a>
                        <a href="javascript:void(0)" class="none">站点设备查询</a>
                        <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
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
                         <span>状态:断开连接</span>
                      </div>
                      <div class="menuboxdonw" :class="{none:item.show}">
                        <a href="javascript:void(0)" class="none">站点录入</a>
                        <a href="javascript:void(0)" class="none">站点设备查询</a>
                        <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
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
                        <span>状态:断开连接</span>
                      </div>
                      <div class="menuboxdonw" :class="{none:item.show}">
                        <a href="javascript:void(0)" class="none">站点录入</a>
                        <a href="javascript:void(0)" class="none">站点设备查询</a>
                        <a href="javascript:void(0)" class="" @click="dnow(item)">站点下的车辆</a>
                        <i @click="closeItem(item)">X</i>
                      </div>
                    </div>
                  </div>
                </Col>
             </Row>
           </div>
         </div>

       </div>
     </div>
   </div>
   <sitecar-component v-if="sitecarshow" :docksiteNo="siteNo" @emitcardcomponent="emitcardcomponent"></sitecar-component>
  </div>
</template>
<script>
import docksiteComponent from '../../pub/bicycledocksite.vue'
import sitecarComponent from '../../pub/sitecarcomponent.vue'
export default {
  name: "",
  components:{
    docksiteComponent,
    sitecarComponent
  },
  data () {
    return {
      loading:false,
      flag:false,
      data:[],
      siteNo:"",
      sitecarshow:false,
      distList:[],
      formCustom:{
         bikeNo:"",
         enquiriesNo:"",
         siteNo:"",
         siteName:"",
         enteringCompanyId:""
      },
    }
  },
  mounted() {
    this.dist()
    // this.list();
  },
  methods: {
    contextmenu (e) {
      this.data.forEach((a)=>{
        a.show = true
      })
      e.show = false
    },
    ngOnInit(data) {
      const sorted = this.groupBy(data, function (item) {
        return [item.districtName];
      });
      console.log(sorted)
      this.distList = sorted
      this.distshow = true
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
    tabdist (e) {
      this.distList.forEach((a)=>{
        a.show = false
      })
      e.show = true
      if(e.id){
        let data = this.data
        data.forEach((a)=>{
          if(a.districtId==e.id){
            a.itemshow = true
          }else {
            a.itemshow = false
          }
        })
        this.data = data
      }else {
        this.data.forEach((a)=>{
          a.itemshow = true
        })
      }
    },
    closeItem (e) {
      e.show = true
    },
    emitcardcomponent () {
      this.sitecarshow = false
    },
    EmitDocksiteComponent (e) {
      this.formCustom.siteNo = e.docksiteNo
    },
    handleSubmit () {
      this.list()
    },
    dnow (e) {
      this.siteNo = e.docksiteNo
      this.sitecarshow = true
    },
    dist () {
        let listdata = {
          token:this.$webapi.get('token')
       }
       let _this =  this
      this.$api.get('/district/listNoPage',listdata,reset => {
        if (reset.codeId === 1) {
          let data = reset.resData
              let item = {
                  id:"",
                  name:"全部"
              }
              data.unshift(item)
              data.forEach((a)=>{
                a.show = false
              })
           _this.distList = data
          _this.list()
        }
      })
    },
    list () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        siteNo:this.formCustom.siteNo,
     }
      let _this =  this
      this.$api.get('/site_monitor/monitor_list',listdata,reset => {
        if (reset.codeId === 1) {
           let data  = reset.resData
               data.forEach((a)=>{
                 a.itemshow = true
                 a.show = true
                 if(!a.districtName){
                   a.districtName = "全部"
                 }
               })
              _this.ngOnInit(data)
        }else if(reset.codeId === -9){
          _this.data = [];
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
.card_bd{
  color: #000!important;
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
    width: 150px;
    border: #ddd 1px solid;
    margin-right: 10px;
    h2{
      background: #ddd;
      height: 50px;
      line-height: 50px;
      text-align:center;
    }
    ul{
      li{
        height: 40px;
        line-height: 40px;
        border-bottom: #ddd 1px solid;
        overflow: hidden;
        cursor: pointer;
        padding: 0 5px;
      }
    }
  }
  .site_right{
    display: block;
    margin-left: 170px;
  }
}
.ative{
  background: #409EFF;
  color: #fff
}
</style>
