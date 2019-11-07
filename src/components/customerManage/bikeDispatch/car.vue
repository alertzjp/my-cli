<template>
   <div class="page-component-view" v-if="show">
     <div class="page-component-bd p20">
       <div class="pagelist">
          <div class="pagelist-hd">
            操作信息
          </div>
          <div class="pagelist-bd">
             <Form :label-width="80">
                <Row>
                  <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="操作人">
                           {{dataInfo.maintainerName}}
                     </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="12" :lg="6">  
                    <FormItem label="调度类型">
                        {{dataInfo.dispatchType==1?"车辆调度":dataInfo.dispatchType==2?"沉默车调度":""}}
                     </FormItem>
                  </Col>
                   <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="调出/调入">
                         {{dataInfo.isCallout==0?"调入":dataInfo.isCallout==1?"调出":""}}
                     </FormItem>
                  </Col>                   
                  <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="站点名称">
                           {{dataInfo.docksiteName}}
                    </FormItem>
                  </Col>
                  <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="站点编号">
                           {{dataInfo.docksiteNo}}
                    </FormItem>
                  </Col>
                   <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="车辆数">
                        {{data.length}}
                    </FormItem>
                  </Col>
                </Row>
            </Form>
          </div>
       </div>
       <div class="pagelist">
          <div class="pagelist-hd">
            车辆列表
          </div>
          <div class="pagelist-bd">
            <Row>
              <Col :xs="24" :sm="12" :md="8" :lg="4" v-for="item in data">【{{item}}】</Col>
            </Row>             
          </div>
       </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {},
      show:false,
      dataInfo:{},
      itemID:"",
      url:""
    };
  },
  mounted() { 
    this.itemID = this.$route.query.id || null;
    this.dataInfo.maintainerName = this.$route.query.maintainerName;
    this.dataInfo.dispatchType = this.$route.query.dispatchType;
    this.dataInfo.docksiteName = this.$route.query.docksiteName;
    this.dataInfo.docksiteNo = this.$route.query.docksiteNo;
    this.dataInfo.bicycleNumber = this.$route.query.bicycleNumber;
    this.dataInfo.isCallout = this.$route.query.isCallout;
    if (this.itemID) {
      this.list();
    }
  },
  methods: {
    list() {
      let listdata = {
        token: this.$webapi.get("token"),
        id: "" + this.itemID
      };
      let _this = this;
      this.loading = true;
      let url = "";
       this.$api.get("/bicycle_dispatch_new/dispatch_bicycle/list", listdata, reset => {
        _this.loading = false;
        if (reset.codeId === 1) {
          _this.data =reset.resData.bicycleNos  
          _this.show = true          
        } else {
          _this.$netcode.getApiCode(reset);
        }
      });
    },   
    exportfile() {
      let _this = this;
      this.$router.push({
        path:_this.url
      })
    }
  }
};
</script>