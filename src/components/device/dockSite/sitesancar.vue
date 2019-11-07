<template>
  <div class="">
    <Modal v-model="show" width="700" @on-cancel="cancel" :mask-closable="false">
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>站点【{{formCustom.docksiteName}}】的车辆数</span>
       </p>
       <div style="text-align:left">
         <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="">
                     <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
                 </div>
            </Col>
         </Row>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
export default {
  name: "",
  components: {
    tableComponent,
    pageComponent
  },
  props:{
    selectItem:{
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formCustom:{
        id:"",
        bicycle_no:"",
        lockNo:"",
        enquiriesNo:"",
        docksiteName:"",
        docksiteNo:"",
        item:{}
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '共享单车公司名称',
              key: 'enteringCompanyName',
              minWidth:150,
          },
          {
              title: '车辆数',
              key: 'bikeNum',
              minWidth:150,
               render: (h, params) => {
                 let _this = this;
                  if(params.row.show){
                     return h('Input',{
                        props: {
                            value:params.row.bikeNum,
                        },
                        on: {
                            'on-blur': (e) => {
                              let val = e.target.value
                              if(val>=0){
                                 params.row.bikeNum = val
                                 _this.data[params.index].bikeNum = val
                              }else{
                                _this.$Message.info("车辆数不能为空负数")
                                 params.row.bikeNum = params.row.oldbikeNum
                                 _this.data[params.index].bikeNum = params.row.oldbikeNum
                              }
                            }
                        },
                    })
                  }else {
                    return h('div',params.row.bikeNum)
                  }
              }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              minWidth:100,
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
                              marginTop: '5px',
                              display:!params.row.show?"":"none"
                          },
                          on: {
                              click: () => {
                                 params.row.show = true
                                _this.data[params.index].show = true
                              }
                          }
                      }, '编辑'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:_this.$hasPerm('/bicycledocksite/update_bikeNum')?params.row.show?"":"none":""
                          },
                          on: {
                              click: () => {
                                params.row.show = false
                                _this.data[params.index].show = false
                                _this.save(params.index)
                              }
                          }
                      }, '保存'),
                       h('Button', {
                          props: {
                              type: 'error',
                              size: 'default'
                          },
                          style: {
                              marginRight: '5px',
                              marginTop: '5px',
                              display:params.row.show?"":"none"
                          },
                          on: {
                              click: () => {
                                params.row.show = false
                                _this.data[params.index].show = false
                                params.row.bikeNum = params.row.oldbikeNum
                                _this.data[params.index].bikeNum = params.row.oldbikeNum
                              }
                          }
                      }, '取消'),
                  ]);
              }
          }
      ],
      show:true,
      loading:false,
      pageshow:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formCustom.docksiteName = this.selectItem.docksiteName
    this.formCustom.docksiteNo = this.selectItem.docksiteNo
    this.formCustom.id = this.selectItem.id
    this.list()
  },
  methods: {
    cancel () {
      this.$emit("emitcarmap")
    },
    EmitversionComponent (e) {
      this.formCustom.equipmentNo = e.version
    },
    handleSubmit () {
      this.pageData.pageCurrent = 1
      this.list()
    },
    list () {
      let listdata = {
          data:JSON.stringify({
            id:""+this.formCustom.id,
            token:this.$webapi.get("token")
          })
      }
      let _this = this;
      this.$api.get('/bicycledocksite/other_list',listdata,reset => {
        if (reset.codeId == 1) {
          let data = reset.resData
              data.forEach((a)=>{
                a.show = false
                a.oldbikeNum = a.bikeNum
              })
              _this.data = data
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    save (index) {
      let listdata = {
        data:JSON.stringify({
          id:""+this.data[index].id,
          bikeNum:""+this.data[index].bikeNum,
          token:this.$webapi.get("token"),
        })
      }
      let _this = this;
      this.$api.post('/bicycledocksite/update_bikeNum',listdata,reset => {
        if (reset.codeId == 1) {
           _this.list()
        }else{
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    pageComponentDate(e) {
      this.pageData.pageCurrent = e.pageCurrent
      this.pageData.pagesize = e.pagesize
      this.list()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
