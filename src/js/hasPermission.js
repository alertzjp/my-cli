 import store from "../store"
 function hasPermission (value,key) {
    let myBtns = this.$store.getters['PermissionList/getItem']
    let itemlength = (""+value?value:"").split(',')
    let keydata = key || 'and'
    if(itemlength.length>1){
        //value and传参都要有 or 其中有一个就可以
       if(keydata=='and'){
          let  show = false
           itemlength.forEach((a) =>{
              show = myBtns.indexOf(a) >-1
           })
           return show
       }else if (keydata=='or') {
         let  show = false
         itemlength.forEach((a)=>{
             if(!show){
               return show =  myBtns.indexOf(a) >-1
             }
         })
         return show
       }
    }else {
      return myBtns.indexOf(value) >-1
    }
 }

export default hasPermission
