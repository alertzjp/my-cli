const module = {
  namespaced: true,
  state: {
      value:[
        {
          name:"首页",
        }
      ],
      newarr:[]
  },
  mutations: {
    increment (state,value) {
       state.newarr=[]
       state.newarr=value
       window.sessionStorage.setItem("breadcrumb", JSON.stringify(value))
    },
    incrementurl (state,value) {
       let breadcrumbdata=JSON.parse(window.sessionStorage.getItem('breadcrumb'))
       let data=state.newarr.length==0?breadcrumbdata:state.newarr
       let preid=0
       data.forEach((a)=>{
        if(a.resourcesList&& a.resourcesList.length>0){
          a.resourcesList.forEach((b)=>{
            if(value==b.path){
                state.value[2]={name:b.name}
                preid=b.parent_id
            }
          })
        }
      })
      data.forEach((c)=>{
         if(c.id==preid){
            state.value[1]={name:c.name}
         }
      })
    },
  },
  actions: {
    increment (context) {
    
    }
  },
  getters: {
    getdata:state=>state.value
  }
}

export default module
