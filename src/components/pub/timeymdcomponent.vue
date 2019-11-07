<template>
  <div id="">
    <span>
      <RadioGroup v-model="itemtype" type="button" @on-change="RadioGroup" >
         <Radio label="1">年</Radio>
         <Radio label="2">月</Radio>
         <Radio label="3">日</Radio>
     </RadioGroup>
    </span>
    <span class="" v-if="itemtype==1">
      <DatePicker type="year" v-modle="startTime" placeholder="开始时间" @on-change="start"></DatePicker>
      <DatePicker type="year" v-modle="endTime" placeholder="结束时间" @on-change="end"></DatePicker>
    </span>
    <span class="" v-if="itemtype==2">
      <DatePicker type="month" v-modle="startTime" placeholder="开始时间" @on-change="start"></DatePicker>
      <DatePicker type="month" v-modle="endTime" placeholder="结束时间" @on-change="end"></DatePicker>
    </span>
    <span class="" v-if="itemtype==3">
      <DatePicker type="date" v-modle="startTime"  placeholder="开始时间" @on-change="start"></DatePicker>
      <DatePicker type="date" v-modle="endTime" placeholder="结束时间" @on-change="end"></DatePicker>
    </span>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      itemtype:'1',
      type:"",
      startTime:"",
      endTime:""
    }
  },
  mounted() {
    //do something after mounting vue instance

  },
  methods: {
    RadioGroup () {
      this.startTime = ""
      this.endTime = ""
      this.$emit("timeymd",{
          startTime:this.startTime || "",
          endTime:this.endTime || ""
      })
    },
    start(e) {
      this.startTime = e
      this.$emit("timeymd",{
          startTime:this.startTime || "",
          endTime:this.endTime || ""
      })
    },
    end (e) {
      this.endTime = e
      this.$emit("timeymd",{
          startTime:this.startTime || "",
          endTime:this.endTime || ""
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
