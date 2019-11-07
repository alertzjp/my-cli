<template>
  <div id="">
     <div class="allnum">
      <ul>
        <li class="item" v-for="(item,index) in itemdata">
           <span>{{item.typeName?item.typeName:""}}</span>
           <span class="numcss">{{item.unit==1?item.num+"元":(item.unit==2?item.num+"笔":item.num+"次")}}</span>
        </li>
      </ul>
     </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    alltotal:{
      type: Array,
      default: []
    },
  },
  data: () => ({
     eshow:false,
     itemdata:[]
  }),
  mounted() {
    var _this=this
    setTimeout(function(){
      _this.itemdata=_this.alltotal
    },100)
  }
}
</script>
<style lang="less" scoped>
.allnum{
  width:100%;
  height:40px;
  padding: 0 20px;
  line-height:40px;
  background: #F0F5Fc;
  margin-bottom: 16px;
  border-radius:3px;
  border:1px solid #93C0FF;
}
.item{
  margin-right: 20px;
  float: left
}
.numcss{
  color:#2878FF;
  font-weight: bold;
}
</style>
