 const module = {
  namespaced: true,
  state: {
      data:[],
      permission:[]
  },
  mutations: {
    increment (state,value) {
      state.permission = value
    },
    saveSide (state,value) {
      state.data = value
    },
    resetstate (state) {
      state.permission = []
    }
  },
  actions: {
    increment (context) {
      context.commit('resetstate')
    }
  },
  getters: {
    getItem (state) {       
      return state.permission
    },
    getSide (state) {
      return state.data
    }
  }
}
export default module
