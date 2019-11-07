<style scoped lang="less">
</style>
<template>
  <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)" filterable clearable>
      <Option value="" >全部</Option>
      <Option v-for="item in docksitedata" :value="item.id" >{{ item.name }}</Option>
  </Select>
   </div>
</template>

<script>
export default {
    name: 'index',
    props:{
       companyid:{
        default () {
          return ""
        }
      },
    },
    data() {
        return {
          docksitedatavalue:"",
          docksitedata:[]
        }
    },
    mounted() {
      //do something after mounting vue instance
      setTimeout(()=>{
          this.docksitedatavalue = this.companyid
      },100)
      this.list()
    },
    methods: {
      list () {
          let _this = this
          let data = {
            token:this.$webapi.get('token'),
            // pageNo:"1",
            // pageSize:"10000"
          }
          this.$api.get('/bicycle_entering_company/list',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData
                 if(_this.docksitedata&&_this.docksitedata.length>0){
                   _this.$emit('EmitvalueComponent',_this.docksitedata[0].id)
                 }
              }
          })
      },
      dearleSelect (option) {
        let data = {}
        let idx = 0
        this.docksitedata.forEach(function (item) {
            if(item.id == option){
              data = item
              idx = 1
            }
        })
        if(idx==1){
          this.$emit('EmitcompanyComponent',data)
        }else{
          this.$emit('EmitcompanyComponent',{
            id:"",
            name:""
          })
        }
      }
    }
}

</script>
