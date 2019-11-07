<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListOperator">
       <Button type="primary" icon="md-add" size="large" @click="add" v-if="data.length==0">添加</Button>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
        </Col>
     </Row>
   </div>
    <addedit-component v-if="addeditshow" :selectitem="selectitem" :type="type" @emitcomponent="emitcomponent"></addedit-component>
    </div>
</template>
<script>
  import tableComponent from '../../pub/tablecommon.vue'
  import addeditComponent from "./addedit.vue"
  export default {
  name: "",
  components:{
    tableComponent,
    addeditComponent
  },
  data () {
    return {
      loading:false,
      addeditshow:false,
      selectitem:{},
      type:0,
      data:[],
      columns:[
          {
              title: '低电预警值%',
              key: 'lowVoltage',
              minWidth:90,
          },
          {
              title: '创建时间',
              minWidth:90,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
            }
          },
         {
             title: '修改时间',
             minWidth:90,
             render: (h, params) => {
               let str = this.$webapi.gettime('time',(params.row.updatedAt)/1000)
               return h('div', [
                   h('span', str)
             ])
           }
         },
         {
             title: '操作',
             key: 'action',
             align: 'center',
             minWidth:100,
             flexd:"right",
             render: (h, params) => {
               let _this = this;
                 return h('div', [
                     h('Button', {
                         props: {
                             type: 'primary',
                             size: 'default'
                         },
                         style: {
                             marginRight: '5px',
                             display:_this.$hasPerm('/bicycledocksite/battery_warn/save')?"":"none"
                         },
                         on: {
                             click: () => {
                               _this.selectitem = params.row
                               _this.addeditshow = true
                               this.type=2
                             }
                         }
                     }, '修改'),
                     h('Button', {
                         props: {
                             type: 'error',
                             size: 'default'
                         },
                         style: {
                             marginRight: '5px',
                             display:_this.$hasPerm('/bicycledocksite/battery_warn/delete')?"":"none"
                         },
                         on: {
                             click: () => {
                               _this.$webapi.getMessinfo({
                                 title:`确定要删除低电预警值吗`,
                                 yes () {
                                   _this.delpost(params.row)
                                 }
                               })
                             }
                         }
                     }, '删除'),
                 ]);
             }
         }
      ]
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    add(){
      this.addeditshow=true
      this.selectitem={}
      this.type=1
    },
    emitcomponent(){
      this.addeditshow=false
      this.list()
    },
    delpost(e){
      let listdata = {
          data: JSON.stringify({
            token:this.$webapi.get('token'),
            id: ''+e.id,
          })
      }
      let _this =  this
      this.$api.post('/bicycledocksite/battery_warn/delete',listdata,reset => {
        if (reset.codeId === 1) {
           _this.$Message.success("删除成功")
           _this.list()
        }
      })
    },
    list () {
      this.loading = true
      let listdata = {
            token:this.$webapi.get('token'),
      }
      let _this =  this
      this.$api.get('/bicycledocksite/battery_warn/list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData
           _this.loading = false
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
        }else {
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
