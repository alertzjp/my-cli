<template>
  <div>
    <card style="box-shadow: 0 1px 6px rgba(0,0,0,.2);border-color: #eee;">
      <p slot="title">
        <Icon type="ios-notifications-outline" size="20" />
        急修车辆报障（待处理{{data.length}}条）
      </p>
      <a href="#" slot="extra" @click="checkNotice">
        <Icon type="ios-loop-strong"></Icon>
        查看
      </a>
      <a href="#" slot="extra" @click="closelNotice">
        <Icon type="ios-loop-strong"></Icon>
        关闭
      </a>
      <ul style="overflow: auto;height: 150px;font-size: 14px;">
        <li v-for="row in data">
          <Row>
              <Col span="11">{{row.createTime}}</Col>
              <Col span="13">{{row.name}}&nbsp;（{{row.mobileNo}}）</Col>
              <!--<Col span="6"></Col>-->
          </Row>
        </li>
      </ul>
    </card>
    <div v-if="websocketshow">
      <websocket-component v-bind:url="wsurl" @EmitwebsocketComponent="EmitwebsocketComponent"></websocket-component>
      <websocket-component v-bind:url="wsappurl" @EmitwebsocketComponent="EmitwebsocketComponent"></websocket-component>
    </div>
  </div>

</template>
<script>
  import websocketComponent from '../pub/websocketcomponent.vue'
export default {
  components:{
    websocketComponent
  },
  data () {
    return {
      websocketshow:false,
      byclecount:0,
      wsurl:'',
      wsappurl:'',
      data:[]
    }
  },
  methods: {
    //开启websocket
    getwebsocketurl(){
      let _this = this;
      _this.wsurl = _this.$API_WEBSOCKET_OPERATOR + "/wsoperator";
      _this.wsappurl = _this.$API_WEBSOCKET_APP + "/wsapp";
      _this.websocketshow = true;
    },
    EmitwebsocketComponent (json) {
      let _this = this;
      //判断 新增急修报障(ws1001) or 维修完成(ws1003)
      if(json.command == 'ws1001'){
          _this.list('ws1001');
      }

      //判断维修成功 || 手工还车
      if(json.command == 'ws1003' || json.command == 'ws1004'){
        _this.list('ws1003');

        //判断当前是否为急修报障页面
        if(_this.$router.currentRoute.path && '/admin/customerManage/urgencybike/list' == _this.$router.currentRoute.path){
          //刷新页面
          _this.$vm.$emit("refresh");
        }
      }

    },
    //查看通知
    checkNotice(){
        let _this = this;
        //判断当前是否为急修报障页面
        if(_this.$router.currentRoute.path && '/admin/customerManage/urgencybike/list' == _this.$router.currentRoute.path){
          _this.$vm.$emit("websocket");
        }else {
          _this.$router.push({ path: '/admin/customerManage/urgencybike/list',query: ""});
        }


    },
    closelNotice(){
        let _this = this;
        _this.$emit("EmitnoticeComponent",false);
    },

    //查询急修车辆报障数据信息
    list (command) {
      let _this =  this;
      let listdata = {
        data: JSON.stringify({
          token: _this.$webapi.get('token')
        })
      }

      this.$api.get('/customerBicycle/wsNoticeUrgencyBicycleList', listdata, reset => {
        if (reset.codeId === 1) {
          _this.data = reset.resData.list;
          if(_this.data.length > 0){
            _this.data.forEach((row)=>{
              row.createTime = this.$webapi.gettime('time',(row.createTime)/1000)
            });
            //判断是否是新增急修报障或刚刷新页面
            if(command == 'ws1001' || command == 'begin'){
              _this.$emit("EmitnoticeComponent",true);
            }
          }else{
            _this.$emit("EmitnoticeComponent",false);
          }
//          console.log('data:',_this.data);
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.$emit("EmitnoticeComponent",false);
        }
        else {
//          _this.$netcode.getApiCode(reset)
          _this.$emit("EmitnoticeComponent",false);
        }
      })
    },

  },
  mounted() {
    this.getwebsocketurl();
    this.list("begin");
  },
}
</script>
<style lang="less" scoped>
</style>
