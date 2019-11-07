<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">{{type==1?"新建调度单":"编辑调度单"}}</div>
      <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="80">
          <FormItem label="调度人:" required>
              <maintainer-component :propsid="formCustom.maintainerId" @emitmaintainer="emitmaintainer"></maintainer-component>
          </FormItem>
          <FormItem label="调出站点:" required>
              <site-component @EmitDocksiteComponent="outSiteName" type="2" :status="1" :siteId="formCustom.outSiteId" v-if="show"></site-component>
          </FormItem>
          <FormItem label="调入站点:" required>
             <site-component @EmitDocksiteComponent="inSiteName" type="2" :status="1" :siteId="formCustom.inSiteId" v-if="show"></site-component>
          </FormItem>
          <FormItem label="预计数量:" required >
              <Input v-model="formCustom.expectedNum"/>
          </FormItem>
          <FormItem label="备注:" prop="remark" >
             <Input v-model="formCustom.remark" placeholder="备注" />
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
        maintainerId:'',
        outSiteId:'',
        inSiteId:'',
        expectedNum:'',
        remark:''
      },
      ruleValidate:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    if(this.type==2){
      this.formCustom.id = this.setlectitem.id
      this.formCustom.maintainerId = this.setlectitem.maintainerId
      this.formCustom.inSiteId = this.setlectitem.inSiteId
      this.formCustom.outSiteId = this.setlectitem.outSiteId
      this.formCustom.remark = this.setlectitem.remark
      this.formCustom.expectedNum = this.setlectitem.expectedNum
    }
    this.show = true
  },
  methods: {
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
        if(this.formCustom.maintainerId==""){
          this.$Message.info("调度人没有选择")
          return
        }
        if(this.formCustom.outSiteId==""){
          this.$Message.info("调出站点没有选择")
          return
        }
        if(this.formCustom.inSiteId==""){
          this.$Message.info("调入站点没有选择")
          return
        }
        if(this.formCustom.expectedNum==""){
          this.$Message.info("预计数量没有填写")
          return
        }
        if(this.formCustom.outSiteId==this.formCustom.inSiteId){
          this.$Message.info("调出站点和调入站点不能相同")
          return
        }
        this.$refs[name].validate((valid) => {
            if (valid) {
                if(_this.type==1){
                  _this.pass()
                }else if(_this.type==2){
                  _this.editpass()
                }
            }
        })
     },
    pass () {
      let _this=this;
      let listdata={
        token:this.$webapi.get('token'),
        maintainerId:this.formCustom.maintainerId,
        outSiteId:this.formCustom.outSiteId,
        inSiteId:this.formCustom.inSiteId,
        expectedNum:this.formCustom.expectedNum,
        remark:this.formCustom.remark
      }
      this.$api.post('/bicycle_dispatch_sheet/add',listdata,reset => {
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
        maintainerId:this.formCustom.maintainerId,
        outSiteId:this.formCustom.outSiteId,
        inSiteId:this.formCustom.inSiteId,
        expectedNum:this.formCustom.expectedNum,
        remark:this.formCustom.remark
      }
      this.$api.post('/bicycle_dispatch_sheet/update',listdata,reset => {
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
