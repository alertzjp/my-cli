<template>
  <div class="tags-nav" style="height:40px">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <!-- <DropdownItem name="close-others">关闭其他</DropdownItem> -->
        </DropdownMenu>
      </Dropdown>
    </div>
    <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}" class="contextmenu">
      <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
    </ul>
    <div class="btn-con left-btn">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back" />
      </Button>
    </div>
    <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward" />
      </Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <Tag
            v-for="(item, index) in navList"
            :color="item.show?'primary':'default'"
            :closable="item.name !== '首页'"
             @on-close="handleClose(item,index)"
             @click.native="handleClick(item)"
          >{{ item.name}}
        </Tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsNav',
  data () {
    return {
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,
      navList:[],
      menuList: {
        others: '关闭其他',
        all: '关闭所有'
      }
    }
  },
  // computed: {
  //   navList () {
  //      return this.$store.getters['TABNAVLIST/getItem']
  //   }
  // },
  methods: {
    handlescroll (e) {
      let type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    handleTagsOption (type) {
      if (type.includes('all')) {
         this.tagBodyLeft = 0
         this.$router.push({
           path:"/admin/index/"
         })
         this.$store.commit('TABNAVLIST/resetstate')
         this.$store.commit('NavList/resetnav')
         this.navList = this.$store.getters['TABNAVLIST/getItem']
         this.$store.dispatch('delall',"all")
      }
    },
    handleClose (current,index) {
      let _this = this
      let url = this.$route.path
       if(url=='/admin/device/areaManagermap/list'){
         this.$webapi.removeItem("areaType")
         this.$webapi.removeItem("addItem")
         this.$webapi.removeItem("emitData")
      }
      if(current.url==url){                 
        this.$router.push({
            path:_this.navList[index-1].url
          })
        this.$store.commit('TABNAVLIST/delincrement',index)
      }else {        
        this.$store.commit('TABNAVLIST/delincrement',index)
        this.navList = this.$store.getters['TABNAVLIST/getItem']
        this.$router.push({
            path:_this.navList[index-1].url
        })
      }
      /***由于急修页面做定时刷新，然后如果在时间内关闭了，还会执行，所以在这里调用这个方法**/
      this.$vm.$emit("returnCar")
      this.$store.dispatch('delsearchvla',current)
    },
    close (route) {
      let res = this.list.filter(item => !routeEqual(route, item))
      this.$emit('on-close', res, undefined, route)
    },
    handleClick (item) {
      if(item.url == this.$route.path){
       return
      }
      if(this.$webapi.GETSEETIME()){
        window.location.href = item.url
      }else{
        this.$router.push({
           path:item.url,
           query:item.query
        })
      }
      this.$store.commit('TABNAVLIST/tabincrement',item)
    },
    showTitleInside (item) {
      return showTitle(item, this)
    },
    isCurrentTag (item) {
      return routeEqual(this.currentRouteObj, item)
    },
    moveToView (tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
      }
    },
    getTagElementByRoute (route) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened
        this.refsTag.forEach((item, index) => {
          if (routeEqual(route, item.$attrs['data-route-item'])) {
            let tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
    },
    contextMenu (item, e) {
      this.$store.commit('TABNAVLIST/resetstate')
      this.$store.commit('NavList/resetnav')
      this.contextMenuLeft = 0
      this.contextMenuTop = 0
    },
    closeMenu () {
      this.visible = false
    },
    getTagElementByRoute01 (route) {
      let scrollOuter = this.$refs.scrollOuter.offsetWidth
      let rowItem = parseInt(scrollOuter/150)
      let itemindex = 0
          this.navList.forEach((a,index)=>{
            if(a.url == route.path){
              itemindex = index
            }
          })
      if(rowItem<itemindex){
        this.tagBodyLeft  = -(((itemindex - rowItem)*130))
      }else {
        this.tagBodyLeft = 0
      }
    },
  },
  watch: {
    '$route' (to) {
      this.getTagElementByRoute01(to)
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.navList = this.$store.getters['TABNAVLIST/getItem']
    setTimeout(() => {
      this.getTagElementByRoute01(this.$route)
    }, 200)
    let _this = this;
    this.$vm.$on('emitnav',(e)=>{
      _this.handleClose(e.itemList,e.itemindex)
    })
  }
}
</script>

<style lang="less">
  @import './tags-nav.less';
  .scroll-body{
    .ivu-tag{
      height: 32px;
      line-height: 32px;
      background: #fff;
      padding: 0 12px;
    }
    .ivu-tag-primary{
      background: #2d8cf0;
    }
  }
</style>
