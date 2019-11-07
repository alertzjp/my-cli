<template>
  <div class="" id="canvas">
    <div class="loginbox" >
       <div class="loginbox-hd"></div>
       <div class="loginbox-bd">
         <Form :model="formItem"  ref="formItem"  :rules="ruleCustom" :label-width="0">
          <div class="login-item">
             <FormItem label="" prop="mobile">
               <Input v-model="formItem.mobile" placeholder="用户名" size="large" style="margin-bottom:10px"></Input>
             </FormItem>
          </div>
          <div class="login-item">
            <div class="" v-if="passwordshow">
              <FormItem label="" prop="password">
                <Input type="password" v-model="formItem.password" placeholder="请输入密码"  size="large" icon="md-eye" autocomplete="off" @on-click="password01()"></Input>
              </FormItem>
            </div>
            <div class="" v-else>
              <FormItem label="" prop="password">
                <Input v-model="formItem.password" placeholder="请输入密码" icon="md-eye-off"  size="large" @on-click="password01()"></Input>
              </FormItem>
            </div>
           </div>
          <div class="loginBtn">
            <span @click="handleSubmit('formItem')"><Button type="primary" size="large"  long >登录</Button></span>
           </div>
           </Form>
       </div>
    </div>
  </div>
</template>
<script>
let axios = require('axios')
export default {
  name: 'login',
  data () {
    return {
      passwordshow:true,
      formItem:{
        mobile: "",
        password: "",
      },
      ruleCustom: {
          mobile: [
              { required: true, message: '用户名称没有填写', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '密码没有填写', trigger: 'blur' }
          ],
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.$webapi.save('token',"")   
    this.$webapi.removeItem("addItem")
    this.$webapi.removeItem("areaType")
    this.$webapi.removeItem("emitData")
    this.canvas()
    this.enter()     
    window.sessionStorage.setItem("NavList", JSON.stringify([])) 
    window.sessionStorage.setItem("searchList", JSON.stringify([]))   
  },
  methods: {
    canvas () {
            /**
       *3D海洋效应与 Canvas2D
       * 您可以更改注释 "效果属性" 下的属性
       */

       // Init Context
        let c = document.createElement('canvas').getContext('2d')
        let postctx = document.body.appendChild(document.createElement('canvas')).getContext('2d')
        let canvas = c.canvas
        let vertices = []

        // Effect Properties
        let vertexCount = 7000
        let vertexSize = 3
        let oceanWidth = 204
        let oceanHeight = -80
        let gridSize = 32;
        let waveSize = 16;
        let perspective = 100;

        // Common variables
        let depth = (vertexCount / oceanWidth * gridSize)
        let frame = 0
        let { sin, cos, tan, PI } = Math

        // Render loop
        let loop = () => {
        let rad = sin(frame / 100) * PI / 20
        let rad2 = sin(frame / 50) * PI / 10
        frame++
        if (postctx.canvas.width !== postctx.canvas.offsetWidth || postctx.canvas.height !== postctx.canvas.offsetHeight) {
         postctx.canvas.width = canvas.width = postctx.canvas.offsetWidth
         postctx.canvas.height = canvas.height = postctx.canvas.offsetHeight
        }


        c.fillStyle = `hsl(200deg, 100%, 2%)`
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.save()
        c.translate(canvas.width / 2, canvas.height / 2)

        c.beginPath()
        vertices.forEach((vertex, i) => {
         let ni = i + oceanWidth
         let x = vertex[0] - frame % (gridSize * 2)
         let z = vertex[2] - frame * 2 % gridSize + (i % 2 === 0 ? gridSize / 2 : 0)
         let wave = (cos(frame / 45 + x / 50) - sin(frame / 20 + z / 50) + sin(frame / 30 + z*x / 10000))
         let y = vertex[1] + wave * waveSize
         let a = Math.max(0, 1 - (Math.sqrt(x ** 2 + z ** 2)) / depth)
         let tx, ty, tz

         y -= oceanHeight

         // Transformation variables
         tx = x
         ty = y
         tz = z

         // Rotation Y
         tx = x * cos(rad) + z * sin(rad)
         tz = -x * sin(rad) + z * cos(rad)

         x = tx
         y = ty
         z = tz

         // Rotation Z
         tx = x * cos(rad) - y * sin(rad)
         ty = x * sin(rad) + y * cos(rad)

         x = tx;
         y = ty;
         z = tz;

         // Rotation X

         ty = y * cos(rad2) - z * sin(rad2)
         tz = y * sin(rad2) + z * cos(rad2)

         x = tx;
         y = ty;
         z = tz;

         x /= z / perspective
         y /= z / perspective



         if (a < 0.01) return
         if (z < 0) return


         c.globalAlpha = a
         c.fillStyle = `hsl(${180 + wave * 20}deg, 100%, 50%)`
         c.fillRect(x - a * vertexSize / 2, y - a * vertexSize / 2, a * vertexSize, a * vertexSize)
         c.globalAlpha = 1
        })
        c.restore()

        // Post-processing
        postctx.drawImage(canvas, 0, 0)

        postctx.globalCompositeOperation = "screen"
        postctx.filter = 'blur(16px)'
        postctx.drawImage(canvas, 0, 0)
        postctx.filter = 'blur(0)'
        postctx.globalCompositeOperation = "source-over"

        requestAnimationFrame(loop)

        let data = document.getElementsByTagName("canvas");
            data[0].style.width = window.innerWidth +"px"
        }

        // Generating dots
        for (let i = 0; i < vertexCount; i++) {
        let x = i % oceanWidth
        let y = 0
        let z = i / oceanWidth >> 0
        let offset = oceanWidth / 2
        vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize])
        }

        loop()
    },
    enter () {
      let _this = this;
      document.onkeydown = function(e) {
          e = e || window.event;
          if(e.keyCode == 13) {
              if(_this.$route.path=="/login/"){
                _this.login()
              }
              return false
          }
      }
    },
    password01 () {
      this.passwordshow = !this.passwordshow
    },
    handleSubmit (name) {
      let _this = this;
      this.$refs[name].validate((valid) => {
          if (valid) {
              _this.login()
          }
      })
    },
    login (e) {
      let _this = this
      let data = {
        data:JSON.stringify({
          name:this.formItem.mobile,
          password:this.formItem.password
        })
      }    
      this.$api.post("/login", data, reset => {
        if (reset.codeId === 1) {
            let data = reset.resData             
            _this.$webapi.save('token',data.token)
            _this.$webapi.save('status',data.status)
            _this.$webapi.save('accountType',data.flag)
            _this.$webapi.save('name',data.name)
            _this.$webapi.save('expTime',new Date().getTime())             
            window.location.href='/admin/index/'
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less" scoped="">
    canvas {
      width: 100%!important
    }
    #canvas{
      width: 100%;
      height: 100%;
      overflow:hidden;
      canvas{
        width: 100%;
        height: 100%
      }
    }
    .loginBtn{
      display:flex;
      flex-direction: row;
      width: 100%;
      margin-top: 20px;
      span{
        flex:1;
        padding: 0 5px;
      }
      .ivu-btn-large{
        height: 50px
      }
    }
    .loginbox{
       border-radius:2px;
       width: 400px;
       position: absolute;
       left:50%;
       top:50%;
       margin-left: -200px;
       margin-top: -200px;
      .loginbox-hd{
        text-align: left;
        height: 60px;
        line-height: 60px;
        text-align:center;
        border-radius: 15px 15px 0 0;
        font-size: 24px;
        font-weight: normal;
        color: #fff;
        padding: 0 50px;
        width:100%;
        background: url("../assets/login_logo.png") center center no-repeat
      }
      .loginbox-bd{
        padding: 30px;
        .ivu-input{
          background: #263342!important;
          border: #49525c 1px solid!important;
          color: #fff!important;
        }
        .login-item{
          margin-bottom: 20px;
        }
      }
    }
</style>
