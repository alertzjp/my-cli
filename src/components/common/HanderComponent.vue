<template>
   <div id="J_Headernav">
      <div class="">
          <span @click="tabs" class="mune-tab fl mr10" v-if="sorshow==0"><Icon type="ios-menu"></Icon></span>
          <span title="返回首页" @click="backindex" class="system-header fl pointer">
            <span class="mr10"><Avatar icon="ios-home" /></span>
            <span v-if="width>480">返回首页</span>
          </span>
      </div>
      <div class="">
         <ul class='headernav'>
           <!-- <li class="headernavlist">
             <Dropdown trigger="hover" @on-click='doMore'>
                  <a href="javascript:void(0)" class="system-header">
                    <span class="mr10"><Avatar icon="ios-stats" /></span>
                     <span v-if="width>480">车辆监控管理</span>
                   </a>
                  <DropdownMenu slot="list">
                      <DropdownItem name='index'>监控统计</DropdownItem>
                      <DropdownItem name='list'>监控列表</DropdownItem>
                      <DropdownItem name='newlist'>新监控</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
           </li> -->
           <li class="headernavlist" style="">
             <Dropdown trigger="hover" @on-click='doMore'>
                  <a href="javascript:void(0)" class="system-header">
                    <span class="mr10"><Avatar icon="md-person" color="#fff" /></span>
                    <span v-if="width>480">{{items.name}}</span>
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem name='loginout'>退出</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
           </li>
         </ul>
      </div>
   </div>
</template>

<script>
export default {
  props:{
    sorshow:{
      default:0
    }
  },
  name: 'Header',
  data () {
    return {
      width:1000,
      items:{
        name:this.$webapi.get('name')
      }
    }
  },
  mounted() {
    //do something after mounting vue instance
    let _this = this;
    this.width = window.innerWidth
    this.$vm.$on("clientWidth",(e)=>{
      if(e>0){
        _this.width = e
      }
    })
  },
  methods: {
     backindex () {
        this.$router.push({
          path:"/admin/index/"
        })
     },
     tabs(){
        this.$emit('headerdata')
     },
     doMore:function (name){
        if(name=="loginout"){
          this.$store.dispatch('TABNAVLIST/increment')
          this.loginout()
        }
        else if(name=="bochuang"){
           window.open("http://qas.umlxny.com/index.html")
        }
        else if(name=="jmev"){
           window.open("http://117.21.76.138:8088/CarinfoMonitor1/index.html")
        }
        else if(name=="cgqc"){
           window.open("http://ev.cgqc.cn:86/")
        }else if(name == "index"){
          window.location.href="/monitorindex/index/"
        }else if(name == "list"){
          window.location.href="/carmonitor/list/"
        }
        else if(name == "newlist"){
          window.location.href="/M/index/"
        }
     },
     loginout:function (){
             let _this = this
             this.$Message.info("退出成功")
             setTimeout(function () {
               _this.$router.push({
                 path:"/login/"
               })
             },1000)
         //     let data = {
         //         token: this.$webapi.get('token')
         //     }
         //     this.$api.post('/admin_account/login_out', data, reset => {
         //       if (reset.codeId === 1) {
         //         _this.$webapi.save('token',"")
         //         _this.$router.push({path:"/login"})
         //       }
         //       else {
         //           _this.$netcode.getApiCode(reset)
         //       }
         // })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  #J_Headernav{
    display: flex;
    flex-direction:row;
    width: 100%;
    flex: 1;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    position: relative;
    background: #fff;
    justify-content:space-between;
    height: 50px;
    position: relative;
    z-index: 10
  }
  .system-header{
    line-height: 50px;
    height: 50px;
    display: block;
    padding: 0 15px;
    color: #666
  }
  .system-header:hover{
    background: #f8f8f8
  }
  .headernav{
    .headernavlist{
      display: inline-block;
    }
  }
  .mune-tab{
    line-height: 50px;
    padding: 0 10px;
    cursor:pointer;
    font-size: 18px;
  }
</style>
