<style scoped lang="less">
</style>
<template>
  <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="选择片区" filterable clearable>
      <Option value="" key="">全部</Option>
      <Option v-for="item in dearalldata" :value="item.id" :key="item.id">{{ item.name }}</Option>
  </Select>
   </div>
</template>

<script>
export default {
    name: 'index',
    props:{
      city:{
        default () {
          return []
        }
      },
      fenceId:{
        default:""
      }
    },
    data() {
        return {
          dearvalue:"",
          provinceCode:"",
          cityCode:"",
          countyCode:"",
          dearalldata:[]
        }
    },
    mounted() {
      //do something after mounting vue instance
      if(this.city.length>1){
        this.provinceCode = this.city[0] || ""
        this.cityCode = this.city[1] || ""
        this.countyCode = this.city[2] || ""
      }
      if(this.fenceId){
        alert(11111)
        this.dearvalue = ''+this.fenceId
      }
      this.list()
    },
    watch:{
      city:{
        handler (val,oldval) {
          this.provinceCode = val[0] || ""
          this.cityCode = val[1] || ""
          this.countyCode = val[2] || ""
        },
        deep:true
      },
      fenceId:{
        handler (val,oldval) {
            this.dearvalue = val
        },
        deep:true
      }
    },
    methods: {
      list () {
          let _this = this
          let data = {
              token:this.$webapi.get('token')
          }
          this.$api.get('/district/listNoPage',data,reset => {
              if (reset.codeId === 1) {
                 _this.dearalldata = reset.resData
              }
          })
      },
      dearleSelect (option) {
        let data = {}
        let idx = 0
        this.dearalldata.forEach(function (item) {
            if(item.id == option){
              data = item
              idx = 1
            }
        })
        if(idx==1){
          this.$emit('districtEmitComponent',data)
        }else{
          this.$emit('districtEmitComponent',{
            id:"",
            name:"",
            districtNo:""
          })
        }
      }
    }
}

</script>
