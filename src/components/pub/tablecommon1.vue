<template>
  <div class="">
       <!--pc端显示-->
       <div class="" v-if="width>=1000 && !loadingshow">
        <Table border :loading="time>1?loadingshow:false" ref="selection" :columns="pccolumns" :data="data" @on-selection-change="handleSelectRow()"></Table>
      </div>
       <!--移动端显示-->
      <div class="" v-if="width<1000 && !loadingshow">
         <Table border :loading="time>1?loadingshow:false" ref="selection" :columns="h5columns" :data="data" @on-selection-change="handleSelectRow()"></Table>
      </div>
       <!--加载...-->
      <div v-if="time>1?loadingshow:false" class="loadingitem">
         <Spin size="large" fix v-if="loadingshow"></Spin>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    columnsdata:{
      type:Array,
      default:() => []
    },
    datas:{
      type:Array,
      default:() => []
    },
    loading:{
      default:true
    },
    time:{
      default(){
        return 0
      }
    }
  },
  name: "",
  watch:{
    loading:{
      handler (newval,oldval) {
        let _this = this;
        setTimeout(()=>{
          _this.loadingshow = newval
        },300)
      }
    },
    datas:{
      handler(newval,oldval){
        this.data = newval
      },
      deep:true
    },
    // width:{
    //   handler(newval,oldval){
    //
    //   },
    //   deep:true
    // }
  },
   computed: {
    ...mapState({
      width: state => state.GETSETlIST.gb.width
    })
  },
  created() {
    //do something after creating vue instance
  },
  mounted() {
    //do something after mounting vue instance
    let _this  =this;
    this.loadingshow = true
    this.pccolumns = this.columnsdata
    this.h5columns = this.columnsdata
    this.data = this.datas
    _this.h5columns = _this.h5columns.map(item=>Object.assign({},item,{fixed:"none"}))
    setTimeout(()=>{
      _this.time = 1
    },1000)
  },
  methods: {
    handleSelectRow (e) {
      this.$emit("tableemit",this.$refs.selection.getSelection())
    }
  },
  data () {
    return {    
      pccolumns:[],
      data:[],
      h5columns:[],
      loadingshow:true
    }
  }
}
</script>
<style lang="less" scoped>
  .loadingitem{
      height: 200px;
      position: relative;
      border: 1px solid #eee;
  }
</style>
