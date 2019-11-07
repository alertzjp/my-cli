<style scoped lang="less">
</style>
<template>
  <div class="">
    <Select v-model="dearvalue" @on-change="dearleSelect(dearvalue)" placeholder="选择角色">
        <Option value="" key="">全部</Option>
        <Option v-for="item in dearalldata" :value="item.id">{{ item.name }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
    name: 'index',
    props:{
      flag:{
        default:1
      },
      roleId:{
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
    created() {
      //do something after creating vue instance
      this.list()
    },
    mounted() {
      //do something after mounting vue instance     
      this.dearvalue = this.roleId
    },
    methods: {
      list () {
          let _this = this
          let data = {
            token:this.$webapi.get('token'),
            flag:this.flag
          }
          this.$api.get('/role/list_public',data,reset => {
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
          this.$emit('EmitroleComponent',data)
        }else{
          this.$emit('EmitroleComponent',{
            id:"",
            bikeModel:""
          })
        }

      }
    }
}

</script>
