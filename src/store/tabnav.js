const module = {
  namespaced: true,
  state: {
      value:[{
        name:"首页",
        show:true,
        url:"/admin/index/"
      }],
  },
  mutations: {
    increment (state,value) {  
        let data = state.value            
        let idx = -1
        data.forEach((a,index) => {
          a.show = false
          if(value && a.url ==value.url){
            a.show = true
            idx = index
            data[index].query = value.query
          }
        });         
        if(idx==-1){
          data.push(value)
        }      
        window.sessionStorage.setItem("NavList", JSON.stringify(data))
        state.value = data
    },
    tabincrement (state,value) {
      console.log("tabincrement"+ value)
      let data = state.value
        data.forEach(a => {
          a.show = false
          if(value && a.url ==value.url){
            a.show = true
          }
        });
        state.value = data    
        window.sessionStorage.setItem("NavList", JSON.stringify(data))
    },
    delincrement (state,value) {
      console.log("delincrement"+ value)
        let data = state.value
        data.splice(value,1)
        state.value = data
        window.sessionStorage.setItem("NavList", JSON.stringify(data))
    },
    resetstate (state) {      
        state.value = [{
            name:"首页",
            show:true,
            url:"/admin/index/"
          }]
          window.sessionStorage.setItem("NavList", JSON.stringify([{
          name:"首页",
          show:true,
          url:"/admin/index/"
        }]))
    }
  },
  actions: {
    increment (context) {
       context.commit('resetstate')
    }
  },
  getters: {
    GETRESOURCE (state,value) {

    },
    getItem (state) {
      let data = state.value
      let newdata = JSON.parse(window.sessionStorage.getItem("NavList")) || []
      if(state.value.length <2 &&  newdata.length>1){
         data = newdata
         state.value = newdata
      }
      return data
    },
  }
}

export default module
