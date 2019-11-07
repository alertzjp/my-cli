<style scoped lang="less">
</style>
<template>
  <div class="">
    <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)" filterable clearable :placeholder="placeholder" v-if="type==1" style="width:100%">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.docksiteNo" >{{ item.docksiteName }}</Option>
    </Select>
    <Select v-model="docksitedatavalue" @on-change="dearleSelect01(docksitedatavalue)" filterable clearable :placeholder="placeholder" v-if="type==2" style="width:100%">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.id" >{{ item.docksiteName }}</Option>
    </Select>
    <Select v-model="docksitedatavalue" @on-change="dearleSelect01(docksitedatavalue)" @on-query-change='searchQueryChange01' filterable clearable :placeholder="placeholder" v-if="type==3" style="width:100%">
        <Option value="" >全部</Option>
        <Option v-for="item in docksitedata" :value="item.docksiteName" >{{ item.docksiteName }}</Option>
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
      placeholder:{
        default(){
          return "选择站点"
        }
      },
      docksiteNo:{
        default () {
          return ""
        }
      },
      status:{
        default () {
          return ""
        }
      },
      siteId:{
        default () {
          return 0
        }
      }
    },
    mounted() {
      //do something after mounting vue instance
      if(this.type==1){
        setTimeout(()=>{
            this.docksitedatavalue = ''+this.docksiteNo
        },100)
        // this.docksitedatavalue = ''+this.docksiteNo
      }
      if(this.type==2){
        setTimeout(()=>{
            this.docksitedatavalue = parseInt(this.siteId)
        },100)
      }
      this.list()
    },
    methods: {
      list () {
          let _this = this
          let data = {
              data:JSON.stringify({
                token:this.$webapi.get('token'),
                status:""+this.status
              })
          }
          this.$api.get('/bicycledocksite/public/listNopage',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData
              }
          })
      },
      dearleSelect (option) {
        let data = {}
        let idx = 0
        this.docksitedata.forEach(function (item) {
            if(item.docksiteNo == option){
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
