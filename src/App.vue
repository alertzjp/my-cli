<template>
  <div id="app">
    <router-view v-if="isReload" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
   return {
     reload: this.reload
   }
 },
  data () {
    return {
      tel: '1550222908063',
      isReload: true
    }
  },
  methods: {
    reload() {
      this.isReload = false
      this.$nextTick(function() {
        this.isReload = true
      })
    }
  }
}
</script>

<style lang="less">
 @import "./css/zdui.less";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
