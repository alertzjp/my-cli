import Vue from 'vue'
import Vuex from 'vuex'
import muneList from './mune'
import PermissionList from './Permission'
import Storage from "./session"
import GETSETlIST from "./gbset"
import TABNAVLIST from "./tabnav"
import NavList from "./gblib"
import SEARCHVLA from "./searchVla"
import Breadcrumb from "./breadcrumb"
import AreaList from './device/areaManagermap/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    PermissionList,
    muneList,
    GETSETlIST,
    TABNAVLIST,
    NavList,
    SEARCHVLA,
    Breadcrumb,
    AreaList
  }
})
export default store
