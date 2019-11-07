<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <div class="pagelist">
          <div class="pagelist-hd">运营商信息</div>
          <div class="pagelist-bd">
            <Form :label-width="80" ref="formCustom" :model="formCustom"  >
               <Row>
                  <Col :xs="24" :sm="24" :md="24" :lg="12">
                    <FormItem label="名称" required>
                         {{formCustom.name}}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :xs="24" :sm="24" :md="24" :lg="12">
                    <FormItem label="地址" prop="unitPrice">
                         {{formCustom.provinceName}}-{{formCustom.cityName}}-{{formCustom.areaName}}-{{formCustom.address}}
                    </FormItem>
                  </Col>
                </Row>
                <Row class="mb10" v-if="isshow">
                  <Col :xs="24" :sm="24" :md="24" :lg="12">
                    <FormItem label="沉默车图标">
                      <div class="iconbox" >
                         <div class="widthimgbox mr10" v-for='item in formCustom.bicycleIconList'>
                            <span class="inline-block bai100">{{changestr(item.bikeFlag,item.iconType)}}</span>
                            <img :src="item.iconUrl" class="maxwidth36" alt="">
                         </div>
                      </div>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :xs="24" :sm="24" :md="12" :lg="12">
                    <FormItem label="" prop="unitPrice">
                      <Button type="primary" @click="add" v-if="$hasPerm('/operator/add')">编辑</Button>
                    </FormItem>
                  </Col>
                </Row>
             </Form>
          </div>
          <div class="page-divider page-divider-horizontal "></div>
      </div>
   </div>
    <add-component v-if="addshow" :itemList="formCustom" @emitcomponent="emitcomponent"></add-component>
   </div>
</template>
<script>
import addComponent from "./add.vue"
export default {
  name: "",
  components: {
    addComponent
  },
  data () {
    return {
      addshow:false,
      formCustom:{}
    }
  },
  computed:{
    isshow(){
      return this.formCustom.bicycleIconList&&this.formCustom.bicycleIconList.length>0?true:false
    },
    changestr(){
      return function(bikeFlag,iconType){
         let str = ""
         if(bikeFlag==1&&iconType==1){
           str = '4-6天未点击'
         }else if(bikeFlag==1&&iconType==2){
           str = '4-6天点击'
         }else if(bikeFlag==3&&iconType==1){
           str = '7天及以上未点击'
         }else if(bikeFlag==3&&iconType==2){
           str = '7天及以上点击'
         }
         return str
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.list()
  },
  methods: {
    add () {
      this.addshow =  true
    },
    emitcomponent (e) {
      this.addshow = false
      if(e){
        this.list()
      }
    },
    list() {
      let _this = this;
      let listdata = {
         data:{
           token:this.$webapi.get('token')
         }
      }
      this.$api.get('/operator/one',listdata,reset => {
        if (reset.codeId === 1) {
           _this.formCustom = reset.resData
        }
        else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .iconbox{
   display: flex;
 }
</style>
