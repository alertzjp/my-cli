<style scoped lang="less">
</style>
<template>
  <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)">
      <Option v-for="item in docksitedata" :value="item.id" :key="item.id">{{ item.docksiteName }}</Option>
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
    created() {
      this.list()
    },
    methods: {
      list () {
          let _this = this
          let data = {
              token:this.$webapi.get('token'),
              pageNo:"1",
              pageSize:"10000"
          }
          this.$api.get('/xp_docksite/page',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData.list
              }
          })
      },
      dearleSelect (option) {
        let _this=this;
        let data={}
        this.docksitedata.forEach(function(a){
          if(a.id==option){
            data={
              bikeDocksiteId:a.id,
              docksiteNo:a.docksiteNo,
              docksiteName:a.docksiteName
            }
          }
        })
        this.$emit('EmitComponent',data)
      }
    }
}

</script>
