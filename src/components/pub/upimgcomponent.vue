<template>
  <div class="">
    <div class="demo-upload-list" v-for="item in uploadList"  v-if="uploadList.length>0" style="width: 60px;height:60px;line-height: 60px;">
        <div>
            <img :src="item">
            <div class="demo-upload-list-cover">
                 <!-- <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon> -->
                 <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                <!-- <Button size="small"  type="info" @click.native="handleView(item)">查看</Button>
                <Button size="small" type="error" @click.native="handleRemove(item)" v-if="!readonly">删除</Button> -->
            </div>
        </div>
    </div>
    <div class="" v-if="model==1&&uploadList.length!=1" style="display: inline-block;width:60px;">
    <Upload
    ref="upload"
    :action="commonurl"
    :header="header"
    :format="format"
    :show-upload-list ="false"
    :Accept="Accept"
    name="mainpic"
    type="drag"
    :on-success="handleSuccess"
    :before-upload="handleBeforeUpload"
    style="display: inline-block;width:60px;">
    <div style="width: 60px;height:60px;line-height: 60px;">
        <Icon type="ios-camera" size="20"></Icon>
    </div>
    </Upload>
    </div>
  </div>
</template>
<script>
    export default {
        props:{
          readonly:{
            default:false
          },
          editflag:{
            default:false
          },
          uploadfileList:{
            type:Array,
            default(){
              return []
            }
          },
          width:{
            default () {
              return 0
            }
          },
          height:{
            default () {
              return 0
            }
          },
          "model":{
            default:1
          },
        },
        data () {
            return {
                commonurl: this.$webcommon + "/pic/upload/",
                header: {
                    'Content-Type': 'multipart/form-data'
                },
                format: ['jpg', 'jpeg', 'png','gif'],
                Accept: "application/json",
                defaultList: [],
                imgName: '',
                visible: false,
                disabled:true,
                uploadList: []
            }
        },
        methods: {
            addfile () {
               let _this = this;
               let option = {
                  title:"确认提示",
                  content:"确认一下，上传文件和合同是否正确，确认了就不可以编辑了",
                  yes:function () {
                    _this.$emit("uploadFile",_this.uploadList)
                  }
               }
               this.$webapi.getMessinfo(option)
            },
            handleView (name) {
              this.$webapi.getimg(name)
            },
            handleBeforeUpload (file) {
              let _this = this;
              if(this.width!=0 || this.height!=0){
                 return this.checkImageWH(file,_this.width,_this.height)
              }
           },
           //限制图片宽高度
          checkImageWH(file, width, height) {
              let self = this;
              return new Promise(function (resolve, reject) {
                  let filereader = new FileReader();
                  filereader.onload = e => {
                      let src = e.target.result;
                      const image = new Image();
                      image.onload = function () {
                          if (width && this.width>1000) {
                              self.$Notice.error({
                                  title: "请上传宽不能超过1000px的图片",
                              });
                              reject();
                          } else if (height && this.height>1000) {
                              self.$Notice.error({
                                  title: "请上传高不能超过1000px的图片",
                              });
                              reject();
                          } else {
                              resolve();
                          }
                      };
                      image.onerror = reject;
                      image.src = src;
                  };
                  filereader.readAsDataURL(file);
              });
           },
            handleRemove (file) {
                let _this = this;
              //   this.uploadList.forEach((a,index)=>{
              //     if(a==file){
              //       _this.uploadList.splice(index,1)
              //       return
              //     }
              //   })
              // this.$emit("emitimgcomponent",this.uploadList)
              this.uploadList=[];
              this.$emit("emitimgcomponent",this.uploadList)
            },
            handleSuccess (response, file, fileList) {
                  this.uploadList=[]
                  this.uploadList.push(response.resData)
                  this.$emit("emitimgcomponent",this.uploadList)
            }
        },
        mounted () {
           this.disabled = this.uploadList.length<1
           this.uploadList = this.uploadfileList
           this.defaultList = this.uploadfileList
            //this.uploadList = this.$refs.upload.fileList;
           setTimeout(()=>{
                if(this.uploadfileList.length>0){
                  this.uploadList=this.uploadfileList
                }else{
                  this.uploadList=[]
                }
            },300)

        }
    }
</script>
<style scoped>

    .demo-upload-list{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        /* width: 100%;
        height: 100%; */
        max-width: 100%;
        max-height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

</style>
