<style lang="less" scoped>
body{
    background: #495060;
}
.layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.web-shell{
    width: 100%;
    height: 100vh;
    display: flex;
    flex: 1;
    flex-direction: column;
}
.web-shell-hd{
    width: 100%;
    height: 60;
}
.web-shell-bd{
    flex:1;
    overflow-y:auto;
}
.mermber-logo{
  float:left;
  color:#fff;
  font-size:20px;
}
.fold-enter-active {
  animation-name: fold-in;
  animation-duration: .5s;
}
.fold-leave-active {
  animation-name: fold-out;
  animation-duration: .5s;
}
@keyframes fold-in {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  50% {
    transform: translate3d(0, 50%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fold-out {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 50%, 0);
  }
  100% {
    transform: translate3d(0, 100%, 0);
  }
}
.adminlayout{
  display: flex;
  flex: 1;
  width: 100%;
  /* height: 100%; */
  min-height: 100vh;
  flex-direction: column;
}

.notice-websocket-css{
  right: -600px;
  animation:myfirst2 5s;
  -webkit-animation:myfirst2 5s; /* Safari and Chrome */
  animation-fill-mode:forwards;
}
  .notice-websocket-css-none{
    right: 20px;
    animation:myfirst 5s;
    -webkit-animation:myfirst 5s; /* Safari and Chrome */
    animation-fill-mode:forwards;
  }

@keyframes myfirst
{
  0%   { right:20px; }
  25%  { right:-400px; }
  100%  { right:-600px; }
}

@-webkit-keyframes myfirst /* Safari and Chrome */
{
  0%   { right:20px; }
  25%  {right:-400px; }
  100%  { right:-600px; }
}

@keyframes myfirst2
{
  0%   { right: -400px; }
  25%  { right: 20px; }
  100%  { right: 20px; }
}

@-webkit-keyframes myfirst2 /* Safari and Chrome */
{
  0%   { right: -400px; }
  25%  {right: 20px; }
  100%  { right: 20px; }
}

.notice-websocket-css-begin{
  right: -600px;
}
.notice-websocket-css-normal{
  position: fixed;
  bottom: 50px;
  width: 350px;
  height: 200px;
  z-index: 1000;
}
</style>
<template>
    <div class="layout">
      <Layout>
        <Row>
            <Col :style="widthdata" v-if="sideshow">
              <Side-menu  :height="sideHeight" v-if="cententWidth>=1285" ></Side-menu>
              <MSide-menu :height="sideHeight" v-if="cententWidth<1285"></MSide-menu>
            </Col>
            <Col :style="widthdataright" >
              <div class="web-shell">
                <div class="web-shell-hd">
                 <header-component @headerdata="headerdata"></header-component>
                </div>
                <div class="">
                   <tabNav></tabNav>
                  <breadcrumb-component></breadcrumb-component>
                </div>
                <div class="web-shell-bd" id="webshellbd">
                  <Content v-show="show" class="adminlayout">                     
                     <transition name="fade">
                        <router-view ></router-view> 
                        <!-- <keep-alive v-if="keepAlive">
                          <router-view></router-view>                           
                        </keep-alive>
                        <router-view v-if="!keepAlive"></router-view>   -->
                     </transition>
                     <div v-show="noticeflag" :class="[activeClass,otherClass]" >
                       <notice-component @EmitnoticeComponent="EmitnoticeComponent"></notice-component>
                     </div>
                  </Content>
                </div>
              </div>
            </Col>
        </Row>
      </Layout>
    </div>
</template>
<script>
  import SideMenu from '../components/common/SideComponent'
  import MSideMenu from '../components/common/MSideComponent'
  import HeaderComponent from '../components/common/HanderComponent'
  import breadcrumbComponent from '../components/common/breadcrumbComponent'
  import noticeComponent from './pub/noticecomponent.vue'
  export default {
    name: 'index',
    components: {
      HeaderComponent:HeaderComponent,
      SideMenu:SideMenu,
      MSideMenu,
      breadcrumbComponent,
      noticeComponent,
    },
    data () {
      return {
        sideshow:false,
        show:true,
        sideHeight:0,
        muneheight:100,
        widthnum:220,
        cententWidth:0,
        widthdata:{},
        widthdataright:{},
        DrawerShow:false,
        noticeflag:false,
        activeClass:'notice-websocket-css-begin',
        otherClass: 'notice-websocket-css-normal',
        styles: {
            overflow: 'hidden',
            padding: '0',
            position: 'static',
            background:'#001529'
         },
      }
  },
  beforeDestroy () {
    this.$vm.$off('callbackEnter')
  },
  computed: {
    keepAlive () {
      const list = this.$route.meta.keepAlive?true:false
      console.log(list)
      return list
    }
  },
  mounted() {
    //do something after mounting vue instance
      let _this = this
      this.sideHeight = window.innerHeight-64
      this.cententWidth = window.innerWidth
      this.$store.commit('GETSETlIST/increment',{
        width:window.innerWidth,
        height:window.innerHeight
      })
      if(window.innerWidth<=1285){
        this.widthnum = 0
      }else if(window.innerWidth>1285){
        this.widthnum = 220
        this.cententWidth = this.cententWidth
      }
      this.widthdata = {
        width:this.widthnum+"px",
        float:"left",
        background:"#001529",
        "box-shadow":"2px 0 6px rgba(0,21,41,.35)",
        "webkit-box-shadow":"2px 0 6px rgba(0,21,41,.35)",
         position: "relative",
         "z-index":100,
         overflow:"hidden"
      }
      this.widthdataright = {
        display:"block",
        "margin-left":this.widthnum+"px",
        width:(this.cententWidth-this.widthnum)+"px"
      }
      this.watchwidth()
      this.enter()
  },
  watch:{
    widthnum:function (a,c){
      this.widthdata = {
        width:this.widthnum+"px",
        float:"left",
        background:"#001529",
        "box-shadow":"2px 0 6px rgba(0,21,41,.35)",
        "webkit-box-shadow":"2px 0 6px rgba(0,21,41,.35)",
         position: "relative",
         "z-index":100,
          overflow:"hidden"
      }
      this.widthdataright = {
        display:"block",
        "margin-left":this.widthnum+"px",
         width:(this.cententWidth-this.widthnum)+"px"
      }
    },
    cententWidth:{
      handler (val,oldval) {
        this.sideshow = false
        this.widthdata = {
          width:this.widthnum+"px",
          float:"left",
          background:"#001529",
          "box-shadow":"2px 0 6px rgba(0,21,41,.35)",
          "webkit-box-shadow":"2px 0 6px rgba(0,21,41,.35)",
           position: "relative",
           "z-index":100,
            overflow:"hidden"
        }
        this.widthdataright = {
          display:"block",
          "margin-left":this.widthnum+"px",
           width:(this.cententWidth-this.widthnum)+"px"
        }
        this.sideshow = true
      },
      deep:true
    },
  },
  methods: {
     EmitnoticeComponent(flag){
        let _this = this;
        if(flag == false){
            _this.activeClass = 'notice-websocket-css-none';
        }else{
          _this.noticeflag = true;
          _this.activeClass = 'notice-websocket-css';
        }
    },
    enter () {
      let _this = this;
      document.onkeydown = function(e) {
          e = e || window.event;
          if(e.keyCode == 13) {
             if(e.srcElement.localName=="body"){
               if(_this.$route.path!=="/login/"){
                  _this.$vm.$emit("callbackEnter")
               }
             }else{
               var itemindex = 0
               if(e.target.parentNode.innerText.indexOf("跳至")!=-1){
                  itemindex =1
               }
               if(itemindex==0){
                 if(_this.$route.path!=="/login/"){
                    _this.$vm.$emit("callbackEnter")
                 }
               }
             }
              return false
          }
      }
    },
    headerdata() {
        this.cententWidth = window.innerWidth
         if(this.cententWidth>1285){
         if(this.widthnum==220){
           this.widthnum=0
         }else{
           this.widthnum=220
           this.$vm.$emit("H5open",this.cententWidth)
          }
       }else{
         this.$vm.$emit("H5open",this.cententWidth)
         this.widthnum=0
       }
    },
    watchwidth () {
      let _this = this
      window.onresize = function () {
        _this.sideHeight = window.innerHeight-64
        _this.$store.commit('GETSETlIST/increment',{
          width:window.innerWidth,
          height:window.innerHeight
        })
        if(window.innerWidth<=1285){
          _this.widthnum = 0
          _this.cententWidth = window.innerWidth
        }else if(window.innerWidth>1285){
          _this.widthnum = 220
          _this.cententWidth = window.innerWidth
        }
        _this.$vm.$emit("clientWidth",_this.cententWidth)
      }
    }
  }
}
</script>
