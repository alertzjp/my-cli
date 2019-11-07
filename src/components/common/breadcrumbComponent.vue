<template>
  <div class="pageHeader" v-if="breadcrumbList.length>1&&width>1500">
    <div class="pageBread">
      <Breadcrumb>
        <!--为了接口那级别页面展示-->
         <!-- {{breadcrumbList}}   -->
        <BreadcrumbItem v-for="item in breadcrumbList" v-if="!show">{{item.name}}</BreadcrumbItem>
        <BreadcrumbItem v-for="item in breadcrumbData" v-if="show">{{item.name}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="page-detail" v-if="width>750">        
        <div class="page-detail-hd" v-if="!show">
           <Button type="error" icon="ios-arrow-back" class="mb10" size="large" 
           @click="back(breadcrumbList[breadcrumbList.length-1])" 
           v-if="breadcrumbList[breadcrumbList.length-1].url">
           返回
          </Button>
        </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "",
  data () {
    return {
       show:true,
       breadcrumbList:[],
       filters:['/admin/index/']
    }
  },
  computed: {
   ...mapState({
     width: state => state.GETSETlIST.gb.width,
     breadcrumbData: state => state.Breadcrumb.value
   })
 },
  watch:{
    '$route':{
      handler (val,oldval) {               
        var itemData = val.matched[val.matched.length-1].meta || {}
        if(itemData.backshow && itemData.isshow){   
          this.show = false  
          this.breadcrumbList = this.navList(val.path)   
        }else{
          this.show = true
          this.$store.commit('Breadcrumb/incrementurl',val.path)
        }        
        if(val){
          let webshellbd = document.getElementById('webshellbd')
              if(webshellbd){
                webshellbd.scrollTo(0,0)
              }
          //this.setcrumb(val)
        }
      },
      deep:true
    }
  },
  mounted() {
    //do something after mounting vue instance
    let setdata = this.$route
    this.setcrumb(setdata)
    this.$store.commit('Breadcrumb/incrementurl',this.$route.fullPath)
  },
  methods: {
    getNavList (reset,path,tempData) {
      var reset = reset || [];
      var newData = tempData.find(item=>item.id==path) 
         reset.unshift(newData)         
         if(newData.parent_id==0){
           return reset
         }else{
           this.getNavList(reset,newData.parent_id,tempData)
         }   
         console.log(reset)
      return reset   
    },
    navList (path) {    
      var reset = []
      var tempData = []
      var NavData = JSON.parse(this.$webapi.get("breadcrumb"))          
          tempData = this.findNav(tempData,NavData)
      var newDataList = tempData.find(item=>item.path==path)
      var newreset = [newDataList]
          reset = this.getNavList(newreset,newDataList.parent_id,tempData) 
          newreset.unshift({
            name:"首页"
          })
      return reset
    },
    findNav (tempData,NavData) {
      let _this = this;
      var reset = tempData
      NavData.forEach((item=>{
        reset.push(item)
        if(item.resourcesList && item.resourcesList.length>0){
          _this.findNav(reset,item.resourcesList)
        }
      }))
      return reset
    },
    back (e) {
      this.$router.back(-1)
      if(e.viewshow){
        let itemindex = -1;
        let url = this.$route.fullPath
        let itemList = {}
        let urldata = this.$store.getters['TABNAVLIST/getItem']
            urldata.forEach((item,index)=>{
              if(item.cur == url){
                itemindex = index
                itemList = item
              }
          })
        this.$vm.$emit("emitnav",{
          itemindex:itemindex,
          itemList:itemList
        })
      }
    },
    setcrumb (setdata) {
      let data = []
      let itemfilter = this.regfilter(setdata)
      if(itemfilter){
        this.breadcrumbList  = data
        return
      }
      if(setdata.matched.length>1){
        setdata.matched.forEach(function (a) {
          let str = {
             name:a.meta.title,
             path:a.redirect?a.path:null,
             viewshow:a.meta?a.meta.backshow?a.meta.backshow:false:false
          }
          data.push(str)
        })
      }
      this.breadcrumbList  = data
    },
    regfilter (e) {
       let str = false
       this.filters.forEach(function (a) {
         if(a == e.path){
           str = true
         }
       })
       return str
    },
  }
}
</script>
<style lang="less" scoped>

</style>
