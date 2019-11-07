<template>
  <div class="page-component-view">
   <div class="page-component-bd"> 
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
        </Col>
     </Row>
   </div>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
export default {
  name: "",
  components:{
    tableComponent,
  },
  data () {
    return {
      loading:false,
      id:"",
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '用户名',
              key: 'riderName',
              minWidth:150,
          },
          {
              title: '电话',
              key: 'mobileNo',
              minWidth:150,
          },
          {
              title: '二维码编号',
              key: "bikeNo",
              minWidth:150,
          },
          {
              title: '终端编号',
              key: "terminalNo",
              minWidth:150,
          },
          {
              title: '开始时间',
              key: "beginTime",
              minWidth:150,
          },
          {
              title: '结束时间',
              key: "endTime",
              minWidth:150,
          },
          {
              title: '原价收费金额',
              key: "amount",
              minWidth:150,
          },
          {
              title: '优惠金额',
              key: "discountAmount",
              minWidth:150,
          },
          {
              title: '实际支付金额',
              key: "tradeAmount",
              minWidth:150,
          },
          {
              title: '租车状态',
              key: "flowStatus",
              minWidth:150,
          },
          {
              title: '租车时的充电桩',
              key: "chargePileNoRent",
              minWidth:150,
          },
          {
              title: '还租车时的充电桩',
              key: "chargePileNoReturn",
              minWidth:150,
          },
          {
              title: '单价,元/每分钟',
              key: "price",
              minWidth:150,
          },
      ]
    }
  },
  mounted() {
    this.id=this.$route.query.item.id;
    this.list();
  },
  methods: {
    goback(){
      this.$router.go(-1)
    },
    list () {
      this.loading = true
      let listdata = {
        data:JSON.stringify({
          token:this.$webapi.get('token'),
          id:this.id
        })
      }
      let _this =  this
      this.$api.get('/rent/detail',listdata,reset => {
        if (reset.codeId === 1) {
           // _this.data = reset.resData
           let newarr=[];
           newarr.push(reset.resData);
           _this.data=newarr;
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
        }
        else {
          _this.loading = false
          _this.$netcode.getApiCode(reset)
       }
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>
