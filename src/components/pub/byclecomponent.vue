<template>
  <div class="">
   <Modal v-model="show" width="760" @on-cancel="cancel" :mask-closable="false">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>投放车辆</span>
      </p>
      <div style="text-align:center">
           <div class="carbox">
              <div class="carbox-hd">
                <Form :model="formValidate"  :label-width="80" :mask-closable="false">
                    <Row>
                      <Col :xs="24" :sm="24" :md="8" :lg="8">
                             <FormItem label="二维码编号:">
                                  <Input v-model="formValidate.bicycle_no" placeholder="二维码编号" @on-blur="viinput"></Input>
                              </FormItem>
                      </Col>
                      <!-- <Col :xs="24" :sm="24" :md="8" :lg="8">
                         <FormItem label="车辆状态:">
                           <Select v-model="formValidate.bicycle_status">
                               <Option value="0">待投放</Option>
                               <Option value="1">可租</Option>
                               <Option value="2">骑行</Option>
                               <Option value="3">维护开锁</Option>
                               <Option value="4">报废</Option>
                               <Option value="5">车辆故障</Option>
                               <Option value="6">带回</Option>
                               <Option value="7">维修完成</Option>
                               <Option value="8">临时停车</Option>
                               <Option value="9">调度</Option>
                            </Select>
                          </FormItem>
                      </Col> -->
                      <!-- <Col :xs="24" :sm="24" :md="8" :lg="8">
                         <FormItem label="站点:">
                            <docksite-component @EmitComponent="EmitComponent"></docksite-component>
                          </FormItem>
                      </Col> -->
                       <!-- <Col :xs="24" :sm="24" :md="8" :lg="8">
                          <div class="">
                            <FormItem>
                                <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                            </FormItem>
                          </div>
                        </Col> -->
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
                        已选择车辆:{{this.itemdata.length}}
                      </div>
                      <div class="selectcar">
                        <ul>
                          <li v-for="(item,index) in itemdata" @click="delselect(item.bicycleNo,index)">{{item.bicycleNo}}
                            <span>
                              <Button type="error" size="small" shape="circle" icon="md-close"></Button>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
                <div class="mt20">
                  <paging :pageData="pageData" @pageComponentDate="pageComponentDate"></paging>
                </div>
              </div>
           </div>
      </div>
      <div slot="footer">
         <Button type="primary" @click="save()">保存</Button>
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
  height: 410px;
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
  import Pages from '../pub/page.vue'
  import docksiteComponent from '../pub/bicycledocksite.vue'
  export default {
    components:{
      paging:Pages,
      docksiteComponent
    },
    props:{
      addshow:{
        default:false
      },
      detailData:{
        default:{}
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
              bicycleDocksiteNo:'',
              lockNo:"",
              bicycle_no:"",
              bicycle_status:"0"
            },
            columnsdata: [
                {
                    title: '车辆型号',
                    key: 'model',
                    minWidth:100,
                    fixed:"left"
                },
                {
                    title: '二维码编号',
                    key: 'bicycleNo',
                    minWidth:100,
                },
                {
                    title: '车锁编号',
                    key: 'lockNo',
                    minWidth:100,
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
                                    display:!params.row.show?"":"none"
                                },
                                on: {
                                    click: () => {
                                      this.data[params.index].show = true
                                      this.itemdata.push(params.row)
                                    }
                                }
                            }, '加入'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'default',
                                },
                                style: {
                                    marginRight: '5px',
                                    display:params.row.show?"":"none"
                                },
                                on: {
                                    click: () => {
                                      this.data[params.index].show = false
                                      this.itemdata.forEach((a,index)=>{
                                        if(a.bicycleNo == params.row.bicycleNo){
                                          this.itemdata.splice(index,1)
                                          return
                                        }
                                      })
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
      this.show = true
      this.list()
    },
    methods: {
      viinput () {
        this.list()
      },
      EmitComponent (e) {
        this.formValidate.bicycleDocksiteNo = e.docksiteNo
        this.list()
      },
      delselect (bicycleNo,index) {
        this.itemdata.splice(index,1)
        this.data.forEach((a)=>{
          if(a.bicycleNo == bicycleNo){
            a.show = false;
            return
          }
        })
      },
      save () {
        this.exportList()
      },
      cancel (){
        this.itemdata = []
        this.exportList()
      },
      exportList () {
        this.$emit("addcarcomponent",this.itemdata)
      },
      list () {
        let listdata = {
          data:JSON.stringify({
              pageNo:""+this.pageData.pageCurrent,
              pageSize:""+this.pageData.pageSize,
              token:this.$webapi.get('token'),
              bicycle_status:this.formValidate.bicycle_status,
              bicycle_no:this.formValidate.bicycle_no,
              bicycleDocksiteNo:this.formValidate.bicycleDocksiteNo
          })
        }
        let _this =  this
        this.$api.get('/bicycle/list',listdata,reset => {
          if (reset.codeId === 1) {
              _this.data = []
              let data = reset.resData.list
              if(data.length>0){
                  if(_this.itemdata.length>0){
                    data.forEach(function (a) {
                       let idx = 0
                       _this.itemdata.forEach(function (b) {
                         if(a.bicycleNo == b.bicycleNo){
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
      handleSubmit () {
        this.pageData.pageCurrent = 1
        this.list()
      },
      pageComponentDate (e) {
        this.pageData.pageCurrent = e.pageCurrent
        this.pageData.pageSize = e.pagesize
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
