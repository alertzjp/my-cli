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
                    <FormItem label="操作类型">
                        {{dataInfo.type==-1?"收车":dataInfo.type==1?"投车":""}}
                     </FormItem>
                  </Col>
                   <Col :xs="24" :sm="12" :md="12" :lg="6">
                    <FormItem label="操作子类型">
                         {{dataInfo.bicycleType==-1?"故障车":dataInfo.bicycleType==1?"新车":""}}
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
    this.dataInfo.type = this.$route.query.type;
    this.dataInfo.docksiteName = this.$route.query.docksiteName;
    this.dataInfo.docksiteNo = this.$route.query.docksiteNo;
    this.dataInfo.bicycleNumber = this.$route.query.bicycleNumber;
    this.dataInfo.bicycleType = this.$route.query.bicycleType;
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
       this.$api.get("/bicycle_put_back/detail", listdata, reset => {
        _this.loading = false;
        if (reset.codeId === 1) {
          _this.data =reset.resData  
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