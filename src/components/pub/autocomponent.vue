<template>
  <div id="">
    <Modal v-model="autoshow" :mask-closable="false" @on-cancel="cancel">
      <div slot="header">审核状态</div>
        <Form :label-width="80">
          <FormItem label="审核状态:" >
              <Select v-model="formCustom.status" style="width:200px">
                 <Option value="2">审核通过</Option>
                 <Option value="3">审核不通过</Option>
             </Select>
          </FormItem>
          <FormItem label="原因:" v-if="formCustom.status==3">
                <Input v-model="formCustom.auditOpinion" row="2" type="textarea" placeholder="审核不通过原因" />
          </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel()" size="large">取消</Button>
        <Button type="primary" @click="pass()" style="margin-left: 8px" size="large">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {
      autoshow:true,
      formCustom:{
        status:'2',
        auditOpinion:""
      }
    }
  },
  methods: {
    pass () {
      this.$emit("emitautocomponent",this.formCustom)
    },
    cancel() {
      this.$emit("emitautocomponent",null)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
