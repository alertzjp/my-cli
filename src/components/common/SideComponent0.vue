<template>
   <div class="SideMenuComponent">
        <div class="mermber-logo">
           <div class="member-logo-left">
             <i></i>
           </div>
          <div class="member-logo-hd">
            <div class="substyle">运营商管理后台<version></version></div>
          </div>
          </div>
        <div class="">
            <Scroll :height='muneheight'>
                <Menu v-if="items.length>0" theme="light" width="auto" :theme="theme2" :open-names="opennames"  ref="child" :active-name="activename"  @on-select="changeMenu" accordion>
                      <div class="">
                        <Submenu :name="index" v-for="(item,index) in items" v-if="item.isShow!=-1" >
                            <template slot="title">
                                <span v-if="item.icon"><Icon :type="item.icon"></Icon></span>
                                <span v-else><Icon type="ios-navigate"></Icon></span>
                                {{item.name}}
                            </template>
                              <MenuItem :name="index+'-'+itemlistindex" v-for="(itemlist,itemlistindex) in item.resourcesList" v-if="itemlist.isShow!=-1">
                                 {{itemlist.name}} {{itemlist.isshow}}
                              </MenuItem>
                        </Submenu>
                   </div>
               </Menu>
            </Scroll>
          </div>
          <div class="">
            <Drawer title="" :scrollable="false" placement="left" :closable="false" :styles="styles" v-model="DrawerShow" >
              <Scroll :height='muneheight'>
                  <Menu v-if="items.length>0" theme="light" width="auto" :theme="theme2" :open-names="opennames"  ref="child" :active-name="activename"  @on-select="changeMenu" accordion>
                        <div class="">
                          <Submenu :name="index" v-for="(item,index) in items" v-if="item.isShow!=-1" >
                              <template slot="title">
                                  <span v-if="item.icon"><Icon :type="item.icon"></Icon></span>
                                  <span v-else><Icon type="ios-navigate"></Icon></span>
                                  {{item.name}}
                              </template>
                                <MenuItem :name="(index)+'-'+(itemlistindex)" v-for="(itemlist,itemlistindex) in item.resourcesList" v-if="itemlist.isShow!=-1">
                                   {{itemlist.name}} {{itemlist.isshow}}
                                </MenuItem>
                          </Submenu>
                     </div>
                 </Menu>
              </Scroll>
           </Drawer>
      </div>
   </div>
</template>
<script>
export default {
  name: 'SideMenu',
  props:["height"],
  data () {
    return {
       activename:'',
       opennames:[],
       items:[],
       title:"",
       muneheight:"",
       theme2:'dark',
       userTypeName:1,
       DrawerShow:false,
       Ismobile:false,
       styles: {
           overflow: 'hidden',
           padding: '0',
           position: 'static',
           background:'#001529'
        },
    }
  },
  //获取菜单内容，是否缓存内容存在，如果没有，就重新获取，已存在，就从缓存里面获取
  beforeCreate () {
    let _this = this
    let data = {
      token:this.$webapi.get('token')
    }
    this.$api.get('/roleResources/getOne',data,reset => {
        if (reset.codeId === 1) {
            let data = reset.resData
            _this.items = data
            _this.items.sort(_this.compare('resourcesOrder'))
            _this.items.forEach(function (a){
              if(a.resourcesList.length>0){
                a.resourcesList.sort(_this.compare('resourcesOrder'))
              }
            })
            _this.$store.commit('PermissionList/increment',_this.GETRESOURCE(data))
            _this.updateOpened()
        }else {
          _this.$netcode.getApiCode(reset)
      }
    })
  },
  mounted() {
    //do something after mounting vue instance
    let _this = this;
    this.muneheight = this.height || 0
    this.userTypeName = this.$webapi.get('accountType') || 1
    this.userType()
     this.$vm.$on("submune",(e)=>{
      if(e>=1280){
        _this.DrawerShow = false
        _this.Ismobile = false
      }else{
        _this.DrawerShow = false
        _this.Ismobile = true
      }
    })
    //this.getMune()
   },
  methods: {
    getMune () {
       this.$nextTick(()=> {
         this.$refs.child.updateOpened();
         this.$refs.child.updateActiveName();
       });
    },
    updateOpened () {

    },
    list () {
        let _this = this
        let data = {
          token:this.$webapi.get('token')
        }
        this.$api.get('/roleResources/getOne',data,reset => {
            if (reset.codeId === 1) {
                let data = reset.resData
                _this.items = data
                _this.items.sort(_this.compare('resourcesOrder'))
                _this.items.forEach(function (a){
                  if(a.resourcesList.length>0){
                    a.resourcesList.sort(_this.compare('resourcesOrder'))
                  }
                })
                _this.$store.commit('PermissionList/increment',_this.GETRESOURCE(data))
                _this.updateOpened()
            }else {
              _this.$netcode.getApiCode(reset)
          }
        })
    },
    GETRESOURCE (DATA){
      let reset = []
      let _this =  this;
      DATA.forEach((a)=>{
        if(a.resourcesList && a.resourcesList.length>0){
          reset = _this.GETITEMRESOURCE(reset,a.resourcesList)
        }else{
          reset.push(a.url)
        }
      })
      return reset
    },
    GETITEMRESOURCE (data,resourcesList) {
      let reset = data || []
      let _this =  this;
      resourcesList.forEach((a)=>{
        if(a.resourcesList && a.resourcesList.length>0){
          reset = _this.GETITEMRESOURCE(reset,a.resourcesList)
        }else{
          reset.push(a.url)
        }
      })
      return reset
    },
    close () {
      this.DrawerShow = false
    },
    userType () {
      let userType =this.$webapi.get('accountType')
          if(userType==1){
            this.title =  this.$webapi.get('username')
          }
          if(userType==2){
            this.title = this.$webapi.get('username')
          }
    },
    compare (property) {
      return function(a,b){
          let value1 = a[property];
          let value2 = b[property];
          return  value1 - value2  ;
      }
    },
    changeMenu (e) {
      let muneindex = e.split("-")[0]
      let itemindex = e.split("-")[1]
      this.$router.push({path:this.items[muneindex].resourcesList[itemindex].path})
      if(window.innerWidth<=1280){
        this.$vm.$emit("subMune",{
          DrawerShow:false
        })
      }
    },
  },
  watch:{
    Ismobile:{
        handler(val,oldval){
          this.Ismobile = val
        },
        deep:true
     },
     height:function (e) {
       this.muneheight = this.height
     },
     opennames:{
       handler () {
         this.getMune()
       },
       deep:true
     },
     '$route':function (to, from) {
       let _this = this;
       this.items.forEach((a,index)=>{
         if(a.isShow!=-1){
           a.resourcesList.forEach((b,bindex)=>{
             if(b.path.indexOf((to.matched[(to.matched.length)-1].path))>-1){
               _this.opennames = []
               _this.opennames.push(index)
               _this.activename = ''+index+'-'+bindex
             }
           })
         }
       })
     },
     activename:{
       handler (val,oldval) {

       },
       deep:true
     }
  }
}
</script>

<style lang="less">
.SideMenuComponent .subitemest{
  color: #fff
}
.mermber-logo{
  position: relative;
  -webkit-transition: all .3s;
  transition: all .3s;
  background: #002140;
  overflow: hidden;
  color: #f8f8f8;
  text-align: center;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  .tip{
    position: absolute;
    left:0;
    top:0;
    background: #f90;
    cursor: #fff;
    padding: 5px 10px;
    border-radius: 0 0 5px 5px;
  }
}
.member-logo-left{
  width: 50px;
  padding: 10px 0 0 10px;
  i{
   display: inline-block;
   vertical-align: middle;
   background:url(../../assets/logo.png);
   background-repeat: no-repeat;
   background-size: 35px;
   width: 40px;
   height: 40px;
   margin-right: 10px;
 }
}
.mermber-logo .member-logo-hd{
  display: block;
  font-size: 18px;
  padding: 10px;
  text-align: left;
  .substyle{
    font-size: 16px;
    color: #fff
  }
  .subcompanytxt{
    font-size: 14px;
    color: #f8f8f8
  }
}
.ivu-scroll-container{
    overflow-y:auto!important
}
.ivu-menu-dark{
   background: #001529!important
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened{
  background: #000c17!important;
  -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.45) inset;
  box-shadow: inset 0 2px 8px rgba(0,0,0,.45);
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{
  background: #001529!important
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: #001529!important
}
</style>
