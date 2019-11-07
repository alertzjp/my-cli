let iView = require('iView')
// 网络状态错误
function netstatus(err) {
  let  str = ''
  if(err && err.response){
    switch (err.response.status) {
      case 0:
        str = `接口返回来时间过长: ${err.response.config.url}`
        break
      case 400:
        str = `请求错误:${err.response.data.message}`
        break
      case 401:
        str = '未授权，请登录'
        break

      case 403:
        str = '拒绝访问'
        break

      case 404:
        str = `请求地址出错: ${err.response.config.url}`
        break

      case 405:
        str = `请求方法不对:${err.response.data.message}`
        break

      case 408:
        str = '请求超时'
        break

      case 500:
        str = '服务器内部错误'
        break

      case 501:
        str = '服务未实现'
        break

      case 502:
        str = '网关错误'
        break

      case 503:
        str = '服务不可用'
        break

      case 504:
        str = '网关超时'
        break

      case 505:
        str = 'HTTP版本不受支持'
        break;
      default:
        str = `连接错误:${err.response.status} `
        break
    }
    if (str) {
      iView.Message.warning(str)
      return
    }
  }else if (err.request){
    if(err.request.status==0){
      if(err.message.indexOf('timeout')!=-1){
        str = "页面请求超时"
      }else if(err.message.indexOf('Network')!=-1) {
        str = "页面服务器连接断开"
      }
    }
    switch (err.request.status) {
      case 1:
          str = "页面服务器连接已建立"
          break
      case 2:
          str = "请求已接收"
          break
      case 3:
          str = "请求处理中"
          break
      case 4:
          str = "请求已完成，且响应已就绪"
          break
    }
    if (str) {
      iView.Message.warning(str)
    }
    if(err.request.status==0){
      setTimeout(function () {
        window.location.href = '/login'
      },1000)
    }
    return
  }else {
    return
  }
}
// 接口返回来的状态
function ApiCode(res) {
  // 返回状态逻辑
  if (res.codeId == -99) {
    setTimeout(function () {
      window.location.href = '/login'
    },1000)
  }else if(res.codeId == 1){
    iView.Message.warning("成功")
  }else if(res.codeId == 0){
    iView.Message.warning(res.codeDes)
  }else {
    iView.Message.warning(res.codeDes)
  }
  return
}
//验证
function reg(e) {
   let  str = ""
   let  v = /^[0-9]\.[0-9]\.[0-9]{3}$/
   if(e=="v"){
      str = v
   }
   return str
}
// 接口返回来的状态
//状态:1.等待审核;2.审核不通过;3.审核通过(待上架);4.上架;5.下架
function Itemcode(res) {
  let  str = ""
  if(res==1){
     str = "等待审核"
  }
  else if(res==2){
    str = "审核不通过"
  }
  else if(res==3){
    str = "审核通过(待上架)"
  }
  else if(res==4){
    str = "上架"
  }
  else if(res==5){
    str = "下架"
  }
  return str
}
// 接口返回code状态
export default {
  getCode: function(err) {
    return netstatus(err)
  },
  getApiCode: function(res) {
    return ApiCode(res)
  },
  getItem:function (res) {
     return Itemcode(res)
  },
  getReg:function (res) {
     return reg(res)
  }
}
