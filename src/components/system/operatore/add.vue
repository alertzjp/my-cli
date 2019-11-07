<template>
  <div class="">
    <Modal v-model="show" width="500" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <Row>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                  <FormItem label="运营商名称:" prop="cardNo" required>
                       <Input v-model="formValidate.name" placeholder="运营商名称" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                  <FormItem label="地区:" prop="cardNo" required>
                       <area-component :areaData="areaData" v-if="show" @areaEmit="areaEmit"></area-component>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                  <FormItem label="具体地址:" prop="cardNo" required>
                       <Input v-model="formValidate.address" placeholder="具体地址" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="24" :sm="24" :md="24" :lg="24">
                  <FormItem label="沉默车图标:">
                      <span class="inline-block widthimgbox mr10 ">
                       <div>
                         <upimg-component @emitimgcomponent="Emitsilent($event,1)" mode="1" :uploadfileList="uploadfileList1" width="26" height="34"></upimg-component>
                       </div>
                       <div>
                         4-6天未点击
                       </div>
                      </span>

                      <span class="inline-block widthimgbox mr10">
                       <div>
                         <upimg-component @emitimgcomponent="Emitsilent($event,2)" mode="1" :uploadfileList="uploadfileList2" width="36" height="48"></upimg-component>
                       </div>
                        <div>
                        4-6天点击
                       </div>
                      </span>

                      <span class="inline-block widthimgbox mr10">
                       <div>
                         <upimg-component @emitimgcomponent="Emitsilent($event,3)" mode="1" :uploadfileList="uploadfileList3" width="26" height="34"></upimg-component>
                       </div>
                        <div>
                        7天及以上未点击
                       </div>
                      </span>

                      <span class="inline-block widthimgbox">
                       <div>
                         <upimg-component @emitimgcomponent="Emitsilent($event,4)" mode="1" :uploadfileList="uploadfileList4" width="36" height="48"></upimg-component>
                       </div>
                        <div>
                        7天及以上点击
                       </div>
                      </span>
                  </FormItem>
                </Col>
              </Row>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="error" @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import areaComponent from "../../pub/iviewarea.vue"
import upimgComponent from '../../pub/upimgcomponent.vue'
export default {
  name: "",
  props:{
    itemList:{
      default () {
        return {}
      }
    }
  },
  components: {
    areaComponent,
    upimgComponent
  },
  data () {
    const validatecardNo = (rule, value, callback) => {
      if (isNaN(Number(value))) {
            callback('维护卡号格式不对,只能是数字');
        } else {
            callback();
        }
   };
    return {
      title:"修改运营商信息",
      show:false,
      loading:false,
      areaData:[],
      uploadfileList1:[],
      uploadfileList2:[],
      uploadfileList3:[],
      uploadfileList4:[],
      formValidate:{
        name:"",
        address:"",
        provinceId:"",
        cityId:"",
        areaId:"",
        notclickicon:"",
        clickicon:"",
        notclickicon7:"",
        clickicon7:"",
       },
      ruleValidate: {
           cardNo: [
             { required: true, message: '维护卡号没有填写', trigger: 'blur' },
             { type: 'string', min:1,max:10,  message: '维护卡号最长10位最小1位',trigger: 'blur' },
             { validator: validatecardNo, trigger: 'blur' }
           ],
       }
    }
  },
  mounted() {
    //do something after mounting vue instance
     this.formValidate.name = this.itemList.name
     this.formValidate.address = this.itemList.address
     this.formValidate.provinceId = this.itemList.provinceId
     this.formValidate.cityId = this.itemList.cityId
     this.formValidate.areaId = this.itemList.areaId
     this.areaData.push(this.itemList.provinceId+"0000")
     this.areaData.push(this.itemList.cityId+"00")
     this.areaData.push(this.itemList.areaId)
     this.show = true
     setTimeout(()=>{
       if(this.itemList.bicycleIconList&&this.itemList.bicycleIconList.length>0){
         this.itemList.bicycleIconList.map((a)=>{
           if(a.bikeFlag==1&&a.iconType==1){
             this.uploadfileList1.push(a.iconUrl)
             this.formValidate.notclickicon=a.iconUrl
           }
           if(a.bikeFlag==1&&a.iconType==2){
             this.uploadfileList2.push(a.iconUrl)
             this.formValidate.clickicon=a.iconUrl
           }
           if(a.bikeFlag==3&&a.iconType==1){
             this.uploadfileList3.push(a.iconUrl)
             this.formValidate.notclickicon7=a.iconUrl
           }
           if(a.bikeFlag==3&&a.iconType==2){
             this.uploadfileList4.push(a.iconUrl)
             this.formValidate.clickicon7=a.iconUrl
           }
         })
       }
     },200)
  },
  computed: {
    comsilentIconUrl () {
      //4-6天未点击@4-6天点击@7天未点击@7天点击
      let reset = "";
      let notclickicon = this.formValidate.notclickicon || []
      let clickicon = this.formValidate.clickicon || []
      let notclickicon7 = this.formValidate.notclickicon7 || []
      let clickicon7 = this.formValidate.clickicon7 || []
      if((notclickicon.length>0 && clickicon.length>0 && notclickicon7.length>0 && clickicon7.length>0)){
          reset = notclickicon + "@" + clickicon + "@" + notclickicon7+ "@" + clickicon7
      }else{
          reset = ""
      }
      return reset
    },
  },
  methods: {
      cancel (e) {
        this.$emit("emitcomponent",e)
      },
      handleSubmit (name) {
        this.addrolepost()
      },
      areaEmit (e) {
        this.formValidate.provinceId = (e[0].code).substring(0,2)
        this.formValidate.cityId = (e[1].code).substring(0,4)
        this.formValidate.areaId = e[2].code
      },
      Emitsilent (item,type) {
        if(type==1){
          this.formValidate.notclickicon = item
        }else if(type==2){
          this.formValidate.clickicon = item
        }else if(type==3){
          this.formValidate.notclickicon7 = item
        }else if(type==4){
          this.formValidate.clickicon7 = item
        }
      },
      addrolepost () {
        if(this.formValidate.name==""){
          this.$Message.info("运营商名称没有填写")
          return
        }
        if(this.formValidate.address==""){
          this.$Message.info("具体地址没有填写")
          return
        }

        if(!this.comsilentIconUrl&&(
          this.formValidate.notclickicon.length>0||
          this.formValidate.clickicon.length>0||
          this.formValidate.notclickicon7.length>0||
          this.formValidate.clickicon7.length>0
        )){
          this.$Message.info("沉默图标没有上传完整")
          return
        }

        let _this = this
         let data = {
            data:{
              operator:{
                name:this.formValidate.name,
                address:this.formValidate.address,
                provinceId:this.formValidate.provinceId,
                cityId:this.formValidate.cityId,
                areaId:this.formValidate.areaId,
                silentIconUrl:this.comsilentIconUrl
              },
              token:this.$webapi.get('token'),
            }
        }
        data.data = JSON.stringify(data.data)
        _this.loading = true
        this.$api.post('/operator/add',data,reset => {
          _this.loading = false
          if (reset.codeId === 1) {
            _this.cancel(true)
          }else{
            _this.$netcode.getApiCode(reset)
          }
        })
      },
      handleReset (name) {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
.iconbox{
  display: flex;
}
.iconbox span{
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
