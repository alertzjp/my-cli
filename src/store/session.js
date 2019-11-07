const session = {
      getItem (key) {
        let params = null
        let path = key; //获取当前的url当作子项目的key
        let reset = JSON.parse(window.sessionStorage.getItem("Warehouse")) || []
        if(reset && reset.length>0){
          reset.forEach((a,index)=>{
            if(a.path == path){
               params = a
            }
          })
        }       
        return params
        // window.sessionStorage.getItem(key);
      },
      setItem (key,value) {
          let path = key; //获取当前的url当作子项目的key
          let reset = JSON.parse(window.sessionStorage.getItem("Warehouse")) || []
          if(reset && reset.length>0){
            let idx = -1
            reset.forEach((a,index)=>{
              if(a.path == path){
                 idx = index
              }
            })
            if(idx>-1){
                reset[idx].value = value
            }else{
              let data = {
                  path:path,
                  value:value
              }
              reset.push(data)
            }
            window.sessionStorage.setItem('Warehouse', JSON.stringify(reset))
          }else{
            let data = {
                path:path,
                value:value
            }
            reset.push(data)
            window.sessionStorage.setItem('Warehouse', JSON.stringify(reset))
          }
      }
}

export default session
