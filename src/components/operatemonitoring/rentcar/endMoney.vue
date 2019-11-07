<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">结束计费</div>
        <Form :label-width="100">
          <!-- <FormItem label="行驶里程（米）" >
             <Input type="text" v-model="formCustom.bikeModel"></Input>
          </FormItem> -->
          <FormItem label="还车时间" >
            <DatePicker type="datetime" @on-change="startTime"></DatePicker>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default"  @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="post()" :loading="loading" style="margin-left: 8px" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    selectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:true,
      formCustom:{
        id:"",
        distance:"1",
        returnTime:"",
        bikeType:"1"
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.id = this.selectitem.id
    this.formCustom.distance = this.selectitem.distance
    this.formCustom.returnTime = this.$webapi.get('time',new Date().getTime())
  },
  methods: {
    startTime (e) {
        this.formCustom.returnTime = e
    },
    post () {

      let listdata = {
          data:{
            token:this.$webapi.get('token'),
            bikeType:"1",
            distance:this.formCustom.distance,
            id:""+this.formCustom.id
          }
      }
      if(this.formCustom.returnTime==""){
        listdata.data.returnTime = this.formCustom.returnTime
      }
      let _this =  this
      this.loading = true
      listdata.data = JSON.stringify(listdata.data)
      this.$api.post('/customerBicycle/endCost',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.pass()
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    pass () {
      this.$emit("emitendcomponent")
    },
    cancel() {
      this.$emit("emitendcomponent")
    }
  }
}
</script>
<style lang="less" scoped>
</style>
