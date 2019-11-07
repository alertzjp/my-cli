<template>
<div class="remapbox">
  <div class="remapbox-hd">
    <div class="">
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <entering-component @EmitcompanyComponent="EmitcompanyComponent" @EmitvalueComponent="EmitvalueComponent" :companyid="formCustom.enteringCompanyId"></entering-component>
        </Col>
        <Col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="mt10">
          <Buttoncomponent title="查询" @emitButton="search" long=1 :loading="loading"></Buttoncomponent>
        </div>
        </Col>
      </Row>
    </div>
    <div class="">
    </div>
  </div>
  <div class="cartip01" v-if="flag==1">
    <div class="iconbox">
      <img class="icon maxwidth36" :src="dayicon.fourday"><span> 【4-6天的沉默车】</span>
    </div>
    <div class="iconbox">
      <img class="icon maxwidth36" :src="dayicon.sevenday"><span> 【7天及以上的沉默车】</span>
    </div>
  </div>
  {{!spinshow}}
  <div class="demo-spin-container" v-if="!spinshow">
    <Spin fix></Spin>
  </div>
  <div id="container"></div>
</div>
</template>
<script>
import enteringComponent from '../../pub/enteringCompany.vue'
var MAP;
var marker = []
var polygons = []
var Mass = []
let infoWindow;
export default {
  name: "",
  components: {
    enteringComponent,
  },
  data() {
    return {
      mapshow: false,
      loading: false,
      spinshow: true,
      windows: [],
      flag: 0,
      data: [],
      // dayicon:['/static/init1.png','/static/init1.png'],
      dayicon: {
        fourday: '',
        sevenday: ''
      },
      clicknum: 0,
      bicycleIconList: [],
      regionScope: [],
      formCustom: {
        enteringCompanyId: '',
      }
    };
  },
  created() {


  },
  mounted() {
    //do something after mounting vue instance
    this.flag = this.$route.query.flag
    this.setMap()
  },
  methods: {
    setMap() {
      MAP = new AMap.Map(
        'container', {
          zoom: 14,
        }
      );
      //  this.getsilenceBicycle()
    },
    search() {
      this.getdata()
    },
    EmitvalueComponent(e) {
      if (e) {
        this.formCustom.enteringCompanyId = Number(e)
        this.getdata()
      }
    },
    EmitcompanyComponent(e) {
      if (e) {
        this.formCustom.enteringCompanyId = Number(e.id)
      }
    },
    cancel() {
      this.$emit("EMITBIAOQIAN")
    },
    geshiDataList(res) {
      var reset = []
      if (res && res.length > 0) {
        if (res[0] && res[0].length > 0) {
          if (res[0][0] == null && res[0][1] == null) {
            reset = []
          } else {
            reset = res
          }
        } else {
          reset = res.map(item => {
            return [item.lng, item.lat]
          })
        }
      }
      return reset
    },
    //渲染片区
    showdist() {
      let _this = this;
      MAP.remove(polygons);
      var polygon = this.regionScope.map(item => {
        let regionScope = (item.regionScope && item.regionScope.length > 0) ? JSON.parse(item.regionScope) : []
        let NewItemlng = _this.geshiDataList(regionScope)
        return new AMap.Polygon({
          path: NewItemlng,
          // strokeColor: "#FF33FF",
          // strokeWeight: 1,
          // strokeOpacity: 1,
          // fillOpacity: 0.8,
          // fillColor: "#00b0ff",
          // zIndex: 50
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
        });
      })
      polygons = polygon
      MAP.add(polygons);
      //MAP.setFitView(polygons);//视口自适应
    },
    //统一接口
    getdata() {
      if (!this.formCustom.enteringCompanyId) {
        this.$Message.warning("请选择要查看的共享单车公司")
        return
      }
      this.loading = true
      this.spinshow = false
      this.dayicon.fourday = '/static/init1.png'
      this.dayicon.sevenday = '/static/init1.png'
      let windows = [];
      let listdata = {
        token: this.$webapi.get('token'),
        type: this.flag,
        enteringCompanyId: this.formCustom.enteringCompanyId,
      }
      let _this = this
      this.$api.get('/tag/shareBikeSP/distribute', listdata, reset => {
        _this.loading = false
        if (reset.codeId === 1) {
          this.data = []
          if (infoWindow) {
            infoWindow.close();
          }
          MAP.remove(Mass);
          let data = reset.resData
          //先获取片区展示
          this.regionScope = (data.fenceList && data.fenceList.length > 0) ? data.fenceList : []
          //执行片区
          this.showdist()

          this.bicycleIconList = data.bicycleIconList || [] //icon集合
          let periphery = "" //默认外围图标
          let style = []
          if (this.bicycleIconList && this.bicycleIconList.length > 0) {
            this.bicycleIconList.map((a) => {
              if (_this.flag == 2 && a.bikeFlag == 2 && a.iconType == 1) {
                //找到外围车中的未点击图标,在车辆列表循环时使用
                periphery = a.iconUrl ? a.iconUrl : "/static/init2.png"
                style.push({
                  url: a.iconUrl ? a.iconUrl : "/static/init2.png",
                  anchor: new AMap.Pixel(3, 3),
                  size: new AMap.Size(26, 34)
                })
              }
              //沉默车图标
              if (_this.flag == 1 && a.bikeFlag == 1 && a.iconType == 1) {
                this.dayicon.fourday = a.iconUrl //4-6天的沉默车
                style.push({
                  url: a.iconUrl,
                  anchor: new AMap.Pixel(3, 3),
                  size: new AMap.Size(26, 34)
                })
              }
              if (_this.flag == 1 && a.bikeFlag == 3 && a.iconType == 1) {
                this.dayicon.sevenday = a.iconUrl //7天及以上的沉默车
                style.push({
                  url: a.iconUrl,
                  anchor: new AMap.Pixel(3, 3),
                  size: new AMap.Size(26, 34)
                })
              }
            })
          }
          this.data = data.bicycleList
          this.spinshow = true

          infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30)
          });

          setTimeout(() => {
            var newdata = data.bicycleList.map(item => {
              let position = [item.gpsLongitude / 1000000, item.gpsLatitude / 1000000]
              item.position = position
              item.companyName = item.enteringCompanyName ? item.enteringCompanyName : item.companyName
              return {
                lnglat: position,
                style: item.color == 2 ? 1 : 0,
                extData: item
              }
            })
            Mass = new AMap.MassMarks(newdata, {
              opacity: 0.8,
              zIndex: 111,
              cursor: 'pointer',
              style: style,

            });

            Mass.on('click', function(e) {
              _this.openInfo(e)
            });

            Mass.setMap(MAP);
          }, 1000)

          if (data.bicycleList && data.bicycleList.length > 0) {
            MAP.setCenter([data.bicycleList[0].gpsLongitude / 1000000, data.bicycleList[0].gpsLatitude / 1000000, ])
          } else {
            let str = _this.flag == 1 ? '沉默车' : _this.flag == 2 ? '外围车' : "车辆"
            this.$Message.info("当前共享公司下没有" + str)
          }
        } else {
          _this.spinshow = false
          _this.$netcode.getApiCode(reset)
        }
      })
    },
    openInfo(e) {
      let _this = this;
      //构建信息窗体中显示的内容
      var data = e.data.extData
      var info = [];
      info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>共享单车编号:【" + data.bikeNo + "】</h4>");
      info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>共享单车公司名称:【" + data.companyName + "】</h4>");
      if (_this.flag == 1) {
        info.push("<p class='input-item' style=\"padding:7px 0px 0px 0px;\">沉默天数:【" + data.day + "】</p></div></div>");
      }
      infoWindow = new AMap.InfoWindow({
        content: info.join("") //使用默认信息窗体框样式，显示信息内容
      });

      infoWindow.open(MAP, e.data.extData.position);
    }
  }
}
</script>
<style lang="less">
.remapbox {
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
    position: relative;
    .prompt {
        width: 160px!important;
        height: 100px!important;
        text-align: left!important;
        word-break: break-all!important;
    }
}
.remapbox-hd {
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 250px;
}
.cartip01 {
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 1000;
    background: rgba(0,0,0,.5);
    color: #fff;
    padding: 10px;
}
#amapDemo01 {
    height: 100%;
}
.amap-demo01 {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100vh!important;
    .el-vue-amap {
        width: 100%;
    }
}
.icon {
    display: inline-block;
    // width: 40px;
    // height: 40px;
    vertical-align: middle;
}
.iconbox {
    margin-bottom: 5px;
}
.icon1 {
    background: url("../../../assets/silencebike11.png") center center no-repeat;
}
.icon2 {
    background: url("../../../assets/silencebike12.png") center center no-repeat;
}

.custom-input-card {
    width: 18rem;
}

.custom-input-card .btn:last-child {
    margin-left: 1rem;
}
.content-window-card {
    position: relative;
    width: 23rem;
    padding: 0.75rem 0 0 1.25rem;
    box-shadow: none;
    bottom: 0;
    left: 0;
}
.content-window-card p {
    height: 2rem;
}
</style>
