const module = {
  namespaced: true,
  state: {
      tabnav:{
        opennames:['0'],
        activename:'0'
      }
  },
  mutations: {
    innav (state,value) {
      window.sessionStorage.setItem("tabnav", JSON.stringify(value))
      state.tabnav = value
    },
    resetnav (state) {
      window.sessionStorage.setItem("tabnav", JSON.stringify(state.tabnav))
    }
  },
  actions: {
    increment (context) {
       if(data==null){
          context.commit('resetstate')
       }
    }
  },
  getters: {
    GETRESOURCE (state,value) {

    },
    getnav (state) {
      let data = JSON.parse(window.sessionStorage.getItem("tabnav"))
      return data?data:state.tabnav
    },
  }
}

export default module
