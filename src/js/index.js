// 配置API接口地址
const root = process.env.API_ROOT
// 引用axios
let axios = require('axios')
let QS = require('qs')
import networkcode from './network'
import webapi from './webapi'
let iView = require('iView')




// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (let  key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的
*/
function apiAxios (method,url, params, success, failure,urltype) {
  let  str = root
  webapi.save('expTime',new Date().getTime())
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? QS.stringify(params) : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL:root,
    timeout:1000000,
    withCredentials: false,
    // headers: {
    //   'menu': document.location.pathname,
    //   'X-Requested-With':'XMLHttpRequest',
    // }
  })
  .then(function (res,e) {
      if (res.status === 200) {
          if(res.data.codeId=="-99"){
             webapi.save("token","")
             webapi.save("username","")
             iView.Message.warning(res.data.codeDes)
             setTimeout(function () {
               window.location.href="/login/"
             },1500)
          }else if(res.data.codeId==-35){
            iView.Message.warning(res.data.codeDes)
          }
          else {
            success(res.data)
            // if(res.data.codeId!=1 && res.data.codeId!=-16){
            //   iView.Message.warning(res.data.codeDes)
            // }
          }
      } else {
        if (failure) {
          failure(res.data)
        } else {
          failure()
          networkcode.getApiCode(res)
        }
      }
    })
    .catch(function (err) {
      if(failure){
        failure()
      }
      if (err) {
        networkcode.getCode(err)
        return
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure,urltype) {
    return apiAxios('GET', url, params, success, failure,urltype)
  },
  post: function (url, params, success, failure,urltype) {
    return apiAxios('POST', url, params, success, failure,urltype)
  },
  put: function (url, params, success, failure,urltype) {
    return apiAxios('PUT', url, params, success, failure,urltype)
  },
  delete: function (url, params, success, failure,urltype) {
    return apiAxios('DELETE', url, params, success, failure,urltype)
  }
}
