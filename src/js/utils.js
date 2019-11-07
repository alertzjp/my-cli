let  utils = {
    filterNull (o) {
      for (let  key in o) {       
        if (o[key] == null || o[key] == "" || o[key] == "undefined" || o[key] == undefined) {
          delete o[key]
        }else{
          if (typeof(o[key]) === 'string') {
            o[key] = o[key].trim()
          } else if (typeof(o[key]) === 'object') {
            o[key] = filterNull(o[key])
          } else if (typeof(o[key]) === 'array') {
            o[key] = filterNull(o[key])
          }
        }
      }
      return o
    }
}
export default utils
