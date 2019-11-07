const module = {
 namespaced: true,
 state: {
     gb:{
       width:'', //页面的宽度
       height:'',//页面的高度
     }
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
   getItem (state) {
     return state.gb
   },
 }
}

export default module
