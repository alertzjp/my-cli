const module = {
 namespaced: true,
 state: {
    list:[{
      url:"/admin/userManage/usermember/list",
      form:{
        name:""
      }
    }]
 },
 mutations: {
   increment (state,value) {
      state.gb = value
   },
   resetstate (state) {
       state.gb = {
         width:"",
         height:""
       }
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
   getItem (state,value) {
     return state => state.list[0].url==value
   },
 }
}

export default module
