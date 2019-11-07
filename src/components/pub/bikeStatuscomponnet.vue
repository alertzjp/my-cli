<template>
  <div>
    <Select v-model="value" @on-change="carmodelselect(value)" placeholder="车辆状态">
        <Option value="" >全部</Option>
        <Option v-for="item in data" :value="item.value" >{{item.name}}</Option>
    </Select>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    bicycleStatus:{
      default() {
        return ""
      }
    }
  },
  data () {
    return {
      data:[],
      value:"",
      paramsdata:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.data = this.$status.bikeStatusdata()
    setTimeout(()=>{
      this.value=this.bicycleStatus
    },100)
  },   
  methods: {
    carmodelselect (val) {
      let idx = 0
      this.data.forEach((e)=>{
        if(e.value == val){
          idx = 1
          this.paramsdata = e
        }
      })
      if(idx==0){
        this.$emit("emitbikeStatus",{
          value:"",
          name:"全部"
        })
      }else{
        this.$emit("emitbikeStatus",this.paramsdata)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
