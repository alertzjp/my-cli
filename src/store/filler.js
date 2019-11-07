const filler = {
      //value原始值，newvalue传过来值
      set (value,newvalue) {
          let state = value
          for(let item in state){
            for(let newitem in newvalue){
                if(item==newitem){
                    state[item] = newvalue[newitem] || ""
                }
            }
          }      
          return state
      }
}

export default filler
