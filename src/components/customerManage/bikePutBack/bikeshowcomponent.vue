<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">查看车辆</div>
        <div class="mb10"  v-for="item in data" >
          <span>车辆编号：</span>
          <span>{{item||''}}</span>
        </div>
      </Form>
      <div slot="footer">
        <Button type="default"  @click="cancel()" size="large">取消</Button>
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
      data:[],
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(this.selectitem.id){
      this.getdata()
    }
  },
  methods: {
    getdata () {
      let listdata = {
            token:this.$webapi.get('token'),
            id:""+this.selectitem.id
      }
      let _this =  this
      this.loading = true
      let url=""
      this.selectitem.flag==1?url="/bicycle_put_back/detail":url='/bicycle_dispatch_new/dispatch_bicycle/list'
      this.$api.get(url,listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          _this.data=_this.selectitem.flag==1?reset.resData:reset.resData.bicycleNos
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
