// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import iviewArea from 'iview-area'
import VueAMap from 'vue-amap';
import echarts from 'echarts'
import axios from 'axios'
import * as vClickOutside from 'v-click-outside-x';

import 'iview/dist/styles/iview.css'
import './css/common.css'


import {vm} from './js/infobase/vm.js'
import api from './js/index.js'
import network from './js/network.js'
import webapi from './js/webapi.js' //里面都是保存缓存参数
import Validate from './js/Validate.js' //里面都是保存缓存参数
import status from './js/status.js' //里面都是保存缓存参数
import utils from './js/utils.js'
import hasPermission from './js/hasPermission.js' //里面都是保存缓存参数
import store from "./store"

Vue.prototype.$webcommon = process.env.API_ROOT

import * as filters from './js/filters.js'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$netcode = network
Vue.prototype.$webapi = webapi
Vue.prototype.$utils = utils
Vue.prototype.$Validate = Validate
Vue.prototype.$vm = vm
Vue.prototype.$status = status
Vue.prototype.$echarts = echarts
Vue.prototype.$hasPerm = hasPermission
Vue.prototype.$webapicommon = process.env.API_ROOT
Vue.prototype.$API_WEBSOCKET_APP = process.env.API_WEBSOCKET_APP
Vue.prototype.$API_WEBSOCKET_OPERATOR = process.env.API_WEBSOCKET_OPERATOR


router.beforeEach((to, from, next) => {
    if(webapi.GETSEETIME()){
       webapi.save('expTime',new Date().getTime())
       if(to.fullPath!="/login/"){
         iView.Message.warning("由于你长时间没有操作,你需重新登录")
       }
       setTimeout(()=>{
         window.location.href = "/login/"
       },1000)
    }else{
      iView.LoadingBar.start();
      next();
    }
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});

router.onError((error)=>{
   const pattern = /Loading chunk (\d)+ failed/g;
   const isChunkLoadFailed = error.message.match(pattern);
   const targetPath = router.history.pending.fullPath;
   let dicIndex = webapi.get("dicIndex") || 0
   console.log(isChunkLoadFailed)

   if (isChunkLoadFailed.length>0) {
    // dicIndex = parseInt(dicIndex)+1
    location.reload(true)
     // if(dicIndex>2){
     //   webapi.save("dicIndex",0)
     //   window.location.href = window.location.href
     // }else {
     //   webapi.save("dicIndex",dicIndex)
     //   console.log("测试router--errorreplace")
     //   router.replace(targetPath);
     // }
   }
})

import tabNav from "./components/common/tabnav.vue"
import version from "./components/common/versions.vue"
import Buttoncomponent from "./components/common/Buttoncomponent.vue"
import List from "./components/common/List.vue"
Vue.component("Buttoncomponent",Buttoncomponent)
Vue.component("version",version)
Vue.component('tabNav', tabNav)
Vue.component("List",List)

Vue.use(iView)
Vue.use(iviewArea)
Vue.use(VueAMap);
Vue.use(vClickOutside);

VueAMap.initAMapApiLoader({
  key: '6a46dbb18dd5cd5a9a417642c0546d6f',
  plugin: ['AMap.Autocomplete','AMap.PlaceSearch','AMap.DistrictSearch','AMap.MouseTool','AMap.Walking','AMap.Scale','AMap.Riding','AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder','AMap.Geolocation'],
  uiVersion:'1.0.0',
  v: '1.4.4'
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
