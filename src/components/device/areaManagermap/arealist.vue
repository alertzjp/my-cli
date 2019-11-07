<template>
  <div class="areaManager-box" :style="areaHeight">   
    <div class="areaManger" id="areaManger"></div>
    <div class="areaTool">
      <areasearch-component @emitAreaSearch="emitAreaSearch" v-if="areaType!=1 && areaType!=2"></areasearch-component>   
      <div class="areaToolItem areabtn fl mr10" @click="adddistrict" v-if="areaType==0">绘制片区</div>
      <div class="areaToolItem areabtn fl mr10" @click="closeStart" v-if="areaType==1">取消绘制片区</div>
      <div class="areaToolItem areabtn fl mr10 red" @click="showsiteList" v-if="NositeList && NositeList.length>0">有{{NositeList.length}}个站点未在片区中 
        {{!nositeShow?"点击查看":"点击隐藏"}}
        </div>       
      <site-component :siteItemList="siteItemList" v-if="siteItemshow" @emitSite="emitSite"></site-component>         
      <addedit-component v-if="areaType==1" :type="areaType" :regionScope="overlays" :AllPolygon="AllPolygon01"  @emitarea="emitarea" :districtItem="districtItem" :cursiteshow="cursiteshow"></addedit-component>  
      <edit-component v-if="areaType==2" :type="areaType" :emitIndex="emitIndex" :AllPolygon="AllPolygon01" :regionScope="regionScope" @emitClosearea="emitClosearea" @emitarea="emitarea" :districtItem="districtEmitItem" :cursiteshow="cursiteshow"></edit-component> 
      <areaview-component v-if="areaType==3" :type="areaType" :regionScope="regionScope"  @emitClosearea="emitClosearea" :districtItem="districtItem" @emitsavedraw="emitsavedraw" @delsavedraw="delsavedraw"></areaview-component>   
    </div>    
  </div>
</template>
<script>
import areasearchComponent from "./areasearch.vue";
import areamanagerComponent from "./areamanager.vue";
import siteComponent from "./siteview.vue";
import maintainComponent from "../../pub/maintainerIdcomponentnew.vue"
import addeditComponent from "./addedit.vue"
import editComponent from "./edit.vue"
import areaviewComponent from "./areaview.vue"
import { mapState,mapGetters } from 'vuex'
import { parse } from 'path';
let MAP;
var mouseTool; //绘画工具
var polygonItem;
var polygonEditItem;
var polygon;
var polyEditor;
var contextMenuMap;
var markers = [];
var marker;
var SiteMarkers = [];
var AllPolygon = [];
var selectAppID = null;
var lockstatus = 0; 
export default {
  inject:['reload'],
  name:"areaManagermapList",
  data() {
    return {
      show: false,
      areaType: 0, //1添加，2编辑，3查看详情
      searchType: 0, //搜索条件type 1 片区名称,2片区编号，3站点名称，4站点编号
      areashow: false,
      nositeShow:false,       
      overlays: [],
      allsiteList:[],
      areaHeight: {},
      regionScope: [],
      editshow: false,
      newSiteData:[],
      districtList: [],
      districtItem:{},
      districtEmitItem: {
        districtName:"",
        districtNo:"",
        latitude:"",
        longitude:"", 
        maintaintorList:[],
        principalsId:"",
        principalsTel:"",
        regionScope:[],
        id:""
      },
      NositeList:[],
      addshow: true,
      center:[],
      zoom:13,
      _amap_id:0,
      icon:"/static/bikesite.png",
      poimarker:"/static/poimarker.png",
      formItem:{
        districtName:"",
        districtNo:""
      },
      siteItemList:{}, //站点信息
      siteItemshow:false, //站点状态
      cursiteshow:false,//当前操作片区是否覆盖
      emitIndex:-1, 
      AllPolygon01:[] 
    };
  },
  components: {
    areasearchComponent,
    areamanagerComponent,
    siteComponent,
    maintainComponent,
    addeditComponent,
    areaviewComponent,
    editComponent
  },  
  beforeDestroyed() { 
    this.$vm.$off('updateEmit') 
  }, 
  computed:{
    disshow () {
      return this.districtItem.regionScope && this.districtItem.regionScope.length<1
    }
  }, 
  mounted() {
    let _this = this;      
    setTimeout(()=>{
      _this.map()      
    },300)    
  },
  destroyed() { 
      if(MAP){
        MAP.destroy();
      }
  },  
  methods: { 
    map() {
      let _this = this; 
      const overlays = this.$webapi.get("addItem")
      const areaType = _this.$route.query.type || 0 
      const districtId = _this.$route.query.districtId || 0  
      const addItem = JSON.parse(this.$webapi.get("addItem"))
        MAP = new AMap.Map('areaManger'); 
        MAP.on('zoomend', _this.getSiteList);  
        MAP.on('click',(e)=>{
          if(_this.areaType!=1 && _this.areaType!=2){
            _this.areaType = 0;
          }                     
           _this.siteItemshow = false; 
           _this.showSiteList()          
        })
        _this.areashow = false;
        _this.addshow = true;
        _this.siteItemshow = false;
        _this.cursiteshow = false;        
        _this.areaType = _this.areaType>0?_this.areaType:this.$webapi.get("areaType")?this.$webapi.get("areaType"):0
        _this.overlays = this.$webapi.get("addItem")?addItem.regionScopedata:[]
        
        AllPolygon = []
        selectAppID = null; 
        polygon = null;  
        
        setTimeout(()=>{
          _this.getList();        
        },500)  
 
 
      if(areaType==2){
        setTimeout(() => {
          let districtEmitItem = _this.$webapi.get("emitData");               
          let itemdata = {}          
          if(districtEmitItem){
             itemdata = JSON.parse(_this.$webapi.get("emitData"))             
          }else{
            itemdata = _this.districtList.find(item=>item.id==districtId)   
            itemdata.longitude =  (itemdata.longitude)>0?(itemdata.longitude)/1000000:0    
            itemdata.latitude =  (itemdata.latitude)>0?(itemdata.latitude)/1000000:0
            // itemdata.regionScope = JSON.parse(itemdata.regionScope)    
          }           
          itemdata.regionScope =  _this.geshiDataList(itemdata.regionScope)   
          _this.districtEmitItem = itemdata    
          _this.$webapi.save("emitData",JSON.stringify(_this.districtEmitItem))    
          _this.emitsavedraw(_this.districtEmitItem.id)    
          _this.areaType = areaType 
        }, 1000);
      }


      if(areaType==0){
        setTimeout(() => {
           MAP.setZoom(_this.zoom); 
           if(_this.districtList && _this.districtList.length>0){
             let itemdata = this.districtList[0];                 
              MAP.setCenter([itemdata.longitude/1000000,itemdata.latitude/1000000]);
           }            
        }, 1500);
      }

      
      if(_this.overlays.length>0){         
        setTimeout(()=>{   
         _this.showmapdistrict(_this.overlays)
         _this.edmitStart();
         MAP.setCenter(_this.overlays[0]);
         console.log(_this.districtItem)
        //  if(itemdata.longitude && itemdata.latitude && itemdata.latitude!=0  && itemdata.longitude!=0){
        //         let lnglat = [itemdata.longitude/1000000,itemdata.latitude/1000000]                  
        //           markers = [];
        //           marker = new AMap.Marker({
        //             map: MAP,
        //             icon:_this.poimarker,
        //             position: lnglat
        //           });          
        //           markers.push(marker); 
        //       }
        },1500)
      }else if(addItem && _this.overlays.length<0){
        setTimeout(() => {
          _this.adddistrict()
        }, 1000);
      }

      if((areaType==1 || _this.areaType==1) && _this.overlays.length<1){
         setTimeout(() => {
          _this.adddistrict()
        }, 1000);
      }         
    },
    //初始化默认是大小
    showSiteList () { 
      let _this = this;
      let zomm = MAP.getZoom()
      this.newSiteData.forEach((item)=>{
        item.show = false
      })      
      console.log(1111)
      if(this.nositeShow){
        if(zomm>=15){
          let data = this.newSiteData.filter(item=>item.districtId==undefined)   
              this.siteiconList(data)
        }        
      }else {
        if(zomm>=15){
          this.siteiconList(_this.newSiteData)              
        } 
      }                 
    },
     //格式转化
    geshiDataList (res) {
      var reset = []
      if(res && res.length>0){
        if(res[0] && res[0].length>0){
          if(res[0][0]==null && res[0][1]==null){
            reset = []
          }else{
            reset = res 
          }         
        }else{
          reset = res.map(item=>{
            return [item.lng,item.lat]
          })          
        }
      }
       return reset
    },
    emitSite () {
        this.siteItemshow = false; 
    },

    emitsavedraw (e) {  
      let _this = this; 
       this.AllPolygon01 = AllPolygon;  
       let newItem = AllPolygon.find(item=>item.Uh.extData.id==e)
          //编辑的片区的过来ID，从渲染片区的里面寻找是否有的
          if(newItem){           
            let lnglat = [(newItem.Uh.extData.longitude)/1000000,(newItem.Uh.extData.latitude)/1000000]
            polyEditor = new AMap.PolyEditor(MAP, newItem);
            polyEditor.open();      
            this.areaType = 2
            markers = [];
            marker = new AMap.Marker({
              map: MAP,
              icon:_this.poimarker,
              position: lnglat
            });          
            markers.push(marker); 
          }else if(_this.districtEmitItem.regionScope.length>0){               
            _this.showmapdistrict(_this.districtEmitItem.regionScope)
            _this.edmitStart(); 
            if(_this.districtEmitItem.longitude && _this.districtEmitItem.latitude && _this.districtEmitItem.latitude!=0  && _this.districtEmitItem.longitude!=0){
                let lnglat = [parseFloat(_this.districtEmitItem.longitude),parseFloat(_this.districtEmitItem.latitude)]  
                markers = [];
                marker = new AMap.Marker({
                  map: MAP,
                  icon:_this.poimarker,
                  position: lnglat
                });          
                markers.push(marker); 
                 setTimeout(() => {
                  MAP.setZoom(_this.zoom); 
                  MAP.setCenter(lnglat); 
                }, 2000); 
            }
          }else{          
            _this.regionScope = []
            mouseTool = new AMap.MouseTool(MAP);
            mouseTool.on("draw", function(type, obj) {  
              polygonEditItem = type.obj;
              var path = polygonEditItem.getPath(); //取得绘制的多边形的每一个点坐标   
                _this.districtEmitItem.regionScope = path.map(item=>{
                  return [item.lng,item.lat]
                });       
                _this.$webapi.save("emitData",JSON.stringify(_this.districtEmitItem))        
                mouseTool.close(true); //关闭，并清除覆盖物                                 
                _this.showmapdistrict(_this.districtEmitItem.regionScope);  
                _this.edmitStart();          
            });
            this.draw("polygon");
            this.$Message.error({
                content: '【未绘制片区，请绘制】',
                duration: 5
            });     
        }   
    },
    emitClosearea () {
      if(polyEditor){
        polyEditor.close(); 
      }       
      this.areaType = 0
    },
    //搜索条件返回
    emitAreaSearch (e){ 
      let _this = this;  
      setTimeout(()=>{        
        //搜索过程的，没有片区的ID，就是隐藏片区信息        
        if(e.districtId){            
          const itemdata = _this.districtList.find(item=>item.id==e.districtId)              
          _this.districtItem = itemdata
          _this.areaType = 3; 
          _this.siteItemshow = false;                    
          _this.opendistrict(itemdata)          
        }else{
          _this.areaType = 0; 
          _this.siteItemshow = false;   
        }    
      },100)
      if(e.type==3 || e.type==4){         
        setTimeout(()=>{       
            _this.getSiteList(1,e.docksiteNo)           
            _this.areashow = true;  
            _this.siteItemList = {
              id:e.docksiteId,
              docksiteName:e.docksiteName
            }
          _this.siteItemshow = true        
        },500)
      } 
    },
    showsiteList (){ 
        let _this = this;
        if(this.areaType==3){
          this.areaType = 0
        }
        this.nositeShow = !this.nositeShow;
        MAP.setZoom(this.zoom);           
        MAP.setCenter([120.087273,30.894418]);         
        if(this.nositeShow){
           var zoom = MAP.getZoom();      
            if(SiteMarkers && SiteMarkers.length>0){
              MAP.remove(SiteMarkers) 
              SiteMarkers = [] 
            }         
            let siteList = [] 
            this.NositeList.forEach((a)=>{
              if(a.longitude && a.latitude){
                siteList.push(a)
              }        
            })
            if(siteList&& siteList.length>0){
              siteList.forEach((a)=>{  
                  let longitude = a.longitude?((a.longitude)/1000000).toFixed(6):0;
                  let latitude = a.longitude?((a.latitude)/1000000).toFixed(6):0          
                  var marker = new AMap.Marker({
                      position: new AMap.LngLat(longitude, latitude),
                      icon:"/static/bikesitesamll.png",
                      imageSize:new AMap.Size(40, 40),
                      extData:a
                  });
                  marker.on('click',(e)=>{  
                    console.log(e)
                     if(this.areaType!=0 && this.areaType!=3 && this.areaType!=undefined){
                       return
                     }  
                    _this.siteItemList = e.target.Uh.extData
                    _this.siteItemshow = true
                    _this.districtItem = _this.districtList.map(item=>item.id==e.target.Uh.extData.districtId)                 
                    if(e.target.Uh.extData.districtId){
                        _this.areaType =3                     
                        _this.districtItem = {id:e.target.Uh.extData.districtId}    
                    }else{
                      _this.areaType =0 
                      _this.areashow = false  
                    }      
                    _this.getSiteList(1,e.target.Uh.extData.docksiteNo) 
                  })  
                SiteMarkers.push(marker);  
              })               
              setTimeout(()=>{           
                MAP.add(new AMap.OverlayGroup(SiteMarkers));    
              },300) 
            } 
        }else{
          MAP.remove(SiteMarkers) 
        }                 
    },
    //获取片区
    getList() {       
      let _this = this; 
      let newSiteData = [];
      let params = this.formItem;  
          params.token = this.$webapi.get("token")
      this.cursiteshow = false;  
      let districtId =  this.$route.query.districtId   
      let areaType = this.$route.query.type || 0
      AllPolygon = []; 
      this.$api.get("/district/getListOnMap",params,reset => {
        if (reset.codeId == 1) {          
          let data = reset.resData.districtList;         
          _this.NositeList = reset.resData.noDistrictSite; 
          reset.resData.noDistrictSite.forEach((a)=>{
             a.noshow = true
          })           
          newSiteData = newSiteData.concat(reset.resData.noDistrictSite)             
          data.forEach((a,index) => {
            a.itemindex = index
            a.regionScope = a.regionScope?JSON.parse(a.regionScope):[];
            a.docksiteList.forEach((b)=>{
              b.districtId = a.id,
              b.districtName = a.districtName,
              b.districtNo = a.districtNo
            })
            newSiteData = newSiteData.concat(a.docksiteList)
          });   
          var districtId = _this.$route.query.districtId
          var areaType = _this.$route.query.type || 0

          data.forEach((a, index) => {            
             a.regionScope = _this.geshiDataList(a.regionScope)
            if(a.regionScope && a.regionScope.length>0){           
              let fillOpacity = areaType==2?(parseInt(districtId)==a.id)?0.6:0.3:0.3;
              if(areaType==2 && a.id !=districtId){
                AllPolygon.push(
                      new AMap.Polygon({
                        path: a.regionScope,
                        strokeColor: "#00b0ff",
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        fillOpacity: fillOpacity,
                        fillColor: "#00b0ff",
                        zIndex: index,
                        extData:{
                          id:a.id,
                          districtName:a.districtName,
                          districtNo:a.districtNo,
                          latitude:a.latitude,
                          longitude:a.longitude,                   
                          show:a.regionScope.length>=2
                        }
                      })
                )  
              }
              if(areaType!=2){
                AllPolygon.push(
                      new AMap.Polygon({
                        path: a.regionScope,
                        strokeColor: "#00b0ff",
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        fillOpacity: fillOpacity,
                        fillColor: "#00b0ff",
                        zIndex: index,
                        extData:{
                          id:a.id,
                          districtName:a.districtName,
                          districtNo:a.districtNo,
                          latitude:a.latitude,
                          longitude:a.longitude,                   
                          show:a.regionScope.length>=2
                        }
                      })
                )
              }                             
            }                   
          });
          _this.districtList = data;
          _this.newSiteData = newSiteData           
          if(AllPolygon && AllPolygon.length>0){            
             AllPolygon.forEach((item,index)=>{  
               if(item.Uh.extData.show){
                 _this.allshowmapdistrict(item,index)
               }        
            })  
          }       
        }
      });
      setTimeout(() => {
        if(_this.areaType==2){
           _this.opendistrict(_this.districtEmitItem)
        } 
      }, 2000);   
    }, 
    //片区下的站点
    opendistrict(Newitem) {  
       let _this = this;
      MAP.remove(SiteMarkers)
      if(_this.areaType!=2){
        let zoom = MAP.getZoom()  
        MAP.setZoom(15)            
      }
      if(Newitem.longitude && Newitem.latitude){
        MAP.setCenter([(Newitem.longitude)/1000000, (Newitem.latitude)/1000000]);
      }              
      SiteMarkers = []     
      let disData = this.newSiteData.filter(item=>item.districtId==Newitem.id);           
      if(disData&& disData.length<1){
        if(parseInt(_this.areaType)!=2){
           this.$Message.info("【"+Newitem.districtName+"】片区下没有站点")
        }       
        return
      }else{
        this.siteiconList(disData) 
      }      
    },
    siteiconList (disData) { 
      let _this = this;
      MAP.remove(SiteMarkers) 
      SiteMarkers = []
      disData.forEach((a)=>{
        a.show = false;
      })        
      disData.forEach((a,index)=>{
          let longitude = a.longitude?((a.longitude)/1000000).toFixed(6):0;
          let latitude = a.longitude?((a.latitude)/1000000).toFixed(6):0                
          var marker = new AMap.Marker({
              position: new AMap.LngLat(longitude, latitude),
              icon:a.status==1?a.show?"/static/bikesite.png":"/static/bikesitesamll.png":a.show?"/static/nobikesite.png":"/static/nobikesitesamll.png",
              imageSize:a.show?new AMap.Size(40, 46):new AMap.Size(30, 34),
              zIndex:a.status==1?100:99,
              extData:a,
              itemindex:index
          });
          marker.on('click',(e)=>{      
            console.log(e)                         
            if(this.areaType==1 || this.areaType==2){
              return
            }            
            _this.siteItemList = e.target.Uh.extData
            _this.siteItemshow = true
            if(e.target.Uh.extData.districtId){
                _this.districtItem = {id:e.target.Uh.extData.districtId} 
                _this.areaType =3; 
                _this.areashow = true; 
                let zomm = MAP.getZoom()
                if(zomm>15){
                   MAP.setZoom(zomm)   
                }else{
                   MAP.setZoom(15)   
                }                                    
            }else{
                _this.areaType =0 
                _this.areashow = false  
            }
            disData.forEach((a)=>{
              a.show = false;
            })           
            disData[e.target.Uh.itemindex].show = true
            this.siteiconList(disData)
           })  
        SiteMarkers.push(marker);  
      }) 
      setTimeout(()=>{           
        MAP.add(new AMap.OverlayGroup(SiteMarkers));    
      },300)
    },
    //站点地图
    getSiteList(type,no){
      let _this = this;     
      var zoom = MAP.getZoom();      
      if(type==1){
        MAP.remove(SiteMarkers) 
        SiteMarkers = [] 
      }          
      this.newSiteData.forEach((a)=>{
        if(a.docksiteNo == no){
          a.show = true;
        }else{
          a.show = false;
        }        
      })
       if(parseInt(zoom)>this.zoom){  
        this.newSiteData.forEach((a)=>{
              if(a.longitude && a.longitude && a.longitude!=0 && a.latitude!=0){
                let longitude = a.longitude?((a.longitude)/1000000).toFixed(6):0;
                let latitude = a.longitude?((a.latitude)/1000000).toFixed(6):0                
                var marker = new AMap.Marker({
                    position: new AMap.LngLat(longitude, latitude),
                    icon:a.status==1?a.show?"/static/bikesite.png":"/static/bikesitesamll.png":a.show?"/static/nobikesite.png":"/static/nobikesitesamll.png",
                    imageSize:a.show?new AMap.Size(40, 46):new AMap.Size(30, 34), 
                    extData:a
                });
                marker.on('click',(e)=>{ 
                   console.log(e)  
                  _this.siteItemList = e.target.Uh.extData
                  _this.siteItemshow = true
                  if(e.target.Uh.extData.districtId){
                      _this.districtItem = {id:e.target.Uh.extData.districtId} 
                      _this.areaType =3; 
                      _this.areashow = true;
                      let zomm = MAP.getZoom()
                        if(zomm>15){
                          MAP.setZoom(zomm)   
                        }else{
                          MAP.setZoom(15)   
                        }                        
                  }else{
                    _this.areaType =0 
                    _this.areashow = false  
                  }
                  _this.getSiteList(1,e.target.Uh.extData.docksiteNo)              
                })  
              SiteMarkers.push(marker);
            }
          })               
          setTimeout(()=>{           
            MAP.add(new AMap.OverlayGroup(SiteMarkers));    
          },300)          
      }else if(this.nositeShow || this.areaType!=0){
         MAP.remove(SiteMarkers)
         SiteMarkers = [];  
         if(this.nositeShow || this.areaType!=0){
              if(this.nositeShow){
                this.newSiteData.forEach((a)=>{
                    if(a.noshow){
                      if(a.longitude && a.longitude && a.longitude!=0 && a.latitude!=0){
                          let longitude = a.longitude?((a.longitude)/1000000).toFixed(6):0;
                          let latitude = a.longitude?((a.latitude)/1000000).toFixed(6):0                
                          var marker = new AMap.Marker({
                              position: new AMap.LngLat(longitude, latitude),
                              icon:a.status==1?a.show?"/static/bikesite.png":"/static/bikesitesamll.png":a.show?"/static/nobikesite.png":"/static/nobikesitesamll.png",
                              imageSize:a.show?new AMap.Size(40, 46):new AMap.Size(30, 34), 
                              extData:a
                          });
                          marker.on('click',(e)=>{       
                            console.log(e)          
                            _this.siteItemList = e.target.Uh.extData
                            _this.siteItemshow = true;
                            if(e.target.Uh.extData.districtId){
                                _this.districtItem = {id:e.target.Uh.extData.districtId} 
                                _this.areaType =3; 
                                _this.areashow = true;  
                                let zomm = MAP.getZoom()
                                  if(zomm>15){
                                    MAP.setZoom(zomm)   
                                  }else{
                                    MAP.setZoom(15)   
                                  }                                
                            }else{
                              _this.areaType = 0 
                              _this.areashow = false;  
                            }
                            _this.getSiteList(1,e.target.Uh.extData.docksiteNo)              
                          })  
                        SiteMarkers.push(marker); 
                      }
                    }
                }) 
              }            
                //这里还包含了片区查看，或者片区编辑的情况
                if(_this.areaType==2 || _this.areaType==3){
                 this.newSiteData.forEach((a)=>{
                  if(a.districtId == _this.districtItem.id){
                       if(a.longitude && a.longitude && a.longitude!=0 && a.latitude!=0){
                         let longitude = a.longitude?((a.longitude)/1000000).toFixed(6):0;
                          let latitude = a.longitude?((a.latitude)/1000000).toFixed(6):0                
                          var marker = new AMap.Marker({
                              position: new AMap.LngLat(longitude, latitude),
                              icon:a.status==1?a.show?"/static/bikesite.png":"/static/bikesitesamll.png":a.show?"/static/nobikesite.png":"/static/nobikesitesamll.png",
                              imageSize:a.show?new AMap.Size(40, 46):new AMap.Size(30, 34), 
                              extData:a
                          });
                          marker.on('click',(e)=>{  
                            console.log(e)               
                            _this.siteItemList = e.target.Uh.extData
                            _this.siteItemshow = true
                            if(e.target.Uh.extData.districtId){
                                _this.districtItem = {id:e.target.Uh.extData.districtId} 
                                _this.areaType =3; 
                                _this.areashow = true;                    
                            }else{
                              _this.areaType =0 
                              _this.areashow = false  
                            }
                            _this.getSiteList(1,e.target.Uh.extData.docksiteNo)              
                          })  
                        SiteMarkers.push(marker);
                     }                      
                  }
                })  
              }   
          }           
          setTimeout(()=>{           
            MAP.add(new AMap.OverlayGroup(SiteMarkers));    
          },300)
      }
      else{
         MAP.remove(SiteMarkers)
         SiteMarkers = [];           
      } 
    },  
    //创建片区
    adddistrict() {      
      let _this = this;          
      this.areaType = 1      
      this.addshow = false;
      this.areashow = true;
      this.editshow = false;
      this.siteItemshow = false 
      this.AllPolygon01 = AllPolygon    
      this.Setarea()    
      mouseTool = null;    
      mouseTool = new AMap.MouseTool(MAP);
      mouseTool.on("draw", function(type, obj) {           
        polygonItem = type.obj;
        var path = polygonItem.getPath(); //取得绘制的多边形的每一个点坐标      
         var data = path.map(item=>{
              return [item.lng,item.lat]
            });   
          _this.overlays = data  
          _this.Setarea() 
          mouseTool.close(true); //关闭，并清除覆盖物         
          _this.showmapdistrict(_this.overlays);            
          _this.compute(path,(e)=>{                  
          if(!e){ 
            _this.cursiteshow = true
            // _this.$Message.info("片区有重复,请你调整片区")
          } 
        }) 
        _this.edmitStart();          
      });
      this.draw("polygon");
    },   
    Setarea () {    
      this.$webapi.save("areaType",1)    
    },
    //加载全部片区
    allshowmapdistrict(item, index) {
      let _this = this;       
      MAP.add(item);
      // // 缩放地图到合适的视野级别
      MAP.setFitView([item]);      
      item.on("click", function(e) { 
        const extData = e.target.Uh.extData;    
        _this.opendistrict(extData)                  
        if (_this.overlays && _this.overlays.length == 0 && _this.areaType == 0 || _this.areaType == 3) {
          _this.districtItem = _this.districtList[e.target.Uh.zIndex];
          _this.siteItemshow = false;
          _this.areaType = 3;
          _this.areashow = true;
          setTimeout(() => {
            _this.$vm.$emit(
              "seleteView",
              _this.districtList[e.target.Uh.zIndex]
            );
          }, 300);
        } else if (_this.areaType == 2) { 
          if(_this.districtItem.id != e.target.Uh.extData.id){
            _this.$Message.info("你点击的片区跟编辑的片区不一致")
            return
          }
          if (markers && markers.length > 0) {
            markers[0].setMap(null);
          }
          markers = [];
          marker = new AMap.Marker({
            map: MAP,
            icon:_this.poimarker,
            position: e.lnglat
          });
          _this.$vm.$emit("mapCenter", e.lnglat);
          markers.push(marker);
        } 
      });
    },
    //渲染片区绘画
    showmapdistrict(e) {      
      let _this = this;
      polygon = null;
      polygon = new AMap.Polygon({
        path: e,
        strokeColor: "#FF33FF",
        strokeWeight: 1,
        strokeOpacity: 1,
        fillOpacity: 0.8,
        fillColor: "#00b0ff",
        zIndex: 50
      });
      MAP.add(polygon);
      // // 缩放地图到合适的视野级别
      // MAP.setFitView([polygon]);
      polygon.on("rightclick", function(e) {
        _this.ContextMenu();
        contextMenuMap.open(MAP, e.lnglat);
      });
      polygon.on("click", function(e) {
        if (_this.areaType == 1 || _this.areaType == 2) {
          if (markers && markers.length > 0) {
            markers[0].setMap(null);
          }
          markers = [];
          marker = new AMap.Marker({
            map: MAP,
            icon:_this.poimarker,
            position: e.lnglat
          });
          _this.$vm.$emit("mapCenter", e.lnglat);
          markers.push(marker);
        }
      });
    },
    //右键菜单
    ContextMenu() {
      contextMenuMap = new AMap.ContextMenu();
      let _this = this;      
      if(_this.areaType==1){
        contextMenuMap.addItem(
          "删除片区",
          function() {         
              _this.resetStart();                  
          },       
        );
      }  
    },
    //重置绘画
    resetStart() {
      let _this = this;
      polygon = null;      
      polygonItem = [];
      polygonEditItem = [];
      this.overlays = [];
      this.addshow = true;
      this.areaType = 1;
      var newareaType = this.$webapi.get("areaType") || 0
      var addItemdata = this.$webapi.get("addItem")?JSON.parse(this.$webapi.get("addItem")):null
          if(addItemdata){
            addItemdata.regionScopedata = []
            this.$webapi.save("addItem",JSON.stringify(addItemdata))
          } 
      this.map();   
      //这里异步是担心地图重置加载慢，所以用异步
      // if(this.$route.query.type==1 || newareaType==1){
      //   setTimeout(() => {
      //     _this.adddistrict();
      //   }, 300);
      // }      
        
    },
    closeStart() {
      let _this = this;      
      polygon = null;
      this.map();
      this.overlays = [];
      polygonItem = [];
      this.addshow = true;
        
    },     
    //编辑绘画
    edmitStart() {      
      let _this = this;
      polyEditor = new AMap.PolyEditor(MAP, polygon);
      polyEditor.open();
      if(_this.areaType==1){
        polyEditor.on('adjust', function(event) { 
          console.log(event)       
          _this.overlays = ((event.target).getPath()).map(item=>{
            return [item.lng,item.lat]
          }) 
        })
      }
      if(_this.areaType==2){
        polyEditor.on('adjust', function(event) {
           _this.districtEmitItem.regionScope = ((event.target).getPath()).map(item=>{
              return [item.lng,item.lat]
            }) 
            _this.$webapi.save("emitData",JSON.stringify(_this.districtEmitItem))
        })
      }       
      this.editshow = true;
    },
     closepolyEditor01(e) {       
        let _this = this;    
        let polygonData = AllPolygon[e].getPath();        
          _this.compute(polygonData,(e)=>{                  
              if(!e){ 
                _this.cursiteshow = true
                // _this.$Message.info("片区有重叠,请你调整片区")
              }else{
                polyEditor.close();
                _this.cursiteshow = false;
                _this.editshow = false;
              } 
          },e)    
    }, 
    //结束编辑
    closepolyEditor(e) {     
      let _this = this;    
      if(this.cursiteshow){        
        let polygonData = e?AllPolygon[e].getPath():polygon.getPath();
         _this.compute(polygonData,(e)=>{                  
            if(!e){ 
              _this.cursiteshow = true
              //  _this.$Message.info("片区和片区之间有重叠")
            }else{
              polyEditor.close();
              _this.cursiteshow = false;
              _this.editshow = false;
            } 
        })        

      }else{
         polyEditor.close();
         this.editshow = false;
      }
    },
    delsavedraw (e) {
      let _this = this;
      let newItem = _this.districtList.find(item=>item.id==e.id); 
      this.deldistrictList(newItem)
    },
    //删除片区
    deldistrictList (e) {
      let _this = this;
      if(e.docksiteList && e.docksiteList.length>0){        
        this.$Message.info("【"+e.districtName+"】片区还有"+e.docksiteList.length+"站点,不能删除")
        return
      }      
      let params = {
          data:JSON.stringify({
            id:""+e.id,
            token:this.$webapi.get("token")
          })
      }
       this.$webapi.getMessinfo({
        title:"确定要删除【"+e.districtName+"】片区吗?",
        yes () {
          _this.$api.post("/district/delete",params,reset=>{
              if(reset.codeId==1){
                _this.$Message.info("片区删除成功")
                _this.map()
              }
          })            
        }
      })
      
    },
    draw(type) {
      switch (type) {
        case "marker": {
          mouseTool.marker({
            //同Marker的Option设置
          });
          break;
        }
        case "polyline": {
          mouseTool.polyline({
            strokeColor: "#80d8ff"
            //同Polyline的Option设置
          });
          break;
        }
        case "polygon": {
          mouseTool.polygon({
            strokeColor: "#FF33FF",
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            fillColor: "#00b0ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "editpolygon": {
          mouseTool.polygon({
            strokeColor: "#FF33FF",
            strokeWeight: 1,
            strokeOpacity: 0.8,
            fillOpacity: 0.8,
            fillColor: "#00b0ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "rectangle": {
          mouseTool.rectangle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "circle": {
          mouseTool.circle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Circle的Option设置
          });
          break;
        }
      }
    },
    //片区添加和编辑是否有重复和关联
    compute(data,callback,e){
      // data 是当前传过来的片区
      var polygon1_path = data;
      var flag = true; 
     if(e){
        AllPolygon.forEach((a, index) => {  
            if(e!=index){
               var polygon2_path = a.getPath();
              if(polygon2_path && polygon2_path.length>0){
                // 小圈是否在大圈内
                var isRingInRing = AMap.GeometryUtil.isRingInRing(polygon2_path,polygon1_path);
                // 两圈是否交叉
                var doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon2_path,polygon1_path);
                var ringRingClip = AMap.GeometryUtil.ringRingClip(polygon2_path,polygon1_path);
                var ringArea = parseInt(AMap.GeometryUtil.ringArea(ringRingClip))                  
                var text = '两圈关系：在大圈外';
                if(isRingInRing){
                    flag = false
                    text = '两圈关系：在大圈内';
                }else if(doesRingRingIntersect){
                    flag = false
                    text = '两圈关系：两圈相交, 交叉区域面积为'+ringArea+'平方米';
                } 
              }              
            }           
      }); 
     }else{
       AllPolygon.forEach((a, index) => {  
            var polygon2_path = a.getPath();
            if(polygon2_path && polygon2_path.length>0){
                // 小圈是否在大圈内
                var isRingInRing = AMap.GeometryUtil.isRingInRing(polygon2_path,polygon1_path);
                // 两圈是否交叉
                var doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon2_path,polygon1_path);
                var ringRingClip = AMap.GeometryUtil.ringRingClip(polygon2_path,polygon1_path);
                var ringArea = parseInt(AMap.GeometryUtil.ringArea(ringRingClip))                  
                var text = '两圈关系：在大圈外';
                if(isRingInRing){
                    flag = false
                    text = '两圈关系：在大圈内';
                }else if(doesRingRingIntersect){
                    flag = false
                    text = '两圈关系：两圈相交, 交叉区域面积为'+ringArea+'平方米';
                } 
            }
      }); 
     }      
     setTimeout(()=>{
       callback(flag)
     },200)
    },
    emitarea(e) {      
      if (!e) {
        this.formItem.districtName = ""
      }       
      this.closeItem()
      this.getType()
    },
    getType () {
      let _this = this;
      let Type = this.$route.query.type || 0
      if(Type!=0){ 
        this.$router.push({
          path:"/admin/device/areaManagermap/list"
        })       
        setTimeout(()=>{
          _this.$router.push({
            path:"/admin/device/areaManager/list"
          })
        })
      }      
    },
    //取消添加片区
    closeItem() {
      if(polyEditor){
        polyEditor.close();
      }      
      this.areaType = 0;      
      MAP && MAP.destroy(); 
      this.map()
    },
    emitselectItem() {

    }
  },
  deldistrict(e) {

  }
};
</script>
<style lang="less">
.areaManager-box {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  #areaManger {
    flex: 1;
  }
  .areaTool {
    position: absolute;
    top: 20px;
    left: 20px;
    right:20px;
    .areaToolItem {
      display: inline-block;
    }
    .areabtn {
      height: 40px;
      background: #fff;
      border-radius: 40px;
      line-height: 40px;
      padding: 0 20px;
      cursor: pointer;
      box-shadow: 2px 2px 5px #ddd;
    }
  }
}
</style>