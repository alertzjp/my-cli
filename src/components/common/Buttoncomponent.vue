<template>
    <Button :type="type" :icon="icon" :loading="loading" :long="long==1" @click="emitButton">{{title}}</Button>
</template>
<script>
import { mapState,mapGetters } from 'vuex'
export default {
  name: "",
  props:{
    title:{
      default () {
        return ""
      }
    },
    loading:{
      default(){
        return false
      }
    },
    long:{
      default(){
        return 0
      }
    },
    type:{
      default(){
        return "primary"
      }
    },
    icon:{
      default(){
        return ""
      }
    },
  },
  data () {
    return {

    }
  },
  computed: {
     ...mapGetters({
       width:'GETSETlIST/getItem'
     })
  },
  mounted() {
    //do something after mounting vue instance
    // this.size = this.width.width>1800?'large':this.width.width>1200?"":'small'
  },
  methods: {
    emitButton () {
      this.$emit("emitButton")
    }
  }
}
</script>
<style lang="less" scoped>

</style>
