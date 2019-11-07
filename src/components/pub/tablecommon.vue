<template>
  <div class="" style="text-align:center">
      <Table
      :loading="loadingshow"
      :height="(tableheight<800&&datas.length>9)?(tableheight-300):''"
      ref="selection"
      :columns="width<1000?h5columns:pccolumns"
      :data="data"
      :size="size"
      :border="border==1"
      :show-header="showHeader==1"
      @on-selection-change="handleSelectRow()"
      ></Table>
       <!--加载...-->
      <!-- <div v-if="time>1?loadingshow:false" class="loadingitem">
         <Spin size="large" fix v-if="loadingshow"></Spin>
      </div> -->
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
    border:{
      default(){
        return 1
      }
    },
    datas:{
      type:Array,
      default:() => []
    },
    showHeader:{
      default(){
        return 1
      }
    },
    loading:{
      default:true
    },
    // time:{
    //   default () {
    //     return 0
    //   }
    // }
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
      width: state => state.GETSETlIST.gb.width,
      tableheight: state => state.GETSETlIST.gb.height,
    })
  },
  created() {
    //do something after creating vue instance
  },
  mounted() {
    //do something after mounting vue instance
    let _this  =this;
    this.pccolumns = this.columnsdata
    this.h5columns = this.columnsdata
    this.data = this.datas
    _this.h5columns = _this.h5columns.map(item=>Object.assign({},item,{fixed:"none"}))
    this.loadingshow = false
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
      size:"default",
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
