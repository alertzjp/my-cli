<template>
  <div class="page-component-view">
   <div class="page-component-bd">
     <!--查询条件-->
     <div class="tableListForm">
       <Form ref="formCustom" :model="formCustom" :label-width="90">
           <Row>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                  <FormItem label="片区编号">
                     <Input type="text" v-model="formCustom.districtNo"></Input>
                  </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <FormItem label="片区名称">
                     <Input type="text" v-model="formCustom.name"></Input>
                 </FormItem>
               </Col>
               <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
                 <div class="">
                   <FormItem>
                       <span class="Toolbar70"><Buttoncomponent title="查询"  icon="ios-search" @emitButton="handleSubmit"></Buttoncomponent></span>
                   </FormItem>
                 </div>
               </Col>
           </Row>
       </Form>
     </div>
     <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="">
                 <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
             </div>
             <div class="">
                <page-component :pageData="pageData" @pageComponentDate="pageComponentDate"></page-component>
             </div>
        </Col>
     </Row>
   </div>
    <relevance-component v-if="relevanceshow" :relevanceshow="relevanceshow" @emitcomponent="emitcomponent" :id="propid"></relevance-component>
   </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import relevanceComponent from './relevanceview.vue'

export default {
  name: "",
  components:{
    tableComponent,
    pageComponent,
    relevanceComponent
  },
  data () {
    return {
      loading:false,
      relevanceshow:false,
      propid:"",
      formCustom:{
          districtNo:"",
          name:"",
      },
      pageData:{
          totalCount:1,
          pageCurrent:1,
          pagesize:10,
      },
      data:[],
      columns:[
          {
              title: '片区编号',
              key: 'districtNo',
              minWidth:200,
              fixed:"left"
          },
          {
              title: '片区名称',
              key: 'name',
              minWidth:100,
          },
          {
              title: '创建时间',sortable: true,
              key: "createdAt",
              minWidth:200,
              render: (h, params) => {
                let str = this.$webapi.gettime('time',(params.row.createdAt)/1000)
                return h('div', [
                    h('span', str)
              ])
           }
          },
          {
              title: '创建人',
              key: "createName",
              minWidth:150,
          },
          {
              title: '片区负责人',
              key: "principalsName",
              minWidth:100,
          },
          {
              title: '联系方式',
              key: "mobileNo",
              minWidth:150,
          },
          {
              title: '已关联站点',
              minWidth:150,
              key: 'dockSiteName',
              render: (h, params) => {
                let str="";
                let arr=params.row.dockSiteList;
                for(let i=0;i<arr.length;i++){
                  str+=arr[i].dockSiteName+","
                }
                if(str.length>0){
                  str = str.substr(0, str.length - 1);
                }
                return h('div', [
                    h('span', str)
                ])
             }
          },
          {
              title: '操作',
              key: 'action',
              align: 'center',
              fixed:"right",
              minWidth:150,
              render: (h, params) => {
                  let _this = this;
                  return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'default'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {                                   
                                  _this.relevanceshow=true;
                                  _this.propid=params.row.id;
                                }
                            }
                        }, '关联助力车停靠点'),
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
    handleSubmit() {
      this.list()
    },
    pageComponentDate(e){
      this.pageData.pageCurrent=e.pageCurrent;
      this.pageData.pagesize=e.pagesize;
      this.list();
    },
    emitcomponent(){
      this.relevanceshow=false;
      this.list();
    },
    list () {
      this.loading = true
      let listdata = {
         data:JSON.stringify({
           token:this.$webapi.get('token'),
           pageNo:""+this.pageData.pageCurrent,
           pageSize:""+this.pageData.pagesize,
           districtNo:this.formCustom.districtNo,
           name:this.formCustom.name,
           fenceId:'',
           flag:'2'
         })
      }
      let _this =  this
      this.$api.get('/district/docksite_list',listdata,reset => {
        if (reset.codeId === 1) {
           _this.data = reset.resData.list
           _this.loading = false
           if(reset.resData){
             _this.pageData.totalCount=reset.resData.totalCount;
             _this.pageData.pageCurrent=reset.resData.pageNo;
             _this.pageData.pagesize=reset.resData.pageSize;
           }
        }else if(reset.codeId === -9){
          _this.data = [];
          _this.loading = false;
          _this.pageData=[];
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
