<template>
  <div id="">
    <Modal v-model="show" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">分配维修人员</div>
      <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="80">
        <FormItem label="急修状态:" required>
          <Select v-model="formCustom.fastFlag">
               <Option value="2">急修</Option>
               <Option value="1">非急修</Option>
          </Select>
        </FormItem>
        <FormItem label="解决状态:" required>
          <Select v-model="formCustom.solveFlag">
               <Option value="1">解决</Option>
               <Option value="0">未解决</Option>
          </Select>
        </FormItem>
          <FormItem label="片区:" required>
              <district-component  @districtEmitComponent="districtEmitComponent"></district-component>
          </FormItem>
          <FormItem label="站点:" required>
              <site-component @EmitDocksiteComponent="EmitDocksiteComponent" type="2"  :status="1" :siteId="formCustom.outSiteId" v-if="show"></site-component>
          </FormItem>
          <FormItem label="描述:">
             <Input v-model="formCustom.detail" placeholder="描述" />
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
import districtComponent from "../../pub/districtcommon.vue"
import siteComponent from "../../pub/bicycledocksite.vue"
export default {
  name: "",
  components: {
    districtComponent,
    siteComponent
  },
  props:{
    type:{
      default () {
        return 1
      }
    },
    selectitem:{
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
        districtId:'',
        fastFlag:'1',//1.非急修，2.急修
        solveFlag:'', // 0未解决，1.解决
        docksiteNo:'',
        detail:'',
        docksiteName:''
      },
      ruleValidate:{}
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.id = this.selectitem.id
    this.formCustom.solveFlag = ''+this.selectitem.solveFlag
    this.formCustom.districtId = ''+this.selectitem.districtId
    this.formCustom.remark = this.selectitem.remark
    this.formCustom.expectedNum = this.selectitem.expectedNum
    this.show = true
  },
  methods: {
    districtEmitComponent (e) {
      this.formCustom.districtId = e.id
    },
    EmitDocksiteComponent (e) {
      this.formCustom.docksiteNo = e.docksiteNo
    },
    handleSubmit (name) {
        let _this = this;
        if(this.formCustom.districtId==""){
          this.$Message.info("片区没有选择")
          return
        }
        if(this.formCustom.docksiteNo==""){
          this.$Message.info("站点没有选择")
          return
        }
        this.pass()
     },
    pass () {
      let _this=this;
      let listdata={
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          id:""+this.formCustom.id,
          districtId:""+this.formCustom.districtId,
          fastFlag:""+this.formCustom.fastFlag,
          solveFlag:""+this.formCustom.solveFlag,
          docksiteNo:this.formCustom.docksiteNo,
          detail:this.formCustom.detail
        })
      }
      this.$api.post('/customerBicycle/update',listdata,reset => {
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
