<style scoped lang="less">
</style>
<template>
  <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="选择设备号">
      <Option value="" key="">全部</Option>
      <Option v-for="item in dearalldata" :value="item.id">{{ item.version }}</Option>
  </Select>
   </div>
</template>

<script>
export default {
    name: 'index',
    props:{
      supplierType:{
        default:""
      },
      bikeBomId:{
        default:""
      }
    },
    data() {
        return {
          dearvalue:"",
          subCompanyId:"",
          dearalldata:[]
        }
    },
    mounted() {
      //do something after mounting vue instance
      this.list()
      this.dearvalue = this.bikeBomId
    },
    methods: {
      list () {
          let _this = this
          let data = {
            token:this.$webapi.get('token')
          }
          this.$api.get('/site/version/set',data,reset => {
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
          this.$emit('EmitversionComponent',data)
        }else{
          this.$emit('EmitversionComponent',{
            id:"",
            version:""
          })
        }
      }
    }
}

</script>
