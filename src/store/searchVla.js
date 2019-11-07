const module={
  state: {
      searchdata:[]
  },
  mutations:{
    SAVEVLA(state,obj){
      let searchList=JSON.parse(window.sessionStorage.getItem('searchList'))
      let data=searchList?data=searchList:data=state.searchdata
      if(data.length==0){
        data.push(obj)
      }else{
        let idx = 0
        data.forEach((a)=>{
          if(a.path===obj.path){
             a.searchobj=obj.searchobj
             idx = 1
          }
        })
        if(idx == 0){
          data.push(obj)
        }
      }
      state.searchdata=data;
      window.sessionStorage.setItem("searchList", JSON.stringify(data))
    },
    DELVALUE(state,current) {
        let searchList=JSON.parse(window.sessionStorage.getItem('searchList'))
        let data=searchList?data=searchList:data=state.searchdata
        if(data.length>0){
          data.forEach((a,i)=>{
            if(a.path===current.url){
              data.splice(data.indexOf(a),1)
            }
          })
        }
        state.searchdata = data
        window.sessionStorage.setItem("searchList", JSON.stringify(data))
    },
    DELALL(state,str){
      if(str=="all"){
        state.searchdata=[];
        window.sessionStorage.setItem("searchList", JSON.stringify(state.searchdata))
      }
    }
  },
  actions:{
    savesearchvla(context,obj){
      context.commit("SAVEVLA",obj)
    },
    delsearchvla(context,current){
      context.commit("DELVALUE",current)
    },
    delall(context,str){
      context.commit("DELALL",str)
    }
  },
  getters:{
    searchdata:state=>state.searchdata,
  }
}

export default module
