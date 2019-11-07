<style scoped lang="less">
</style>
<template>
  <div class="">
    <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)" filterable placeholder="选择版本">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.id" >{{ item.version }}</Option>
    </Select>
   </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
          docksitedatavalue:"",
          docksitedata:[]
        }
    },
    props:{
      docksiteNo:{
        default () {
          return ""
        }
      }
    },
    mounted() {
      //do something after mounting vue instance
      this.docksitedatavalue = ''+this.docksiteNo
      this.list()
    },
    methods: {
      list () {
          let _this = this
          let data = {
              token:this.$webapi.get('token'),
          }
          this.$api.get('/site/version/set',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData
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
