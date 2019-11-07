let  tel = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
let  IP = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
// 保存缓存里
export default {
    gettel: function () {
      return tel
    },
    getIP: function () {
      return IP
    }
}
