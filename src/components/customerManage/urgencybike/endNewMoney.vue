<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">结束计费</div>
        <Form :label-width="120">
          <FormItem label="选择结束计费方式">
            <Select v-model="formCustom.solveFlag" @on-change="onchange">
                <Option value="0">报急时间</Option>
                <Option value="1">选择结束计费时间</Option>
            </Select>
           </FormItem>
          <FormItem label="结束计费时间" v-if="formCustom.solveFlag==1" >
            <time-component :timevale="1" @timeEmit="timeEmit"></time-component>
          </FormItem>
          <FormItem label="结束计费时间" v-if="formCustom.solveFlag==0">
             {{formCustom.returnTime}}
          </FormItem>
          <FormItem label="站点名称">
               <site-component @EmitDocksiteComponent="EmitDocksiteComponent" :status="1"></site-component>
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
import timeComponent from "../../pub/timeonecomponent.vue"
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    timeComponent,
    siteComponent
  },
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
        solveFlag:'0',
        distance:"1",
        returnTime:"",
        bikeType:"1"
       },
      loading:false
    }
  },
  mounted() {
    //do something after mounting vue instance     
    this.formCustom.id = this.selectitem.rentId
    this.formCustom.distance = this.selectitem.distance
    this.formCustom.returnTime = this.$webapi.gettime('time',(this.selectitem.createTime)/1000)
  },
  methods: {
    startTime (e) {
        this.formCustom.returnTime = e
    },
    onchange () {
      if(this.formCustom.solveFlag==0){
        this.formCustom.returnTime = this.$webapi.gettime('time',(this.selectitem.createTime)/1000)
      }else {
        this.formCustom.returnTime = this.$webapi.gettime('time',(new Date().getTime())/1000)
      }
    },
    EmitDocksiteComponent (e) {
      this.formCustom.dockSiteNo = e.docksiteNo
    },
    post () {
      let listdata = {
          data:{
            token:this.$webapi.get('token'),
            bikeType:"1",
            distance:this.formCustom.distance,
            id:""+this.formCustom.id,
            dockSiteNo:this.formCustom.dockSiteNo
          }
      }
      listdata.data.returnTime = this.formCustom.returnTime
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
