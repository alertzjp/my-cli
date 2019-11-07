<template>
  <!--
    模式
     url:https://github.com/iview/iview-area
     level 要显示的级别，如设为2则显示省、市和县，即3级，级别可设为0、1、2、3四级
     data-type 返回数据的类型，'all':城市编码和名称，'code':只返回编码，'name':只返回名称，数据格式请看表格下面的补充说明
  -->
  <div class="citybox">
     <al-cascader v-model="areaDatas" :level="level" @on-change="areaComponent" :disabled="ciytshow==0"/>
  </div>
</template>
<script>
export default {
    props: {
      level:{
        default () {
          return 2
        }
      },
      areaData:{
        type: Array,
        default () {
          return []
        }
      },
      ciytshow:{
        default () {
          return 1
        }
      },
      openID:{
        default () {
          return 0
        }
      }
    },
    mounted() {
      if(this.areaData&&this.areaData.length>0){
        this.areaDatas = this.areaData
      }
      if(this.level){
        this.level = this.level
      }
      //do something after mounting vue instance
    },
    data() {
        return {
            areaDatas:[],
        }
    },
    methods: {
      areaComponent () {
          this.areaEmit()
      },
      areaEmit () {
        if(this.areaDatas.length>0){
          this.$emit("areaEmit",this.areaDatas)
        }else{
          let str = [{code:"",name:""},{code:"",name:""},{code:"",name:""},]
          this.$emit("areaEmit",str)
        }
      }
    }
}
</script>
<style lang="less">
  .citybox{
    position:relative;
    z-index: 1000
  }
</style>
