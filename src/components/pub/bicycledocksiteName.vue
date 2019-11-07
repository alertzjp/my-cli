<style scoped lang="less">
</style>
<template>
  <div class="">
    <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)" filterable placeholder="选择站点" v-if="type==1">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.id" >{{ item.docksiteName }}</Option>
    </Select>
    <Select v-model="docksitedatavalue" @on-change="dearleSelect01(docksitedatavalue)" filterable placeholder="选择站点" v-if="type==2">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.id" >{{ item.docksiteName }}</Option>
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
      type:{
        default() {
          return 1
        }
      },
      docksiteNo:{
        default () {
          return ""
        }
      },
      siteId:{
        default () {
          return ""
        }
      }
    },
    mounted() {
      //do something after mounting vue instance
      if(this.type==1){
        this.docksitedatavalue = ''+this.docksiteNo
      }
      if(this.type==2){
        this.docksitedatavalue = parseInt(this.siteId)
      }
      this.list()
    },
    methods: {
      list () {
          let _this = this
          let data = {
              data:JSON.stringify({
                token:this.$webapi.get('token'),
                pageNo:"1",
                pageSize:"10000"
              })
          }
          this.$api.get('/bicycledocksite/list',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData.list
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
          this.$emit('EmitDocksiteComponent',data)
        }else{
          this.$emit('EmitDocksiteComponent',{
            id:"",
            docksiteName:"",
            docksiteNo:""
          })
        }
      },
      searchQueryChange(option) {
        let data = {}
        let idx = 0
        this.docksitedata.forEach(function (item) {
            if(item.docksiteName == option){
              data = item
              idx = 1
            }
        })
        if(idx==1){
          this.docksitedatavalue = data.docksiteNo
          this.$emit('EmitDocksiteComponent',data)
        }
      },
      searchQueryChange01(option) {
        let data = {}
        let idx = 0
        this.docksitedata.forEach(function (item) {
            if(item.docksiteName == option){
              data = item
              idx = 1
            }
        })
        if(idx==1){
          this.docksitedatavalue = data.docksiteNo
          this.$emit('EmitDocksiteComponent',data)
        }
      },
      dearleSelect01 (option) {
        let data = {}
        let idx = 0
        this.docksitedata.forEach(function (item) {
            if(item.id == option){
              data = item
              idx = 1
            }
        })
        if(idx==1){
          this.$emit('EmitDocksiteComponent',data)
        }else{
          this.$emit('EmitDocksiteComponent',{
            id:"",
            docksiteName:"",
            docksiteNo:""
          })
        }
      }
    }
}

</script>
