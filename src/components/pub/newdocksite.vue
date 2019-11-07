<style scoped lang="less">
</style>
<template>
  <Select v-model="docksitedatavalue" @on-change="dearleSelect(docksitedatavalue)">
      <Option v-for="item in docksitedata" :value="item.id" :key="item.id">{{ item.dockSiteName }}</Option>
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
          this.$api.get('/docksite/find/by_districtId',data,reset => {
              if (reset.codeId === 1) {
                 _this.docksitedata = reset.resData.list
              }
          })
      },
      dearleSelect (option) {
        this.$emit('EmitComponent',option)
      }
    }
}

</script>
