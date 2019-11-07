<template>
  <div class="areaToolItem fl">    
      <div class="areaSelect fl" v-click-outside="onClickOutareaSelectItem">
         <div class="areaSelect-hd" @click="selectItem()">
           {{selectTitle}} 
           <span class="dic"></span>
         </div>
         <div class="areaSelect-bd" v-if="selectshow" >
            <div class="areaSelectItem" @click="areaSelectItem(item)" v-for="item in areaSelectList">{{item.name}}</div>          
         </div>
      </div>
      <div class="areaSelectInput fl">
          <div class="areaSelectInput-hd">
            <input type="text" v-model="inputText" :placeholder="placeholder" v-on:input="inputFunction()" @focus="inputfocus" @blur="inputblur"  class="inputText" :class="{inputTextfous:TextfousShow}" >
          </div>
          <div class="areaSelectInput-bd" v-if="inputText.length>0&&selectListItem.length>0&&selectlockshow" v-click-outside="onClickOutside">
            <!-- {{selectListItem}} -->
              <div v-for="item in selectListItem" class="areaSelectInputItem" @click="selectListItemvalue(item)" v-if="selectType==3 || selectType==4">
                   {{item.docksiteName}}({{item.docksiteNo}})
              </div>
              <div v-for="item in selectListItem" class="areaSelectInputItem" @click="selectListItemvalue(item)" v-if="selectType==1 || selectType==2">
                   {{item.name}}({{item.districtNo}})
              </div>
          </div>
      </div>
      <div class="searchBtn fl" @click="SearchClick">
          <Icon type="ios-search" size="22" color="#06c"/>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectTitle:"片区名称",
      selectshow:false,
      selectdnowshow:false,
      selectlockshow:true,
      selectType:1,
      TextfousShow:false,//input触发状态
      areaSelectList:[{value:1,name:"片区名称",key:"districtName"},{value:2,name:"片区编号",key:"districtNo"},{value:3,name:"站点名称",key:"docksiteName"},{value:4,name:"站点编号",key:"docksiteNo"}],
      inputText:"",
      siteList:[],
      areaList:[],
      selectListItem:[],
      districtId:"", //片区ID
      districtNo:"",
      districtName:"",
      docksiteId:"",
      docksiteName:"",
      latitude:"",
      longitude:""      
    }
  },
  computed: {
    placeholder () {
      return "请输入"+this.selectTitle 
    },     
  },
  mounted () {
    this.sitenameList()
    this.areanameList()   
    this.$vm.$on("UpdateAera",e=>{
        this.areanameList()   
    })    
  },
  methods: {
    SearchClick (){
      this.$vm.$emit("")
    },
    onClickOutside (){
      this.selectListItem = []
    },
    inputfocus () {
      this.TextfousShow = true
    },
    inputblur () {
      if(this.inputText.length==0){
        this.TextfousShow = false
        this.districtId = null   
        this.docksiteId = null        
      }      
    },
    inputFunction () {       
      this.selectListItem = []     
      this.selectdnowshow = this.inputText.length>0?true:false
      this.selectlockshow = true
      let selectTitle = this.inputText       
      if(this.selectType == 1){
         this.selectListItem = this.areaList.filter(item=>item.name.indexOf(selectTitle)>-1)
      }       
      if(this.selectType == 2){
         this.selectListItem = this.areaList.filter(item=>item.name.indexOf(selectTitle)>-1) 
      } 
      if(this.selectType == 3){
        this.selectListItem = this.siteList.filter(item=>item.docksiteName.indexOf(selectTitle)>-1) 
      } 
      if(this.selectType == 4){
        this.selectListItem = this.siteList.filter(item=>item.docksiteNo.indexOf(selectTitle)>-1)        
      }       
    },
    sitenameList () {     
      let _this=this;
      let params = {
        data:JSON.stringify({
          token:this.$webapi.get("token")
        })        
      }      
      this.$api.get("/bicycledocksite/public/listNopage",params,reset=>{
        if(reset.codeId==1){
          _this.siteList = reset.resData
        }
      })
    },    
   areanameList () {
      let _this=this;
      let params = {
        token:this.$webapi.get("token")
      }       
      this.$api.get("/district/listNoPage",params,reset=>{
        if(reset.codeId==1){           
          _this.areaList = reset.resData
        }
      })
    },   
    selectListItemvalue (e) { 
      this.latitude = ""
      this.longitude = ""
      if(this.selectType==1 || this.selectType==2){
        if(e){
          this.inputText = e.name
          this.districtName = e.name
          this.districtNo = e.districtNo
          this.selectlockshow = false
          this.districtId = e.id
          this.latitude = e.districtLatitude
          this.longitude = e.districtLongitude
        }
      }
      if(this.selectType==3 || this.selectType==4){
        if(e){
          this.inputText = e.docksiteName
          this.docksiteName = e.docksiteName
          this.selectlockshow = false
          this.districtId = e.districtId
          this.districtNo = e.districtNo
          this.docksiteNo = e.docksiteNo
          this.docksiteId = e.id
          this.latitude = e.districtLatitude
          this.longitude = e.districtLongitude
        }
      }
    },  
    selectItem () {
      this.selectshow = !this.selectshow
    },
    areaSelectItem (e) {
      this.inputText = ""      
      this.selectTitle = e.name
      this.selectType = e.value
      this.selectshow = false      
    },
    onClickOutareaSelectItem (){
      this.selectshow = false;
    },
    SearchClick () {
      let _this = this;        
      if(this.inputText.length>0&&this.inputText!=_this.docksiteName && this.inputText!=_this.districtName){
        return
      } 
      this.$emit("emitAreaSearch",{
        type:_this.selectType,
        title:_this.inputText,
        districtName:_this.districtName,
        districtId:_this.districtId,
        districtNo:_this.districtNo,
        docksiteNo:_this.docksiteNo,
        docksiteId:_this.docksiteId,
        docksiteName:_this.docksiteName,
        latitude:_this.latitude,
        longitude:_this.longitude
      })
    }
  }
}
</script>
<style lang="less" scoped>
.areaToolItem{
  background: #fff;
  height: 40px;
  border-radius: 40px;
  padding-right: 20px;
  box-shadow: 2px 2px 5px #ddd;
  margin-right: 20px;
  position: relative;
  .areaSelectInput{
    padding: 0 10px;    
    max-width: 200px;
    position: relative;
    .inputText{
      border: #fff 1px solid;
      height: 40px;
      line-height: 40px;
      outline: none;
      position: relative;
      z-index: 100;
      width: 100px;
    }
    .inputTextfous{ 
      width: 180px;      
      animation:myfirst 1s;
      -webkit-animation:myfirst 1s; /* Safari and Chrome */      
    }
    .areaSelectInput-bd{
      position: absolute;
      left:0;
      top:40px;
      z-index: 100;
      background: #f8f8f8;
      right: 0;       
      z-index: 10;
      max-height: 400px;
      overflow-y: auto;
      .areaSelectInputItem{
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom:#eee 1px solid;
        overflow: hidden;
        cursor: pointer;
      }
      .areaSelectInputItem:hover{
        background: #f1f1f1
      }
    }    
  }
  .searchBtn{
    margin-top: 8px;
    cursor: pointer;
  }  
}
.areaSelect{
  position: relative;  
  display: inline-block;
  cursor: pointer;
  .areaSelect-hd{
    border: #979797 1px solid;
    border-radius:40px;
    height: 40px;
    line-height: 40px; 
    z-index: 100;
    position: relative;
    padding: 0 25px 0 15px;
    background: #fff;
    .dic{
        position:absolute;
        right:10px;
        top:18px;
        width: 0; 
        height: 0;
        border-width: 5px;         
        border-style: solid;
        border-color:#999 transparent transparent transparent;
    }
  }
  .areaSelect-bd{
    position: absolute;
    top:20px;
    left:0;
    background: #fff;
    right: 0;     
    z-index: 99;
    padding: 30px 0 20px 0;
    border-radius:0 0 20px 20px;
    box-shadow: 2px 1px 3px #ddd; 
    text-align: center;
    .areaSelectItem{
      height: 35px;
      line-height: 35px;
      color: #000;
    }
    .areaSelectItem:hover{
      background: #f5f5f5
    }
  }
}

@keyframes myfirst
{
from {width:80px}
to {width:180px}
}


</style>