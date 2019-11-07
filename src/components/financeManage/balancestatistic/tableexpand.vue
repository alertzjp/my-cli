<style lang="less">
  .expand-row{
    .ivu-table-column-center{
      background: #e8eaec
    }
    .ivu-table-wrapper{
      border: none!important
    }
    .ivu-table td, .ivu-table th{
      border:none;
      border-bottom:none!important
    }
  }
</style>
<template>
  <div class="expand-row">
    <!-- {{row}} -->
    <table-component :loading="loading" :columnsdata="columns"  border=0 :datas="row.rechargeBalanceData" ></table-component>
  </div>
</template>
<script>
    import tableComponent from '../../pub/tablecommon.vue'
    export default {
        components:{
          tableComponent
        },
        props: {
            row: Object
        },
        data () {
          return {
            loading:false,
            columns:[
                {
                    title: ' ',
                    key: '',
                    align: 'center',
                    width:50,
                },
                {
                    title: '支付方式',
                    key: 'tradeChannel',
                    align: 'center',
                    minWidth:150,
                },
                {
                    title: '充值金额',
                    key: 'rechargeAmount',
                    align: 'center',
                    width: 150
                },
                {
                    title: '充值笔数',
                    key: 'rechargeNum',
                    align: 'center',
                    width: 150
                },
                {
                    title: ' ',
                    key: '',
                    align: 'center',
                    width: 150
                },
                {
                    title: ' ',
                    key: '',
                    align: 'center',
                    width: 150
                },
                {
                    title: ' ',
                    key: "",
                    align: 'center',
                },
            ]
          }
        }
    };
</script>
