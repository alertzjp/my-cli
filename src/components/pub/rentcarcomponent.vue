<template>
  <Select
        v-model="value"
        filterable
        clearable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @on-change="selpro"
        >
        <Option v-for="(option, index) in options" :value="option.riderId" :key="index">{{option.bikeNo}}({{option.riderName}})</Option>
  </Select>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      value:"",
      loading:false,
      options:[]
    }
  },
  methods: {
    remoteMethod(query) {
      let _this = this;
      if (query !== '') {
          _this.loading = true;
          let params = {
              data:JSON.stringify({
                bikeNo: query,
                token: this.$webapi.get("token"),
                pageNo:"1",
                pageSize:"100",
                flowStatus:"0",
                bicycleStatus:"2"
              })
          }
          this.$api.get('/bicyclerent/list',params,reset => {
            if (reset.codeId === 1) {
              _this.options = reset.resData.list
            }
          })
          _this.loading = false;
        } else {
            this.options1 = [];
        }
    },
    selpro () {
      let data = {}
      let _this = this;    
      this.options.forEach((item)=>{
        if(item.riderId == _this.value){
          data = item
        }
      })
      console.log(data)
      this.$emit("rentcarEmit",data)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
