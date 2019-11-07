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
            <Scroll :height='muneheight' v-if="show">
              <Menu v-if="items.length>0" theme="light" width="auto" :theme="theme2" :open-names="opennames"  ref="side_menu" :active-name="activename"  @on-select="changeMenu" accordion>
                    <div class="">
                      <Submenu :name="item.itemindex" v-for="(item,index) in items" v-if="item.blank!=-1" >
                          <template slot="title">
                              <span v-if="item.icon"><Icon :type="item.icon"></Icon></span>
                              <span v-else><Icon type="ios-navigate"></Icon></span>
                              {{item.name}}
                          </template>
                            <MenuItem :name="itemlist.itemindex" v-for="itemlist in item.resourcesList" v-if="itemlist.isShow!=-1">
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
                  <Menu v-if="items.length>0" theme="light" width="auto" :theme="theme2" :open-names="opennames" :active-name="activename"  @on-select="changeMenu" accordion>
                        <div class="">
                          <Submenu :name="item.itemindex" v-for="(item,index) in items" v-if="item.blank!=-1" >
                              <template slot="title">
                                  <span v-if="item.icon"><Icon :type="item.icon"></Icon></span>
                                  <span v-else><Icon type="ios-navigate"></Icon></span>
                                  {{item.name}}
                              </template>
                                <MenuItem :name="itemlist.itemindex" v-for="(itemlist,itemlistindex) in item.resourcesList" v-if="itemlist.isShow!=-1">
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


import { mapState,mapGetters } from 'vuex'
export default {
  name: 'SideMenu',
  components:{

  },
  props:["height"],
  data () {
    return {
       activename:'',
       opennames:[],
       items:[],
       title:"",
       show:false,
       muneheight:"",
       theme2:'dark',
       userTypeName:1,
       DrawerShow:false,
       Ismobile:false,
       resources:[],
       styles: {
           overflow: 'hidden',
           padding: '0',
           position: 'static',
           background:'#001529'
        },
      // noticeflag:false,
      // activeClass:'notice-websocket-css-begin',
      // otherClass: 'notice-websocket-css-normal'
    }
  },
  //获取菜单内容，是否缓存内容存在，如果没有，就重新获取，已存在，就从缓存里面获取
  beforeCreate () {
  },
  computed: {
   ...mapGetters({
     width:'NavList/getnav'
   })
 },
  mounted() {
    //do something after mounting vue instance
    let _this = this;
    this.muneheight = this.height || 0
    this.userTypeName = this.$webapi.get('accountType') || 1
    this.userType()
     this.$vm.$on("submune",(e)=>{
      if(e>=1285){
        _this.DrawerShow = false
        _this.Ismobile = false
      }else{
        _this.DrawerShow = false
        _this.Ismobile = true
      }
    })
    this.list()
    this.opennames = this.$store.getters['NavList/getnav'].opennames;
    // this.$nextTick(()=> {
    //   this.$refs.side_menu.updateOpened();
    //   this.$refs.side_menu.updateActiveName();
    // });
//    console.log(this.$NODE_ENV)
//    console.log(this.$API_WEBSOCKET_APP)
   },
  methods: {
    menuClick (e,m) {
      let _this = this;
       this.opennames = e
       this.activename = m
       this.$nextTick(()=> {
         _this.$refs.side_menu.updateOpened();
         _this.$refs.side_menu.updateActiveName();
       });
    },
    getMune () {
       this.$nextTick(()=> {
         this.$refs.side_menu.updateOpened();
         this.$refs.side_menu.updateActiveName();
       });
    },
    updateOpened01 () {

    },
    gettitle (path,titleshow){
      let title=""
      if(titleshow){
        return title=titleshow;
      }
      this.resources.forEach(function (a){
        if(a.resourcesList.length>0){
          a.resourcesList.forEach((b)=>{
            if(b.path==path){
              title=b.name
            }
          })
        }
      })
      return title
    },
    list () {
        let _this = this
        let data = {
          token:this.$webapi.get('token')
        }
        this.$api.get('/roleResources/getOne',data,reset => {
            if (reset.codeId === 1) {
                let data = reset.resData
                this.resources=reset.resData
                data.sort(_this.compare('resourcesOrder'))
                data.forEach(function (a){
                  if(a.resourcesList.length>0){
                    a.resourcesList.sort(_this.compare('resourcesOrder'))
                  }
                })
                data.forEach((a,index)=>{
                  a.itemindex = ""+index+""
                  if(a.resourcesList.length>0){
                    a.resourcesList.forEach((b,bindex)=>{
                        b.itemindex = ""+index+"-"+bindex;
                    })
                  }
                })
                _this.items = data
                _this.$store.commit('PermissionList/increment',_this.GETRESOURCE(data))
                _this.$store.commit('Breadcrumb/increment',data)
                _this.show = true
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
          return value1-value2  ;
      }
    },
    changeMenu (e) {
      let _this = this;
      let muneindex = e.split("-")[0]
      let itemindex = e.split("-")[1]
      setTimeout(function () {
          _this.$router.push({path:_this.items[muneindex].resourcesList[itemindex].path})
      },100)
      if(window.innerWidth<=1285){
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
     '$route':function (to, from) {
       let _this = this;
       let data = {
          name:this.gettitle(to?to.path:from.path,to.meta.titleshow?to.meta.title:""),
          show:true,
          url:to?to.path:from.path,
          query:to?to.query:from.query
        }
       if(to.meta.isshow==undefined && to.meta.isshow==null){
          this.$store.commit('TABNAVLIST/increment',data)
       }
       this.items.forEach((a,index)=>{
         if(a.isShow!=-1){
           a.resourcesList.forEach((b,bindex)=>{
             if(b.path == to.matched[(to.matched.length)-1].path){
               _this.$store.commit('NavList/innav',{
                 opennames:[''+index+''],
                 activename:''+index+'-'+bindex
               })
               _this.menuClick([''+index+''],''+index+'-'+bindex)
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
