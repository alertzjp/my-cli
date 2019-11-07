<template>
  <div class="" style="text-align:left">
      <div class="urltxt" v-for="(item,index) in items" v-if="items.length>0">
          {{item.path}} <span @click="handleRemove(index)"><Icon type="ios-close-circle" /></span>
     </div>
     <Progress :percent="percent" :stroke-width="5" v-if="Progressshow"></Progress>
     <div class="" v-if="items.length<1">
       <Upload
       :action="commonurl"
       :header="header"
       :show-upload-list ="false"
       :Accept="Accept"
       :format="format"
       name="mainpic"
       :on-success="onsuccess"
       :on-progress="onprogress"
       :before-upload="beforeupload"
       style="text-align:left">
           <Button icon="ios-cloud-upload-outline">上传文件</Button>
       </Upload>
     </div>
  </div>
</template>
<script>
let InterValObj
export default {
  props:{
    "uploadsizenum":{
      default:1
    },
    "fileloading":{
      default:""
    },
    "model":{
      default:1
    },
    "skuindex":String
  },
  created() {
    //do something after creating vue instance
  },
  data() {
      return {
          uploadnum:0,
          modelstyle:1,
          Progressshow:false,
          percent:0,
          items:[],
          commonurl: this.$webcommon + "/pic/upload/",
          header: {
              'Content-Type': 'multipart/form-data'
          },
          Accept: "application/json"
      }
    },
    mounted() {
      //do something after mounting vue instance
      this.percent = 0
      if(this.fileloading){
        let data = {
          path:this.fileloading
        }
       this.items.push(data)
      }
    },
    methods: {
      beforeupload () {
        this.percent = 0
      },
      onprogress (){
        this.Progressshow = true
        InterValObj = window.setInterval(this.SetRemainTime, 1000);
      },
      SetRemainTime () {
        if (this.percent == 99) {
            window.clearInterval(InterValObj)
            return
        }
        else {
          this.percent = this.percent+1
        }
      },
      handleRemove (index) {
         this.percent = 0
         this.items.splice(index,1)
         this.$emit('fileComponent',this.items)
      },
      beforeupload() {
        this.percent = 0
      },
      onsuccess(response, file, fileList) {
         window.clearInterval(InterValObj)
         this.Progressshow = false
         this.items.push({
           path:response.resData
         })
         this.$emit('fileComponent',response.resData)
      }
    }
}
</script>
<style>
.upfile{
  display: inline-block;
  width:60px;
  height: 60px;
  text-align: center;
  border: 1px #999 dashed;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 10px;
}
.urltxt{
  word-break: break-all;
}
</style>
