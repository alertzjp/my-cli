const module = {
  namespaced: true,
  state: {
      data:{
        districtName:"",
        districtNo:"",
        latitude:"",
        longitude:"", 
        maintaintorList:[],
        principalsId:"",
        principalsTel:"",
        regionScopedata:[]
      },
      areaTypa:0,     
  },
  mutations: {
    increment (state,value) {
      state.data = Object.assign(state.data, value)
      console.log(state.data)
    },
    setType (state,value) {
      state.areaTypa = value
    },     
    resetstate (state) {
      console.log("resetstate")
      state.data = {         
        districtName:"",
        districtNo:"",
        latitude:"",
        longitude:"", 
        maintaintorList:[],
        principalsId:"",
        principalsTel:"",
        regionScopedata:[]
      }
      state.areaTypa = 0
     
    },     
  },
  actions: {
    increment (context) {
      context.commit('resetstate')  
      console.log("increment")    
    },     
  },
  getters: {   
    getItem (state) {
      return state.data
    },
    getType (state,value) {
      return state.areaTypa
    }, 
  }
}
export default module
