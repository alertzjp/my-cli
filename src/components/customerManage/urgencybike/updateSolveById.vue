<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">解决问题</div>
        <Form :label-width="100">
          <FormItem label="是否解决问题">
            <Select v-model="formCustom.solveFlag">
               <Option value="1">是</Option>
               <Option value="0">否</Option>
           </Select>
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
      loading:false,
      formCustom:{
        id:"",
        solveFlag:"1",
        bikeType:"1",
        bicycle_no:''
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.id = this.selectitem.id
    this.formCustom.bicycle_no = this.selectitem.bikeNo   
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
            solveFlag:this.formCustom.solveFlag,
            id:""+this.formCustom.id,
            bicycle_no:this.formCustom.bicycle_no
          }
      }
      listdata.data = JSON.stringify(listdata.data)
      let _this =  this
      this.loading = true
      this.$api.post('/customerBicycle/updateSolveById',listdata,reset => {
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
