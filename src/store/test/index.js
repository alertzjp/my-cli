import Storage from "../session"
import Filler from "../filler"
const module = {
  namespaced: true,
  state: {
    type:"",
    status:"",
    Time:[]
  },
  mutations: {
    increment (state,value) {
        // 改变 state
        let path = window.location.pathname
        let newvalue = Filler.set(state,value)
        Storage.setItem(path,newvalue)
    },
    resetstate (state) {
      state.type = ""
      state.status = ""
      state.Time = []
    }
  },
  actions: {
    increment (context) {
      let path = window.location.pathname
      let data = Storage.getItem(path)
       if(data==null){
          context.commit('resetstate')
       }   
    }
  },
  getters: {
    getItem (state) {
       let path = window.location.pathname
       let data = Storage.getItem(path)
       return state = data?data.value:state
    }
  }
}

export default module
