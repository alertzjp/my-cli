<template>
  <div id="errorbox">
      <div class="error-centent">
        <div class="error-img">

        </div>
        <div class="error-info">
          <h2>404</h2>
          <div class="exception-index-desc">抱歉，你访问的页面不存在</div>
          <div>
            <Button type="primary" @click="backindex">返回首页</Button>
          </div>
      </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "",
  data () {
    return {

    }
  },
  methods: {
    backindex() {
      if(this.$webapi.get('token')){
        this.$router.push({
          path:"/admin/index"
        })
      }else {
        this.$router.push({
          path:"/"
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
#errorbox{
  background: #f0f0f0;
  height: 100vh;
  width: 100%;
}
.error-img{
    float: left;
    width: 100%;
    max-width: 430px;
    height: 360px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
    background: url("../../assets/404.svg")
}
.error-info {
  float: right;
  margin-top: 40px;
  h2{
    margin-bottom: 24px;
    color: #434e59;
    font-weight: 600;
    font-size: 72px;
    line-height: 72px;
  }
  .exception-index-desc{
    margin-bottom: 16px;
    color: rgba(0,0,0,.45);
    font-size: 20px;
    line-height: 28px;
  }
}
.error-centent{
  position: absolute;
  top: 50%;
  left:50%;
  width: 800px;
  height: 400px;
  margin-left: -400px;
  margin-top: -200px;
}
</style>
