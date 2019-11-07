<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">{{type==1?"新增站点监控参数":"编辑站点监控参数"}}</div>
      <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="120">
          <FormItem label="最小参考参数:" required>
            <Select v-model="formCustom.minPriority">
                 <Option value="1">数量</Option>
                 <Option value="2">百分比</Option>
            </Select>
          </FormItem>
          <FormItem label="最大参考参数:" required>
            <Select v-model="formCustom.maxPriority">
                 <Option value="1">数量</Option>
                 <Option value="2">百分比</Option>
            </Select>
          </FormItem>
          <FormItem label="最小车辆数:" required  v-if="formCustom.minPriority==1">
              <InputNumber :min="0" v-model="formCustom.minBicycleNum"></InputNumber>
          </FormItem>
          <FormItem label="最大车辆数:" required  v-if="formCustom.maxPriority==1">
            <InputNumber  :min="0" v-model="formCustom.maxBicycleNum"></InputNumber>
          </FormItem>
          <FormItem label="最小车辆百分比:" required  v-if="formCustom.minPriority==2">
              <span><InputNumber  :min="0" v-model="formCustom.minBicyclePercentage"></InputNumber></span>%
          </FormItem>
          <FormItem label="最大车辆百分比:" required  v-if="formCustom.maxPriority==2">
            <span><InputNumber  :min="0" v-model="formCustom.maxBicyclePercentage"></InputNumber></span>%
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" size="large" v-if="type==1">保存</Button>
        <Button type="primary" @click="handleSubmit('formCustom')" style="margin-left: 8px" size="large" v-if="type==2">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import maintainerComponent from "../../pub/maintainerIdcomponent.vue"
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    maintainerComponent,
    siteComponent
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    setlectitem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show:false,
      formCustom:{
        id:"",
        status:'',
        minBicycleNum:'0',
        maxBicycleNum:'0',
        minBicyclePercentage:'0',
        maxBicyclePercentage:'0',
        minPriority:'',
        maxPriority:''
      },
      ruleValidate:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(this.type==2){
      this.formCustom.id = this.setlectitem.id
      this.formCustom.status = ''+this.setlectitem.minPriority
      this.formCustom.maxBicycleNum = this.setlectitem.maxBicycleNum
      this.formCustom.maxBicyclePercentage = this.setlectitem.maxBicyclePercentage
      this.formCustom.maxPriority = this.setlectitem.maxPriority
      this.formCustom.minBicycleNum = this.setlectitem.minBicycleNum
      this.formCustom.minBicyclePercentage = this.setlectitem.minBicyclePercentage
      this.formCustom.minPriority = ''+this.setlectitem.minPriority
      this.formCustom.maxPriority = ''+this.setlectitem.maxPriority
      this.show = true
    }else{
      this.formCustom.maxPriority = '1'
      this.formCustom.minPriority = '1'
      this.show = true
    }
  },
  methods: {
    Priority () {
      this.formCustom.minPriority = this.formCustom.status
      this.formCustom.maxPriority = this.formCustom.status
    },
    emitmaintainer (e) {
      this.formCustom.maintainerId = e.id
    },
    outSiteName (e) {
      this.formCustom.outSiteId = e.id
    },
    inSiteName (e) {
      this.formCustom.inSiteId = e.id
    },
    handleSubmit (name) {
        let _this = this;
        if(this.formCustom.minPriority == 1){
          if(this.formCustom.minBicycleNum==0){
            this.$Message.info("最小车辆数没有为0")
            return
          }
        }
        if(this.formCustom.minPriority == 2){
          if(this.formCustom.minBicyclePercentage==0){
            this.$Message.info("最小车辆数百分比不能小于0%")
            return
          }
        }
        if(this.formCustom.maxPriority == 1){
          if(this.formCustom.maxBicycleNum==0){
            this.$Message.info("最大车辆数没有为0")
            return
          }
        }
        if(this.formCustom.maxPriority == 2){
          if(this.formCustom.maxBicyclePercentage==0){
            this.$Message.info("最大车辆百分比不能小于0%")
            return
          }
        }
        if(_this.type==1){
          _this.pass()
        }else if(_this.type==2){
          _this.editpass()
        }
     },
    pass () {
      let _this=this;
      let listdata={
        token:this.$webapi.get('token'),
        // minBicycleNum:this.formCustom.minBicycleNum,
        // maxBicycleNum:this.formCustom.maxBicycleNum,
        // minBicyclePercentage:this.formCustom.minBicyclePercentage,
        // maxBicyclePercentage:this.formCustom.maxBicyclePercentage,
        minPriority:this.formCustom.minPriority,
        maxPriority:this.formCustom.maxPriority
      }
      if(this.formCustom.minPriority == 1){
        listdata.minBicycleNum = this.formCustom.minBicycleNum
      }
      if(this.formCustom.minPriority == 2){
        listdata.minBicyclePercentage = this.formCustom.minBicyclePercentage
      }
      if(this.formCustom.maxPriority == 1){
        listdata.maxBicycleNum = this.formCustom.maxBicycleNum
      }
      if(this.formCustom.maxPriority == 2){
        listdata.maxBicyclePercentage = this.formCustom.maxBicyclePercentage
      }
      this.$api.post('/site_monitor_parameter/add',listdata,reset => {
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    editpass () {
      let _this=this;
      let listdata={
        id:this.formCustom.id,
        token:this.$webapi.get('token'),
        // minBicycleNum:this.formCustom.minBicycleNum,
        // maxBicycleNum:this.formCustom.maxBicycleNum,
        // minBicyclePercentage:this.formCustom.minBicyclePercentage,
        // maxBicyclePercentage:this.formCustom.maxBicyclePercentage,
        minPriority:this.formCustom.minPriority,
        maxPriority:this.formCustom.maxPriority
      }
      if(this.formCustom.minPriority == 1){
        listdata.minBicycleNum = this.formCustom.minBicycleNum
      }
      if(this.formCustom.minPriority == 2){
        listdata.minBicyclePercentage = this.formCustom.minBicyclePercentage
      }
      if(this.formCustom.maxPriority == 1){
        listdata.maxBicycleNum = this.formCustom.maxBicycleNum
      }
      if(this.formCustom.maxPriority == 2){
        listdata.maxBicyclePercentage = this.formCustom.maxBicyclePercentage
      }
      this.$api.post('/site_monitor_parameter/update',listdata,reset => {
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    cancel(e) {
      this.$emit("emitcomponent",e?true:false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
