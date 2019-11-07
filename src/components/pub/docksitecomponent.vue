<style scoped lang="less">
</style>
<template>
  <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="选择车辆型号">
      <Option value="" key="">全部</Option>
      <Option v-for="item in dearalldata" :value="item.id">{{ item.bikeModel }}</Option>
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
          this.$api.get('/bike_bom/bom_list',data,reset => {
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
          this.$emit('EmitbomComponent',data)
        }else{
          this.$emit('EmitbomComponent',{
            id:"",
            bikeModel:""
          })
        }

      }
    }
}

</script>
