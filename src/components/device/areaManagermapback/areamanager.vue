<template>
  <div>
    <addedit-component v-if="type==1" :type="type" :regionScope="regionScope" @emitarea="emitarea" :districtItem="districtItem" :cursiteshow="cursiteshow"></addedit-component>  
    <addedit-component v-if="type==2" :type="type" :regionScope="regionScope" @emitarea="emitarea" :districtItem="districtItem" :AllPolygon="AllPolygon" :cursiteshow="cursiteshow"></addedit-component> 
    <areaview-component v-if="type==3" :type="type" :regionScope="regionScope"  @emitarea="emitarea" :districtItem="districtItem"></areaview-component>  
  </div>
</template>
<script>
import maintainComponent from "../../pub/maintainerIdcomponentnew.vue"
import addeditComponent from "./addedit.vue"
import areaviewComponent from "./areaview.vue"
export default {
  name:"",
  components:{
    maintainComponent,
    addeditComponent,
    areaviewComponent
  },
  props:{
    AllPolygon:{
      default () {
        return []
      }
    },
    cursiteshow:{
      default (){
        return false
      }
    },
    type:{
      default(){
        return 1
      }
    },
    regionScope: {
      type: Array,
      default () {
          return []
      }
    },   
    districtItem:{
      default(){
        return {}
      }
    }
  }, 
  data () {
    return {
      show:false,
      areaID:"",
      area:{},
      areaviewData:{},     
    }
  },  
  mounted (){
    
  },
  methods:{    
    emitarea () {
      this.$emit('emitarea',false)
    },    
  }
}
</script>
<style lang="less" scoped>
   .areaCententfix{
       position: relative;
       min-height: 300px;
    }
   .areaTitle{     
     position: relative;  
     padding: 10px 0; 
     font-size: 16px;  
     span{
       width: 2px;       
       background: #007AFF;
       float: left;
       padding: 10px 0;
       margin-right: 10px;
     }
   }
  .areaBox{
    position: absolute;
    left:0px;
    top:50px;
    background: #fff;
    width: 300px;
    min-height: 50vh;
    padding: 20px;
  }
</style>