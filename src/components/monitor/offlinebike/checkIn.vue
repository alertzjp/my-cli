<template>
  <div class="">
    <Modal v-model="lockshow" width="800" @on-cancel="cancel">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>登记车辆</span>
       </p>
       <div style="text-align:left;">
         <Form ref="formValidate" :model="formCustom"  :label-width="100">
             <Row>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="确认人员:">
                      <maintainer-component @emitmaintainer="emitmaintainer"  v-if="show"  placeholder="请输入确认人员"></maintainer-component>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="车辆二维码">
                       <Input type="text" v-model="formCustom.bicycleNo" placeholder="请输入车辆二维码"></Input>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="车辆状态">
                     <Select v-model="formCustom.status" placeholder="请选择车辆状态">
                       <Option value="">全部</Option>
                       <Option value="1">车辆丢失</Option>
                       <Option value="2">车辆故障</Option>
                     </Select>
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="登记人员">
                        {{$webapi.get('name')}}
                   </FormItem>
                 </div>
               </Col>
               <Col :xs="24" :sm="24" :md="24" :lg="24">
                 <div class="">
                   <FormItem label="离线时间">
                       {{$webapi.gettime('time',formCustom.offLineTime/1000)}}
                   </FormItem>
                 </div>
               </Col>
             </Row>
         </Form>
       </div>
       <div slot="footer">
         <Button type="error" @click="cancel">取消</Button>
         <Button type="primary" @click="ok">保存</Button>
       </div>
    </Modal>
  </div>
</template>
<script>
import maintainerComponent from "../../pub/maintainerIdcomponent.vue"
import timeComponent from "../../pub/timeonecomponent.vue"
export default {
  name: "",
  props:{
    lockshow:{
      default:true,
    },
    selectitem:{
      default:()=>{}
    }
  },
  components: {
    maintainerComponent,
    timeComponent
  },
  data () {
    return {
      maintainerId:'',
      cause:"",
      show:false,
      formCustom:{
      }
    }
  },
  mounted() {
      //do something after mounting vue instance
      this.formCustom = this.selectitem
      this.formCustom.status = '1'
      //this.maintainerId = this.selectitem.principalsId
      this.show = true
  },
  watch:{
    selectitem:{
      handler(val,oldval){
      this.formCustom = val
      },
      deep:true
    }
  },
  methods: {
    emitmaintainer (e) {
      this.maintainerId = e.id
    },
    ok() {
      if(!this.maintainerId){
        this.$Message.info('请选择维护人员');
        return;
      }
      let _this = this
      let data = {
        token:this.$webapi.get("token"),
        maintainerId:this.maintainerId,
        bicycleNo:this.formCustom.bicycleNo,
        status:this.formCustom.status
      }
      this.$api.post('/bicycle_monitor/loss_register',data,reset => {
          if (reset.codeId === 1) {
              _this.$Message.info('登记成功');
              _this.$emit("emitcomponent",true)
          }else{
            _this.$netcode.getApiCode(reset)
          }
      })
    },
    cancel () {
      this.$emit("emitcomponent",false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
