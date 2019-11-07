<style scoped lang="less">
</style>
<template>
  <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="">     
      <Option v-for="item in dearalldata" :value="item.id">{{ item.enteringCompanyName}}</Option>
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
      },
      id:{
        default:""
      }
    },
    data() {
        return {
          formCustom:{

          },
          dearvalue:"",
          subCompanyId:"",
          dearalldata:[]
        }
    },
    mounted() {
      //do something after mounting vue instance
      this.formCustom.id = this.id
      this.list()
    },
    methods: {
      list () {
        let listdata = {
            data:JSON.stringify({
              id:""+this.formCustom.id,
              token:this.$webapi.get("token")
            })
        }
        let _this = this;
        this.$api.get('/bicycledocksite/other_list',listdata,reset => {
          if (reset.codeId == 1) {
            _this.dearalldata = reset.resData
          }else{
            _this.$netcode.getApiCode(reset)
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
