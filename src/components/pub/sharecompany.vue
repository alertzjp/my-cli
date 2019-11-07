<style scoped lang="less">
</style>
<template>
  <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="单车入驻企业">
      <Option value="" key="">全部</Option>
      <Option v-for="item in dearalldata" :value="item.id">{{ item.name }}</Option>
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
            token:this.$webapi.get('token'),
            status:2
          }
          this.$api.get('/bicycle_entering_company/list',data,reset => {
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
          this.$emit('EmitComponent',data)
        }else{
          this.$emit('EmitComponent',{
            id:"",
            name:""
          })
        }

      }
    }
}

</script>
