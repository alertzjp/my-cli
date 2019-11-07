<template>
  <div class="">
   <Modal v-model="show" width="760" @on-cancel="cancel" :mask-closable="false" :z-index="100">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>关联站点</span>
      </p>
      <div style="text-align:center">
           <div class="carbox">
              <div class="carbox-hd">
                <Form :model="formValidate"  :label-width="80" :mask-closable="false">
                    <Row>
                      <Col :xs="24" :sm="24" :md="8" :lg="8">
                         <FormItem label="站点名称:">
                              <Input v-model="formValidate.docksiteName" placeholder="站点名称" ></Input>
                          </FormItem>
                      </Col>
                      <!-- <Col :xs="24" :sm="24" :md="8" :lg="8">
                           <FormItem label="站点状态:">
                             <Select v-model="formValidate.status">
                                  <Option value="">全部</Option>
                                  <Option  value="1">运营中</Option>
                                  <Option  value="-1">站点关闭</Option>
                             </Select>
                            </FormItem>
                      </Col> -->
                       <Col :xs="24" :sm="24" :md="8" :lg="8">
                          <div class="">
                            <FormItem>
                                <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                            </FormItem>
                          </div>
                        </Col>
                    </Row>
                </Form>
              </div>
              <div class="carbox-bd">
                <div class="M-carlist">
                    <div class="M-carlist-left">
                      <Table border :columns="columnsdata" :data="data"></Table>
                    </div>
                    <div class="M-carlist-right">
                      <div class="" style="text-align:center;height:38px;line-height:38px;border-bottom:#ddd 1px solid;background:#f8f8f8">
                        已关联站点:{{this.itemdata.length}}
                      </div>
                      <div class="selectcar">
                        <ul>
                          <li v-for="(item,index) in itemdata" @click="delselect(item)">{{item.docksiteName}}
                            <span>
                              <Button type="error" size="small" shape="circle" icon="md-close"></Button>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
                <div class="mt20">
                  <paging :pageData="pageData" @pageComponentDate="pageComponentDate" showsizer="0"></paging>
                </div>
              </div>
           </div>
      </div>
      <div slot="footer">
      </div>
   </Modal>
</div>
</template>
<style lang="less" scoped>
.M-carlist{
  display:flex;
  flex-direction: row;
  .M-carlist-left{
    flex: 1
  }
  .M-carlist-right{
    width: 200px;
    margin-left: 10px;
    border: #ddd 1px solid;
  }
}
.selectcar{
  height: 470px;
  overflow-y: auto;
  ul{
    li{
      float: left;
      width: 100%;
      border-bottom: #ddd 1px solid;
      height: 39px;
      line-height: 39px;
      text-align: left;
      cursor: pointer;
      justify-content: space-around;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    }
  }
}
  .carbox{
    display: block;
    overflow: hidden;
    min-height: 500px;
    .carbox-hd{

    }
  }
</style>
<script>
  import Pages from '../../pub/page.vue'
  // import docksiteComponent from '../pub/bicycledocksite.vue'
  export default {
    components:{
      paging:Pages,
      // docksiteComponent
    },
    props:{
      addshow:{
        default:false
      },
      setlectitem:{
        default(){
          return {}
        }
      },
      type:{
        default:""
      }
    },
    data () {
        return {
            show:false,
            skushow:false,
            formValidate:{
              docksiteName:"",
              status:"1"
            },
            columnsdata: [
                {
                    title: '站点编号',
                    key: 'docksiteNo',
                    minWidth:100
                },
                {
                    title: '站点名称',
                    key: 'docksiteName',
                    minWidth:100,
                },
                {
                    title: '站点状态',
                    key: 'docksiteName',
                    minWidth:100,
                    render: (h, params) => {
                       let str = params.row.status==1?"运营中":"站点关闭"
                        return h('div',str)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width:100,
                    fixed:"right",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'default',
                                },
                                style: {
                                    marginRight: '5px',
                                    display:!params.row.show?"inherit":"none"
                                },
                                on: {
                                    click: () => {
                                      params.row.show = true
                                      this.data[params.index].show = true
                                      // this.itemdata.push(params.row)
                                      this.add(params.row,params.index)
                                    }
                                }
                            }, '关联'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'default',
                                },
                                style: {
                                    marginRight: '5px',
                                    display:params.row.show?"inherit":"none"
                                },
                                on: {
                                    click: () => {
                                      this.delete(params.row)
                                    }
                                }
                            }, '取消')
                        ]);
                    }
                }
            ],
            data:[],
            itemdata:[],
            pageshow:false,
            pageData:{
                totalCount:1,
                pageCurrent:1,
                pageSize:10,
            },
        }
    },
    mounted() {
      this.list()
      this.getlist()
      this.show = true
    },
    methods: {
      handleSubmit () {
        this.pageData.pageCurrent = 1
        this.list()
      },
      EmitComponent (e) {
        this.formValidate.bicycleDocksiteNo = e.docksiteNo
        this.list()
      },
      delselect (e) {
         this.delete(e)
      },
      save () {
        this.exportList()
      },
      cancel (){
        this.itemdata = []
        this.exportList()
      },
      exportList () {
        this.$emit("emitcomponent",false)
      },
      add (e,index) {
        let _this=this;
        let listdata={
            data:JSON.stringify({
              district:{
                districtId:this.setlectitem.id,
                bicycleDockSiteId:e.id
              },
              token:this.$webapi.get('token')
            })
        }
        this.$api.post('/districtbicycle/add',listdata,reset => {
          if (reset.codeId === 1) {
            _this.getlist()
            _this.$nextTick(()=>{
              _this.data[index].show = true
            })
            _this.itemdata.push(e)
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      },
      delete (e) {
        let _this=this;
        let listdata={
            data:JSON.stringify({
              bicycleDockSiteId:""+e.id,
              token:this.$webapi.get('token')
            })
        }
        this.$webapi.getMessinfo({
          title:"确定要取消关联【"+e.docksiteName+"】吗?",
          yes () {
            _this.$api.post('/districtbicycle/delete/by_bicycleDockSiteId',listdata,reset => {
              if (reset.codeId === 1) {
                _this.getlist()
                _this.list()
              }else {
                _this.$netcode.getApiCode(reset)
             }
            })
          }
        })
      },
      list () {
        let listdata = {
          data:JSON.stringify({
              pageNo:""+this.pageData.pageCurrent,
              pageSize:""+this.pageData.pageSize,
              token:this.$webapi.get('token'),
              docksiteName:this.formValidate.docksiteName,
              status:this.formValidate.status
          })
        }
        let _this =  this
        this.$api.get('bicycledocksite/listNoDistrict',listdata,reset => {
          if (reset.codeId === 1) {
              _this.data = []
              let data = reset.resData.list
              if(data.length>0){
                  if(_this.itemdata.length>0){
                    data.forEach(function (a) {
                       let idx = 0
                       _this.itemdata.forEach(function (b) {
                         if(a.docksiteNo == b.docksiteNo){
                            a.show = true
                            idx = 1
                         }
                       })
                       if(idx==0){
                         a.show = false
                       }
                    })
                  }else {
                    data.forEach(function (a) {
                      a.show = false
                    })
                  }
                   _this.data = data
              }else {
                data.forEach(function (a) {
                  a.show = false
                })
                 _this.data = data
              }
             _this.pageData.totalCount = reset.resData.totalCount
             _this.pageshow = true
          }else if(reset.codeId === -9){
            _this.data = []
            _this.pageData.pageCurrent = 1
            _this.pageData.totalCount = 0
            _this.pageshow = true
          }
        })
      },
      getlist () {
        let _this=this;
        let listdata={
          districtId:this.setlectitem.id,
          token:this.$webapi.get('token'),
          pageNo:1,
          pageSize:10000
        }
        this.$api.get('/bicycledocksite/find/by_districtId',listdata,reset => {
          if (reset.codeId === 1) {
            _this.itemdata = reset.resData.list
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      },
      handleSubmit () {
        this.pageData.pageCurrent = 1
        this.list()
      },
      pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        // this.pageData.pagesize = e.pagesize
        this.list()
      },
      skucomponentemit (e){
         this.formValidate.skuId = e
         this.list()
      },
      carmodelselect01 (e) {
         this.formValidate.modelId = e.id
         this.list()
      },
      wareemitcomponent (e) {
        this.formValidate.warehouseId = e
      },
    }
}
</script>
