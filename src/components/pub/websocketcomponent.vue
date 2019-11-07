<template>
</template>
<script>
export default {
    //url:"ws://" + process.env.API_ROOT.replace("http://", "") + "/wsoperator"
  props:{
      url:''
  },
  data () {
    return {
      ip:'',
      hearttime:55000,
      resettime:100000,
      t1:'',
      t2:'',
      resetflag:true
    }
  },
  methods: {
    //ws连接设置
    initws: function () {
        if(this.url){
          //判断当前浏览器是否支持WebSocket
          if ('WebSocket' in window) {
            this.ip = "webpage_client_" + Math.round(Math.random() * 99 + 1);
            this.websocket = new WebSocket( this.url+"/" + this.ip);

            //连接成功建立的回调方法
            this.websocket.onopen = this.onopen;

            //接收到消息的回调方法
            this.websocket.onmessage = this.onmessage;

            //连接关闭的回调方法
            this.websocket.onclose = this.onclose;

            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = this.onbeforeunload;
          }
          else {
            console.error('不支持websocket')
          }
        }

    },
    onopen: function (event) {
//      console.log('开始建立连接...' + this.url);
      this.heart();
    },
    onmessage: function (event) {
      //判断是否为心跳
      let _this = this;
      let json;
      try {
        json = JSON.parse(event.data);
//        console.log('接收信息',json);
        if( null != json ){
            if(json.command == 'ws1002' && json.ip == this.ip){
//              console.log('心跳');
              _this.resetflag = false;
            }else{
              _this.$emit("EmitwebsocketComponent",json);
            }
        }
      }
      catch (e) {
//        console.log('ws接收异常---->',e);
        return;
      }
    },
    onclose: function () {
//      console.log('断开连接...');
    },
    onbeforeunload: function () {
      this.websocket.close();
    },

    //心跳检测设置
    heart(){
      //发送心跳
      this.t2 = setInterval(this.websocketsend,this.hearttime);
    },
    //发送心跳
    websocketsend(){
      this.resetflag = true;
      //发送心跳
      let message = "{'command':'ws1002','ip':'"+ this.ip +"'}";
      this.websocket.send(message);
    },
    //重置连接
    resetWebsocket(){
      let _this = this;
      if(_this.resetflag){
        //清除心跳发送
        clearInterval(_this.t2);
        //关闭websocket,重新连接
        _this.websocket.close();
        _this.initws();
      }
    },
    startreset(){
      //启动重置连接倒计时
      this.t1 = setInterval(this.resetWebsocket,this.resettime);
    }

  },
  mounted() {
    this.initws();
    this.startreset();
  },
}
</script>
<style lang="less" scoped>
</style>
