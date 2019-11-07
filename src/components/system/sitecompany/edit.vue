<template>
  <div class="">
    <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
            <span>修改</span>
       </p>
       <div style="text-align:left">
         <div class="">
           <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="100">
               <Row>
                   <Col :xs="24" :sm="24" :md="12" :lg="12">
                      <FormItem label="入驻公司名称" prop="name">
                        <Input type="text" v-model="formCustom.name" placeholder="入驻公司名称"></Input>
                      </FormItem>
                   </Col>
                </Row>
                <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="12">
                       <FormItem label="入驻公司图标" prop="iconUrl">
                           <upimg-component @emitimgcomponent="emitimgcomponent" :uploadfileList="uploadfileList" :editflag="1"></upimg-component>
                       </FormItem>
                    </Col>
                 </Row>
                <Row>
                  <Col :xs="24" :sm="24" :md="12" :lg="12" >
                      <FormItem label="二维码类型" prop="codeType">
                        <Select v-model="formCustom.codeType" >
                            <Option value="" >全部</Option>
                            <Option value="1" >一对一</Option>
                            <Option value="2" >一对多</Option>
                        </Select>
                      </FormItem>
                  </Col>
                 </Row>
                <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="12">
                       <FormItem label="固定电话" prop="telephone">
                         <Input type="text" v-model="formCustom.telephone" placeholder="固定电话" ></Input>
                       </FormItem>
                    </Col>
                 </Row>
                 <Row>
                     <Col :xs="24" :sm="24" :md="12" :lg="12">
                        <FormItem label="联系人" prop="contactName">
                          <Input type="text" v-model="formCustom.contactName" placeholder="联系人"></Input>
                        </FormItem>
                     </Col>
                  </Row>
                  <Row>
                      <Col :xs="24" :sm="24" :md="12" :lg="12">
                         <FormItem label="联系人手机" prop="contactMobile">
                           <Input type="text" v-model="formCustom.contactMobile" placeholder="联系人手机"></Input>
                         </FormItem>
                      </Col>
                   </Row>
                 <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="12">
                       <FormItem label="省市区" required>
                         <area-component @areaEmit="areaEmit" :areaData="area" v-if="show"></area-component>
                       </FormItem>
                    </Col>
                 </Row>
                 <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="24">
                       <FormItem label="具体地址" prop="address">
                         <Input v-model="formCustom.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="具体地址"></Input>
                        </FormItem>
                    </Col>
                 </Row>
                  <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="24">
                       <FormItem label="沉默图标">
                           <span class="inline-block widthimgbox mr50">
                            <div>
                              <upimg-component @emitimgcomponent="Emitsilent($event,1)" mode="1" :uploadfileList="formCustom.nosilentIconUrl" width="26" height="34"></upimg-component>
                            </div>
                            <div>
                              4-6天未点击
                            </div>
                           </span>

                           <span class="inline-block widthimgbox mr50">
                            <div>
                              <upimg-component @emitimgcomponent="Emitsilent($event,2)" mode="1" :uploadfileList="formCustom.silentIconUrl" width="36" height="48"></upimg-component>
                            </div>
                            <div>
                              4-6天点击
                            </div>
                           </span>

                           <span class="inline-block widthimgbox mr50">
                            <div>
                              <upimg-component @emitimgcomponent="Emitsilent($event,3)" mode="1" :uploadfileList="formCustom.nosilentIconUrl7" width="26" height="34"></upimg-component>
                            </div>
                            <div>
                              7天及以上未点击
                            </div>
                           </span>

                           <span class="inline-block">
                            <div>
                              <upimg-component @emitimgcomponent="Emitsilent($event,4)" mode="1" :uploadfileList="formCustom.silentIconUrl7" width="36" height="48"></upimg-component>
                            </div>
                            <div>
                              7天及以上点击
                            </div>
                           </span>
                        </FormItem>
                    </Col>
                 </Row>
                 <Row>
                    <Col :xs="24" :sm="24" :md="12" :lg="24">
                       <FormItem label="外围图标" >
                          <span class="inline-block widthimgbox mr50">
                            <div>
                              <upimg-component @emitimgcomponent="emitperipheralIconUrl($event,1)" mode="1" :uploadfileList="formCustom.noperipheralIconUrl" width="26" height="34"></upimg-component>
                            </div>
                            <div>
                              未点击状态
                            </div>
                           </span>

                           <span class="inline-block">
                            <div>
                              <upimg-component @emitimgcomponent="emitperipheralIconUrl($event,2)" mode="1" :uploadfileList="formCustom.peripheralIconUrl" width="36" height="48"></upimg-component>
                            </div>
                            <div>
                              点击状态
                            </div>
                           </span>
                        </FormItem>
                    </Col>
                 </Row>
                <Row>
                   <Col :xs="24" :sm="24" :md="24" :lg="24">
                     <div class="">
                       <FormItem label="">
                           <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
                       </FormItem>
                     </div>
                   </Col>
               </Row>
           </Form>
         </div>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import areaComponent from '../../pub/iviewarea.vue'
import upimgComponent from '../../pub/upimgcomponent.vue'
export default {
  name: "",
  components: {
    areaComponent,
    upimgComponent
  },
  props:{
    setectitem:{
      default () {
        return {}
      }
    }
  },
 computed: {
    // comsilentIconUrl () {
    //   let reset = "";
    //   let silentIconUrl = this.formCustom.silentIconUrl || []
    //   let nosilentIconUrl = this.formCustom.nosilentIconUrl || []
    //   if((silentIconUrl.length>0 && nosilentIconUrl.length>0)){
    //       reset = silentIconUrl + "@" + nosilentIconUrl
    //   }else{
    //       reset = ""
    //   }
    //   return reset
    // },
    comsilentIconUrl () {
      //4-6天未点击@4-6天点击@7天未点击@7天点击
      let reset = "";
      let silentIconUrl = this.formCustom.silentIconUrl || []
      let nosilentIconUrl = this.formCustom.nosilentIconUrl || []
      let silentIconUrl7 = this.formCustom.silentIconUrl7 || []
      let nosilentIconUrl7 = this.formCustom.nosilentIconUrl7 || []
      if((silentIconUrl.length>0 && nosilentIconUrl.length>0 && silentIconUrl7.length>0 && nosilentIconUrl7.length>0)){
          reset = nosilentIconUrl + "@" + silentIconUrl + "@" + nosilentIconUrl7+ "@" + silentIconUrl7
      }else{
          reset = ""
      }
      return reset
    },
    comperipheralIconUrl () {
      let reset = ""
      let peripheralIconUrl = this.formCustom.peripheralIconUrl || []
      let noperipheralIconUrl =  this.formCustom.noperipheralIconUrl || []
      if((peripheralIconUrl.length>0 && noperipheralIconUrl.length>0)){
          reset = noperipheralIconUrl + "@" + peripheralIconUrl
      }else{
          reset = ""
      }
      return reset
    }
  },
  data () {
    return {
      formCustom:{
          id:"",
          name:"",
          telephone:"",
          contactName:"",
          contactMobile:"",
          provinceCode:"",
          cityCode:"",
          areaCode:"",
          provinceName:"",
          cityName:"",
          areaName:"",
          address:"",
          codeType:'',
          iconUrl:"",
          silentIconUrl:[],
          nosilentIconUrl:[],
          silentIconUrl7:[],
          nosilentIconUrl7:[],
          peripheralIconUrl:[],
          noperipheralIconUrl:[]
      },
      area:[],
      data:{},
      show:false,
      uploadfileList:[],
      loading:false,
      ruleValidate: {
         name: [
             { required: true, message: '入驻公司名称没有填写', trigger: 'blur' }
         ],
         telephone: [
             { required: true, message: '固定电话没有填写', trigger: 'blur' }
         ],
         contactName: [
             { required: true, message: '联系人没有填写', trigger: 'blur' }
         ],
         contactMobile: [
             { required: true, message: '联系人手机没有填写', trigger: 'blur' }
         ],
         address: [
             { required: true, message: '具体地址没有填写', trigger: 'blur' }
         ],
         codeType: [
              { required: true, message: '二维码类型没有选择', trigger: 'change' }
         ],
         iconUrl: [
             { required: true, message: '公司图标没有上传', trigger: 'blur' }
         ],
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
     this.formCustom.id = this.setectitem.id
     this.list()
  },
  methods: {
    emitimgcomponent(e){
      this.formCustom.iconUrl = e[0]
      this.uploadfileList.push(this.formCustom.iconUrl)
    },
     Emitsilent (item,type) {
       if(type==1){
         this.formCustom.nosilentIconUrl = item
       }else if(type==2){
         this.formCustom.silentIconUrl = item
       }else if(type==3){
         this.formCustom.nosilentIconUrl7 = item
       }else if(type==4){
         this.formCustom.silentIconUrl7 = item
       }
    },
    emitperipheralIconUrl (item,type) {
       if(type==1){
        this.formCustom.noperipheralIconUrl = item
      }else{
        this.formCustom.peripheralIconUrl = item
      }
    },
    list () {
      this.loading = true
      this.uploadfileList=[]
      let listdata = {
        token:this.$webapi.get('token'),
        id:this.formCustom.id
      }
      let _this =  this
      this.$api.get('/bicycle_entering_company/getOne',listdata,reset => {
        _this.loading = false
        if (reset.codeId === 1) {
           _this.formCustom.name = reset.resData.name
           _this.formCustom.telephone = reset.resData.telephone
           _this.formCustom.contactName = reset.resData.contactName
           _this.formCustom.contactMobile = reset.resData.contactMobile
           _this.formCustom.provinceCode = reset.resData.provinceCode
           _this.formCustom.cityCode = reset.resData.cityCode
           _this.formCustom.areaCode = reset.resData.areaCode
           _this.formCustom.codeType = ''+reset.resData.codeType
           _this.area = []
           _this.area.push(reset.resData.provinceCode)
           _this.area.push(reset.resData.cityCode)
           _this.area.push(reset.resData.areaCode)
           _this.formCustom.provinceName = reset.resData.provinceName
           _this.formCustom.cityName = reset.resData.cityName
           _this.formCustom.areaName = reset.resData.areaName
           _this.formCustom.address = reset.resData.address
           _this.formCustom.iconUrl = reset.resData.iconUrl
           _this.uploadfileList.push(reset.resData.iconUrl)
           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==1 && item.iconType==1)){
             _this.formCustom.nosilentIconUrl = []
             _this.formCustom.nosilentIconUrl.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==1 && item.iconType==1).iconUrl)
           }
           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==1 && item.iconType==2)){
              _this.formCustom.silentIconUrl = []
              _this.formCustom.silentIconUrl.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==1 && item.iconType==2).iconUrl)
           }
           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==3 && item.iconType==1)){
             _this.formCustom.nosilentIconUrl7 = []
             _this.formCustom.nosilentIconUrl7.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==3 && item.iconType==1).iconUrl)
           }
           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==3 && item.iconType==2)){
              _this.formCustom.silentIconUrl7 = []
              _this.formCustom.silentIconUrl7.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==3 && item.iconType==2).iconUrl)
           }

           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==2 && item.iconType==1)){
             _this.formCustom.noperipheralIconUrl = []
             _this.formCustom.noperipheralIconUrl.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==2 && item.iconType==1).iconUrl )
           }
           if(reset.resData.bicycleIconList.find(item=>item.bikeFlag==2 && item.iconType==2)){
             _this.formCustom.peripheralIconUrl = []
             _this.formCustom.peripheralIconUrl.push(reset.resData.bicycleIconList.find(item=>item.bikeFlag==2 && item.iconType==2).iconUrl)
           }
           _this.show = true
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    cancel () {
      this.$emit("EmitComponent",false)
    },
    EmitversionComponent (e) {
      this.formCustom.id = e.id
    },
    areaEmit (e) {
      this.formCustom.provinceCode = e[0].code
      this.formCustom.cityCode = e[1].code
      this.formCustom.areaCode = e[2].code
      this.formCustom.provinceName = e[0].name
      this.formCustom.cityName = e[1].name
      this.formCustom.areaName = e[2].name
    },
    handleSubmit (name) {
      let _this = this;
       this.$refs[name].validate((valid) => {
           if (valid) {
               _this.addpost()
           }
       })
     },
    addpost () {
      let _this = this;
      // if((this.formCustom.silentIconUrl.length>0 && this.formCustom.nosilentIconUrl.length<=0) || (this.formCustom.silentIconUrl.length<=0 && this.formCustom.nosilentIconUrl.length>0)){
      //   this.$Message.info("沉默图标没有上传完整")
      //   return
      // }

      if(!this.comsilentIconUrl&&(
        this.formCustom.silentIconUrl.length>0||
        this.formCustom.nosilentIconUrl.length>0||
        this.formCustom.silentIconUrl7.length>0||
        this.formCustom.nosilentIconUrl7.length>0
      )){
        this.$Message.info("沉默图标没有上传完整")
        return
      }

      if((this.formCustom.peripheralIconUrl.length>0 && this.formCustom.noperipheralIconUrl.length<=0) || (this.formCustom.peripheralIconUrl.length<=0 && this.formCustom.noperipheralIconUrl.length>0)){
        this.$Message.info("外围图标没有上传完整")
        return
      }

      let listdata = {
          token:this.$webapi.get("token"),
          name:this.formCustom.name,
          telephone:this.formCustom.telephone,
          contactName:this.formCustom.contactName,
          contactMobile:this.formCustom.contactMobile,
          provinceCode:this.formCustom.provinceCode,
          cityCode:this.formCustom.cityCode,
          areaCode:this.formCustom.areaCode,
          provinceName:this.formCustom.provinceName,
          cityName:this.formCustom.cityName,
          areaName:this.formCustom.areaName,
          address:this.formCustom.address,
          id:this.formCustom.id,
          codeType:this.formCustom.codeType,
          iconUrl:this.formCustom.iconUrl,
          silentIconUrl:this.comsilentIconUrl,
          peripheralIconUrl:this.comperipheralIconUrl
      }
      this.$api.post('/bicycle_entering_company/update',listdata,reset => {
        if (reset.codeId == 1) {
          _this.$Message.success('修改成功');
          _this.$emit("EmitComponent",true)
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>

</style>
