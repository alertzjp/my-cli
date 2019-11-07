<template>
  <div id="">
    <DatePicker :type="type" v-if="timevale==1" :value='newtime'  placeholder="选择时间"  @on-change="changetime" :options="options"></DatePicker>
    <DatePicker :type="type" v-if="timevale==2" readonly="true" :value='newtime'  placeholder="选择时间"  @on-change="changetime" :options="options"></DatePicker>
    <DatePicker :type="type" v-if="timevale==0"   placeholder="选择时间"  @on-change="changetime" :options="options"></DatePicker>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    type:{
      default () {
        return "datetime"
      }
    },
    timevale:{
      //0没有1有默认值
      default () {
        return 0
      }
    },
    timeprop:{
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      newtime:'',
      options:{
        disabledDate (date) {
           return date && date.valueOf() > Date.now();
         }
      }
    }
  },
  mounted() {
      setTimeout(()=>{
        if(this.timeprop){
           this.newtime=this.timeprop
        }else{
           this.newtime = this.$webapi.gettime('time',new Date().getTime()/1000)
        }
      },100)
  },
  methods: {
    changetime(time) {
      this.$emit("timeEmit",time)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
