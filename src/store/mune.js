 const module = {
  namespaced: true,
  state: {
      value:[],
      munedata:[
        {name:"助力车",show:true},
        {name:"小品单车",show:false}
      ]
  },
  mutations: {
    increment (state,value) {
         state.value = value
    },
    savemunedata (state,value) {
         state.munedata = value
    },
    resetstate (state) {
        state.value = []
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
    //是否显示资源
    GETRESOURCE (state,value) {
     
    },
    getItem (state) {
      let reset = []
      let value = state.munedata.filter((a)=>{
          if(a.show){
            return a
          }
      })
      let cloneData = JSON.parse(JSON.stringify(state.value))    // 对源数据深度克隆
        let tree = cloneData.filter(father=>{              //循环所有项
          let branchArr = cloneData.filter(child=>{
            return father.id == child.parent_id      //返回每一项的子级数组
          });
          if(branchArr.length>0){
            father.resourcesList = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
          }
          return father.parent_id==0;      //返回第一层
        });
       tree.forEach((a)=>{
          if(a.name == value[0].name){
              reset = a.resourcesList
          }
       })
      return reset
    },
    getmume (state) {
      return state.munedata
    },
    getshowmune (state) {
      let reset = []
      let value = state.munedata.filter((a)=>{
          if(a.show){
            return a
          }
      })
      let cloneData = JSON.parse(JSON.stringify(state.value))    // 对源数据深度克隆
        let tree = cloneData.filter(father=>{              //循环所有项
          let branchArr = cloneData.filter(child=>{
            return father.id == child.parent_id      //返回每一项的子级数组
          });
          if(branchArr.length>0){
            father.resourcesList = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
          }
          return father.parent_id==0;      //返回第一层
        });
       tree.forEach((a)=>{
          if(a.name == value[0].name){
              reset = a.resourcesList
          }
       })
      return reset
    }
  }
}

export default module
