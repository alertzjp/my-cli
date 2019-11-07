import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Home = resolve => require(['@/components/home'],resolve)
const SubView = resolve => require(['@/components/subview'],resolve);
const Login = resolve => require(['@/components/login'],resolve);
const HomeIndex = resolve => require(['@/components/homeindex'],resolve);
const mopedCar = resolve => require(['@/components/carManage/mopedCar/list'],resolve);
const mopedCarMap = resolve => require(['@/components/carManage/mopedCar/map'],resolve);
const bycleMap = resolve => require(['@/components/carManage/mopedCar/carmap'],resolve);
const mopedCarStay = resolve => require(['@/components/carManage/mopedCar/staylist'],resolve);
const stayPut = resolve => require(['@/components/carManage/stayPut/list'],resolve);
const Enterlist = resolve => require(['@/components/carManage/enterlist/list'],resolve);
const BicyclerfidList = resolve => require(['@/components/carManage/bicyclerfid/list'],resolve);
const BicyclerfidCar = resolve => require(['@/components/carManage/bicyclerfid/car'],resolve);
const sectionList = resolve => require(['@/components/carManage/stayPut/section'],resolve);
const bicyclelock = resolve => require(['@/components/carManage/bicyclelock/list'],resolve);
const moped = resolve => require(['@/components/repair/moped/list'],resolve);
const unlocking = resolve => require(['@/components/repair/unlocking/list'],resolve);
const repairmap = resolve => require(['@/components/repair/unlocking/repairmap'],resolve);
const chargingPileList = resolve => require(['@/components/repair/chargingPile/list'],resolve);
const supportList = resolve => require(['@/components/repair/support/list'],resolve);
const pileSupportList = resolve => require(['@/components/repair/pileSupport/list'],resolve);


//h5page
const h5shareView = r => require.ensure([], () => r(require('@/components/h5sharepage')), 'h5shareView');

//系统设置
const cardList = resolve => require(['@/components/system/card/list'],resolve);
const role = resolve => require(['@/components/system/role/list'],resolve);
const permission = resolve => require(['@/components/system/role/permission'],resolve);
const memberList = resolve => require(['@/components/system/member/list'],resolve);
const operatorInfo = resolve => require(['@/components/system/operatore/info'],resolve);
const maintainerList = resolve => require(['@/components/system/maintainer/list'],resolve);
const deviceRebootList = resolve => require(['@/components/system/deviceReboot/list'],resolve);
const setdockingList = resolve => require(['@/components/system/setdocking/list'],resolve);
const GPSList = resolve => require(['@/components/system/GPS/list'],resolve);
const sitecampanyList = resolve => require(['@/components/system/sitecompany/list'],resolve);
const setscopeView = resolve => require(['@/components/system/sitecompany/setscope'],resolve);//设置共享单车运营范围
const qrcoderuleList = resolve => require(['@/components/system/sitecompany/qrcoderule'],resolve);//共享单车二维码规则
const equipmentList = resolve => require(['@/components/system/equipment/list'],resolve);
const pubresourceList = resolve => require(['@/components/system/pubresources/list'],resolve);

//调度管理
const dispatchList = resolve => require(['@/components/dispatch/dispatch/list'],resolve);
const dispatchFinishList = resolve => require(['@/components/dispatch/dispatch/finish'],resolve);
const sitemonitorList = resolve => require(['@/components/dispatch/sitemonitor/list'],resolve);
const transferList = resolve => require(['@/components/dispatch/transfer/list'],resolve);
const allocateList = resolve => require(['@/components/dispatch/allocate/list'],resolve);

//下发指令管理
const operationList = resolve => require(['@/components/bicycledown/operation/list'],resolve);
const APPList = resolve => require(['@/components/bicycledown/app/list'],resolve);


const rechargeList = resolve => require(['@/components/userManage/recharge/list'],resolve);
const rechargeView = resolve => require(['@/components/userManage/recharge/view'],resolve);

const usermemberList = resolve => require(['@/components/userManage/usermember/list'],resolve);
const usermemberAdd = resolve => require(['@/components/userManage/usermember/addcard'],resolve);
const usermemberEdit = resolve => require(['@/components/userManage/usermember/editcard'],resolve);
const balanceList = resolve => require(['@/components/userManage/usermember/balance'],resolve);
const rentbikeList = resolve => require(['@/components/userManage/usermember/rentbike'],resolve);
const cardmemberList = resolve => require(['@/components/userManage/cardmember/list'],resolve);

const userfeedbackList = resolve => require(['@/components/customerManage/userfeedback/list'],resolve);
const comingcallList = resolve => require(['@/components/customerManage/comingcall/list'],resolve);
const peopletotalList = resolve => require(['@/components/customerManage/peopletotal/list'],resolve);
const informBycleList = resolve => require(['@/components/customerManage/informBycle/list'],resolve);
const changeBatteryList = resolve => require(['@/components/customerManage/changeBattery/list'],resolve);//换电瓶记录
const bikePutBackList = resolve => require(['@/components/customerManage/bikePutBack/list'],resolve);//收投车记录
const findCarList = resolve => require(['@/components/customerManage/bikePutBack/car'],resolve);//收投车记录查看车辆

const bikeDispatchList = resolve => require(['@/components/customerManage/bikeDispatch/list'],resolve);//调度记录
const bikeDispatchCar = resolve => require(['@/components/customerManage/bikeDispatch/car'],resolve);//调度记录查看车辆 
const siteInspectionList = resolve => require(['@/components/customerManage/siteInspection/list'],resolve);//巡检记录
const siteInspectiondetailsList = resolve => require(['@/components/customerManage/siteInspection/siteInspectiondetails'],resolve);//巡检记录详情
const siteLongtimeNotInspectionList = resolve => require(['@/components/customerManage/siteLongtimeNotInspection/list'],resolve);//长期未巡检记录

const urgencybikeList = resolve => require(['@/components/customerManage/urgencybike/list'],resolve);
const urgencybikeView = resolve => require(['@/components/customerManage/urgencybike/view'],resolve);
const carfaultList = resolve => require(['@/components/operatemonitoring/carfault/list'],resolve);
const positionView = resolve => require(['@/components/operatemonitoring/carfault/position'],resolve);
const cardynamictList = resolve => require(['@/components/operatemonitoring/cardynamic/list'],resolve);
const cardynamictMap = resolve => require(['@/components/operatemonitoring/cardynamic/map'],resolve);
const cardynamictView= resolve => require(['@/components/operatemonitoring/cardynamic/view'],resolve);
const rentcarList = resolve => require(['@/components/operatemonitoring/rentcar/list'],resolve);
const rentcardetailView = resolve => require(['@/components/operatemonitoring/rentcar/detail'],resolve);
const tempcarrentalList = resolve => require(['@/components/operatemonitoring/tempcarrental/list'],resolve);


// const cardList = resolve => require(['@/components/system/card/list')), 'cardList');
const fenceList = resolve => require(['@/components/device/fence/list'],resolve);
const fenceEdit = resolve => require(['@/components/device/fence/edit'],resolve);
const addfenceView = resolve => require(['@/components/device/fence/addfence'],resolve);
const chargingpileList = resolve => require(['@/components/device/chargingpile/list'],resolve);
const noputitList = resolve => require(['@/components/device/chargingpile/noputit'],resolve);
const relevancesiteList = resolve => require(['@/components/device/relevancesite/list'],resolve);
const dockSiteList = resolve => require(['@/components/device/dockSite/list'],resolve);
const addDockSiteView = resolve => require(['@/components/device/dockSite/add'],resolve);
const docksiteputinView = resolve => require(['@/components/device/dockSite/docksiteputin'],resolve);
const dockSiteEditView = resolve => require(['@/components/device/dockSite/dockSiteEdit'],resolve);
const dockSiteView = resolve => require(['@/components/device/dockSite/dockSiteview'],resolve);
const dockSitecar = resolve => require(['@/components/device/dockSite/dockSitecar'],resolve);

const maintenancerList = resolve => require(['@/components/device/maintenancer/list'],resolve);
const areaManagerList = resolve => require(['@/components/device/areaManager/list'],resolve);
const addareaView = resolve => require(['@/components/device/areaManager/add'],resolve);
const editareaView = resolve => require(['@/components/device/areaManager/edit'],resolve);
const areaManagerMapList = resolve => require(['@/components/device/areaManagermap/arealist'],resolve);


//统计
const totalchargepile = resolve => require(['@/components/total/chargepile/list'],resolve);
const totalBike = resolve => require(['@/components/total/bike/list'],resolve);
const totalRent = resolve => require(['@/components/total/rent/list'],resolve);
const bikeNumList = resolve => require(['@/components/total/bikeNum/list'],resolve);
const bikeusertotalList = resolve => require(['@/components/total/bikeusertotal/list'],resolve);
const bikenumdayList = resolve => require(['@/components/total/bikenumday/list'],resolve);
const bicyclerentdayList = resolve => require(['@/components/total/bicyclerentday/list'],resolve);
const mianlockList = resolve => require(['@/components/total/mianlock/list'],resolve);
const bicyclerentalldayList = resolve => require(['@/components/total/bicyclerentallday/list'],resolve);
const timeMapList = resolve => require(['@/components/total/timetotalmap/list'],resolve);
const bicycleTotal = resolve => require(['@/components/total/bicycleTotal/list'],resolve);
const bikezucheList = resolve => require(['@/components/total/bikeusertotal/zuche'],resolve);
const ensuringList = resolve => require(['@/components/total/ensuring/list'],resolve);
const unablereturnbikeList = resolve => require(['@/components/total/unablereturnbike/list'],resolve);
const unablereturnbikeView = resolve => require(['@/components/total/unablereturnbike/view'],resolve);
const unablercarList = resolve => require(['@/components/total/unablercar/list'],resolve);
const unablercarView = resolve => require(['@/components/total/unablercar/view'],resolve);


const chargeruleList = resolve => require(['@/components/device/chargerule/list'],resolve);
const maintainStation = resolve => require(['@/components/repair/maintainstation/list'],resolve);
const maintainStationAdd = resolve => require(['@/components/repair/maintainstation/add'],resolve);
const maintainStationEdit = resolve => require(['@/components/repair/maintainstation/edit'],resolve);



const allMalfunctionList = resolve => require(['@/components/repair/allMalfunction/list'],resolve);
const foregiftList = resolve => require(['@/components/userManage/foregift/list'],resolve);
const retrunforegiftList = resolve => require(['@/components/userManage/foregift/retrunforegift'],resolve);
const refundofflineList = resolve => require(['@/components/userManage/foregift/refundoffline'],resolve);
const refundList = resolve => require(['@/components/userManage/refund/list'],resolve);
const refundoverdueList = resolve => require(['@/components/userManage/refund/refundoverdue'],resolve);
const consumeList = resolve => require(['@/components/userManage/consume/list'],resolve);
const logList = resolve => require(['@/components/userManage/log/list'],resolve);

const mapView = resolve => require(['@/components/pub/xpmap'],resolve);


//车辆监控
const siteMonitor = resolve => require(['@/components/monitor/site/list'],resolve);
const yuqiList = resolve => require(['@/components/monitor/yuqi/list'],resolve);
const shorttimeList = resolve => require(['@/components/monitor/shorttime/list'],resolve);
const locknowarnList = resolve => require(['@/components/monitor/locknowarn/list'],resolve);
const faulttypeList = resolve => require(['@/components/monitor/faulttype/list'],resolve);
const gpsRebootList = resolve => require(['@/components/monitor/gpsreboot/list'],resolve);
const Error = resolve => require(['@/components/error/404'],resolve);
const anomalousList = resolve => require(['@/components/monitor/anomalous/list'],resolve);
const sharedBikeWarningList = resolve => require(['@/components/monitor/sharedBikeWarning/list'],resolve);
const faultmonitorList = resolve => require(['@/components/monitor/fault/list'],resolve);
const faultmonitorView = resolve => require(['@/components/monitor/fault/view'],resolve);
const faultmonitorMap = resolve => require(['@/components/monitor/fault/map'],resolve);
const unhiredcarList = resolve => require(['@/components/monitor/unhiredcar/list'],resolve);
const unhiredcarView = resolve => require(['@/components/monitor/unhiredcar/user'],resolve);
const offlinebikeList = resolve => require(['@/components/monitor/offlinebike/list'],resolve);
const siteBatteryWarnList = resolve => require(['@/components/monitor/siteBatteryWarn/list'],resolve);
const setSiteBatteryWarnValueList = resolve => require(['@/components/monitor/setSiteBatteryWarnValue/list'],resolve);

//更新日志
const updateList = resolve => require(['@/components/update/list'],resolve);

//财务管理
const foregiftstatisticList = resolve => require(['@/components/financeManage/foregiftstatistic/list'],resolve);
const balancestatisticList = resolve => require(['@/components/financeManage/balancestatistic/list'],resolve);

//共享模块
const sharedbikerentList = resolve => require(['@/components/shared/bikerent/list'],resolve);
const silenceBicycleList = resolve => require(['@/components/shared/silenceBicycle/list'],resolve);
const allbikemap = resolve => require(['@/components/shared/silenceBicycle/allbikemap'],resolve);
const peripheryBicycleList = resolve => require(['@/components/shared/peripheryBicycle/list'],resolve);




export default new Router({
  mode: 'history',
  routes: [
    {
      path:'*',
      component:Error
    },
    {
      path: '/',
      redirect: '/login/'
    },
    {
      path: '/login/',
      meta:{
        title:"登录"
      },
      component: Login,
    },
    {
      path: '/h5share/',
      meta:{
        title:"分享"
      },
      component: h5shareView,
    },
    {
      path: '/admin/',
      component: Home,
      meta:{
        title:"首页"
      },
      children: [
        {
          path: 'update',
          meta:{
            title:"更新日志"
          },
          component: updateList,
        },
        {
          path: 'index',
          meta:{
            title:"后台首页"
          },
          component: HomeIndex,
        },
        {
          path: 'pub/xpmap',
          meta:{
            title:"地图",
            backshow:true,isshow:true
          },
          component: mapView,
        },
        {
          path: 'bicycledown',
          meta:{
            title:"下发指令管理"
          },
          component: SubView,
          children: [
            {
              path: 'operation',
              meta:{
                title:"运营人员"
              },
              component: SubView,
              redirect: '/admin/bicycledown/operation/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"运营人员列表"
                  },
                  component: operationList,
                }
              ]
            },
            {
              path: 'app',
              meta:{
                title:"维护APP"
              },
              component: SubView,
              redirect: '/admin/bicycledown/app/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"维护APP列表"
                  },
                  component: APPList,
                }
              ]
            }
          ]
        },
        {
          path: 'dispatch',
          meta:{
            title:"调度管理"
          },
          component: SubView,
          children: [
            {
              path: 'dispatch',
              meta:{
                title:"调度"
              },
              component: SubView,
              redirect: '/admin/dispatch/dispatch/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"调度列表"
                  },
                  component: dispatchList,
                },
                {
                  path: 'finish',
                  meta:{
                    title:"调度完成"
                  },
                  component: dispatchFinishList,
                },
              ]
            },
            {
              path: 'sitemonitor',
              meta:{
                title:"站点监控参数"
              },
              component: SubView,
              redirect: '/admin/dispatch/sitemonitor/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"站点监控参数列表"
                  },
                  component: sitemonitorList,
                }
              ]
            },
            {
              path: 'transfer',
              meta:{
                title:"调度监控"
              },
              component: SubView,
              redirect: '/admin/dispatch/transfer/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"调度监控列表"
                  },
                  component: transferList,
                }
              ]
            },
            {
              path: 'allocate',
              meta:{
                title:"调运"
              },
              component: SubView,
              redirect: '/admin/dispatch/allocate/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"调运列表"
                  },
                  component: allocateList,
                }
              ]
            },
          ]
        },
        {
          path: 'carManage',
          meta:{
            title:"车辆管理"
          },
          component: SubView,
          children: [
            {
              path: 'bicycle',
              meta:{
                title:"自行车管理"
              },
              component: SubView,
              redirect: '/admin/carManage/bicycle/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"自行车列表"
                  },
                  component: mopedCar,
                },
                {
                  path: 'map',
                  meta:{
                    title:"位置"
                  },
                  component: mopedCarMap,
                },
              ]
            },
            {
              path: 'stayPut',
              meta:{
                title:"待投放自行车"
              },
              component: stayPut,
            },
            {
              path: 'enterlist',
              meta:{
                title:"进场列表"
              },
              component: Enterlist,
            },
            {
              path: 'bicyclelock',
              meta:{
                title:"自行车锁列表"
              },
              component: bicyclelock,
            },
            {
              path: 'bicyclerfid',
              meta:{
                title:"共享单车进出场列表"
              },
              component: BicyclerfidList,
            },
            {
              path: 'bicyclerfidCar',
              meta:{
                title:"共享单车列表"
              },
              component: BicyclerfidCar,
            },
            {
              path: 'section',
              meta:{
                title:"区间投放车辆"
              },
              component: sectionList,
            },
            {
              path: 'bycleMap',
              meta:{
                title:"车辆位置"
              },
              component: bycleMap,
            },
          ]
        },
        {
          path: 'repair',
          component: SubView,
          meta:{
            title:"维修管理"
          },
          children: [
            {
              path: 'moped',
              meta:{
                title:"维修登记"
              },
              component: moped,
            },
            {
              path: 'allMalfunction',
              meta:{
                title:"故障车辆"
              },
              component: allMalfunctionList,
            },
            {
              path: 'unlocking',
              meta:{
                title:"维护人员开锁记录"
              },
              component: SubView,
              redirect: '/admin/repair/unlocking/unlocking',
              children: [
                {
                  path: 'unlocking',
                  meta:{
                    title:"维护人员开锁记录列表"
                  },
                  component: unlocking,
                },
                {
                  path: 'repairmap',
                  meta:{
                    title:"维修车辆位置",
                    titleshow:true,
                  },
                  component: repairmap,
                },
              ]
            },
            {
              path: 'maintainstation',
              meta:{
                title:"维修站点"
              },
              component: SubView,
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"维修站点列表"
                  },
                  component: maintainStation,
                },
                {
                  path: 'add',
                  meta:{
                    title:"新增"
                  },
                  component: maintainStationAdd,
                },
                {
                  path: 'edit',
                  meta:{
                    title:"编辑"
                  },
                  component: maintainStationEdit,
                }
              ]
            },
            {
              path: 'chargingPile',
              meta:{
                title:"充电桩维修登记"
              },
              component: chargingPileList,
            },
            {
              path: 'support',
              meta:{
                title:"维修历史记录"
              },
              component: supportList,
            },
            {
              path: 'pileSupport',
              meta:{
                title:"充电桩维修历史记录"
              },
              component: pileSupportList,
            },
          ]
        },
        {
          path: 'system',
          meta:{
            title:"系统管理"
          },
          component: SubView,
          children: [
            {
              path: 'role',
              meta:{
                title:"角色管理"
              },
              component: SubView,
              redirect: '/admin/system/role/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"角色列表"
                  },
                  component: role,
                },
                {
                  path: 'permission',
                  meta:{
                     title:"权限",
                     backshow:true,isshow:true,
                     titleshow:true,
                  },
                  component: permission,
                },
              ]
            },
            {
              path: 'pubresource',
              meta:{
                title:"公共资源"
              },
              component: SubView,
              redirect: '/admin/system/pubresource/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"公共资源列表"
                  },
                  component: pubresourceList,
                },
              ]
            },
            {
              path: 'member',
              meta:{
                title:"帐号管理"
              },
              component: SubView,
              redirect: '/admin/system/member/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"帐号列表"
                  },
                  component: memberList,
                }
              ]
            },
            {
              path: 'operator',
              meta:{
                title:"运营商信息"
              },
              component: SubView,
              children: [
                {
                  path: 'info',
                  meta:{
                    title:"运营商基本信息"
                  },
                  component: operatorInfo,
                }
              ]
            },
            {
              path: 'chargerule',
              meta:{
                title:"计费规则"
              },
              component: SubView,
              redirect: '/admin/system/chargerule/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"计费规则列表"
                  },
                  component: chargeruleList,
                }
              ]
            },
            {
              path: 'deviceReboot',
              meta:{
                title:"车辆参数设置"
              },
              component: SubView,
              redirect: '/admin/system/deviceReboot/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"车辆参数设置列表"
                  },
                  component: deviceRebootList,
                }
              ]
            },
            {
              path: 'setdocking',
              meta:{
                title:"进场设备参数设置"
              },
              component: SubView,
              redirect: '/admin/system/setdocking/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"进场设备参数设置列表"
                  },
                  component: setdockingList,
                }
              ]
            },
            {
              path: 'GPS',
              meta:{
                title:"GPS列表"
              },
              component: SubView,
              redirect: '/admin/system/GPS/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"GPS列表"
                  },
                  component: GPSList,
                }
              ]
            },
            {
              path: 'sitecompany',
              meta:{
                title:"共享单车企业入驻"
              },
              component: SubView,
              redirect: '/admin/system/sitecompany/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"共享单车企业入驻"
                  },
                  component: sitecampanyList,
                },
                {
                  path: 'setscope',
                  meta:{
                    title:"设置运营范围",
                    backshow:true,isshow:true,
                    titleshow:true,
                  },
                  component: setscopeView,
                },
                {
                  path: 'qrcoderule',
                  meta:{
                    title:"二维码规则",
                    backshow:true,
                    isshow:true,
                    titleshow:true,
                  },
                  component: qrcoderuleList,
                }
              ]
            },
            {
              path: 'equipment',
              meta:{
                title:"站点与通讯设备有关记录"
              },
              component: SubView,
              redirect: '/admin/system/equipment/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"站点与通讯设备有关记录"
                  },
                  component: equipmentList,
                }
              ]
            },
            {
              path: 'maintainer',
              meta:{
                title:"维护人员管理"
              },
              component: SubView,
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"维护人员列表"
                  },
                  component: maintainerList,
                }
              ]
            },
            {
              path: 'card',
              meta:{
                title:"维护卡号管理"
              },
              component: SubView,
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"维护卡号列表"
                  },
                  component: cardList,
                }
              ]
            },
          ]
        },
        {
          path: 'userManage',
          meta:{
            title:"用户管理"
          },
          component: SubView,
          children: [
            {
              path: 'usermember',
              meta:{
                title:"会员信息列表"
              },
              component: SubView,
              redirect: '/admin/userManage/usermember/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"会员信息列表"
                  },
                  component: usermemberList,
                },
                {
                  path: 'add',
                  meta:{
                    title: '新增卡',
                    backshow:true,isshow:true,
                    titleshow:true,
                  },
                  component: usermemberAdd,
                },
                {
                  path: 'edit',
                  meta:{
                    title: '编辑卡',
                    backshow:true,isshow:true,
                    titleshow:true,
                  },
                  component: usermemberEdit,
                },
                {
                  path: 'balance',
                  meta:{
                    title: '余额列表',
                    // backshow:true,isshow:true
                  },
                  component: balanceList,
                },
                {
                  path: 'rentbike',
                  meta:{
                    title: '用户租车记录',
                    // backshow:true,isshow:true
                  },
                  component: rentbikeList,
                },
              ]
            },
            {
              path: 'foregift',
              meta:{
                title: '押金列表',
              },
              component: foregiftList,
            },
            {
              path: 'retrunforegift',
              meta:{
                title: '押金退还',
              },
              component: retrunforegiftList,
            },
            {
              path: 'refundoffline',
              meta:{
                title: '线下押金',
              },
              component: refundofflineList,
            },
            {
              path: 'refund',
              meta:{
                title: '退款余额列表',
              },
              component: refundList,
            },
            {
              path: 'cardmember',
              meta:{
                title: '公交卡列表',
              },
              component: SubView,
              redirect: '/admin/userManage/cardmember/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '公交卡列表',
                  },
                  component: cardmemberList,
                },
              ]
            },
            {
              path: 'refundoverdue',
              meta:{
                title: '超过7天退款未到账',
              },
              component: refundoverdueList,
            },
            {
              path: 'log',
              meta:{
                title: '操作日志',
              },
              component: logList,
            },
            {
              path: 'consume',
              meta:{
                title: '消费记录',
              },
              component: consumeList,
            },
            {
              path: 'recharge',
              meta:{
                title: '充值记录',
              },
              component: SubView,
              redirect: '/admin/userManage/recharge/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '充值记录',
                  },
                  component: rechargeList,
                },
                {
                  path: 'view',
                  meta:{
                    title: '详情',
                    backshow:true,isshow:true
                  },
                  component: rechargeView,
                },
              ]
            },
         ]
       },
        {
          path: 'customerManage',
          component: SubView,
          meta:{
            title: '客服管理',
          },
          children: [
            {
              path: 'userfeedback',
              meta:{
                title: '用户反馈',
              },
              component: SubView,
              redirect: '/admin/customerManage/userfeedback/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '用户反馈列表',
                  },
                  component: userfeedbackList,
                },
              ]
            },
            {
              path: 'comingcall',
              meta:{
                title: '来电登记',
              },
              component: SubView,
              redirect: '/admin/customerManage/comingcall/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '来电登记列表',
                  },
                  component: comingcallList,
                },
              ]
            },
            {
              path: 'urgencybike',
              meta:{
                title: '急修车辆查询',
              },
              component: SubView,
              redirect: '/admin/customerManage/urgencybike/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '急修车辆查询列表',
                  },
                  component: urgencybikeList,
                },
                {
                  path: 'view',
                  meta:{
                    title: '详情',
                    backshow:true,isshow:true
                  },
                  component: urgencybikeView,
                },
              ]
            },
            {
              path: 'peopletotal',
              meta:{
                title: '用户报障',
              },
              component: SubView,
              redirect: '/admin/customerManage/peopletotal/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '用户报障列表',
                  },
                  component: peopletotalList,
                },
              ]
            },
            {
              path: 'informBycle',
              meta:{
                title: '违停举报',
              },
              component: SubView,
              redirect: '/admin/customerManage/informBycle/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '违停举报列表',
                  },
                  component: informBycleList,
                },
              ]
            },
            {
              path: 'changeBattery',
              meta:{
                title: '换电瓶记录',
              },
              component: SubView,
              redirect: '/admin/customerManage/changeBattery/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '换电瓶记录列表',
                  },
                  component: changeBatteryList,
                },
              ]
            },
            {
              path: 'bikePutBack',
              meta:{
                title: '收投车记录',
              },
              component: SubView,
              redirect: '/admin/customerManage/bikePutBack/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '收投车记录列表',
                  },
                  component: bikePutBackList,
                },
                {
                  path: 'findCarList',
                  meta:{
                    backshow:true,
                    isshow:true,                   
                    title: '查看车辆',
                  },
                  component: findCarList,
                },
              ]
            },
            {
              path: 'bikeDispatch',
              meta:{
                title: '调度记录',
              },
              component: SubView,
              redirect: '/admin/customerManage/bikeDispatch/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '调度记录列表',
                  },
                  component: bikeDispatchList,
                },
                {
                  path: 'bikeDispatchCar',
                  meta:{
                    title: '查看车辆',
                    backshow:true,
                    isshow:true,
                  },
                  component: bikeDispatchCar,
                },
              ]
            },
            {
              path: 'siteInspection',
              meta:{
                title: '巡检记录',
              },
              component: SubView,
              redirect: '/admin/customerManage/siteInspection/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '巡检记录列表',
                  },
                  component: siteInspectionList,
                },
                {
                  path: 'siteInspectiondetails',
                  meta:{
                    title: '巡检记录列表',
                    backshow:true,isshow:true
                  },
                  component: siteInspectiondetailsList,
                },
              ]
            },
            {
              path: 'siteLongtimeNotInspection',
              meta:{
                title: '长期未巡检站点',
              },
              component: SubView,
              redirect: '/admin/customerManage/siteLongtimeNotInspection/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title: '长期未巡检站点列表',
                  },
                  component: siteLongtimeNotInspectionList,
                },
              ]
            },
         ]
       },
        {
        path: 'operatemonitoring',
        meta:{
          title: '运营监控',
        },
        component: SubView,
        children: [
          {
            path: 'carfault',
            meta:{
              title: '车辆故障信息',
            },
            component: SubView,
            redirect: '/admin/operatemonitoring/carfault/list',
            children: [
              {
                path: 'list',
                meta:{
                  title: '车辆故障信息列表',
                },
                component: carfaultList,
              },
              {
                path: 'position',
                meta:{
                  title: '位置',
                  backshow:true,isshow:true
                },
                component: positionView,
              },
            ]
          },
          {
            path: 'cardynamic',
            meta:{
              title: '车辆动态信息',
            },
            component: SubView,
            redirect: '/admin/operatemonitoring/cardynamic/list',
            children: [
              {
                path: 'list',
                meta:{
                  title: '车辆动态列表',
                },
                component: cardynamictList,
              },
              {
                path: 'map',
                meta:{
                  title: '位置',
                },
                component: cardynamictMap,
              },
              {
                path: 'view',
                meta:{
                   title: '详情',
                   backshow:true,isshow:true
                },
                component: cardynamictView,
              },
            ]
          },
          {
            path: 'rentcar',
            meta:{
              title: '助力车租车记录',
            },
            component: SubView,
            redirect: '/admin/operatemonitoring/rentcar/list',
            children: [
              {
                path: 'list',
                meta:{
                  title: '助力车租车记录列表',
                },
                component: rentcarList,
              },
              {
                path: 'detail',
                meta:{
                   title: '详情',
                   backshow:true,isshow:true
                },
                component: rentcardetailView,
              },
            ]
          },
          {
            path: 'tempcarrental',
            meta:{
              title: '临时车辆分布图',
            },
            component: SubView,
            redirect: '/admin/operatemonitoring/tempcarrental/list',
            children: [
              {
                path: 'list',
                meta:{
                  title: '临时车辆分布图',
                },
                component: tempcarrentalList,
              },
            ]
          },
         ]
      },
        {
       path: 'device',
       meta:{
         title: '站点管理',
       },
       component: SubView,
       children: [
          {
           path: 'fence',
           meta:{
             title: '电子围栏管理',
           },
           component: SubView,
           redirect: '/admin/device/fence/list',
           children:[
             {
               path: 'list',
               meta:{
                 title: '电子围栏列表',
               },
               component: fenceList,
             },
             {
               path: 'edit',
               meta:{
                 title: '编辑电子围栏',
               },
               component: fenceEdit,
             },
             {
               path: 'addfence',
               meta:{
                 title: '新增电子围栏',
               },
               component: addfenceView,
             },
           ]
         },
          {
           path: 'chargingpile',
           meta:{
             title: '充电桩管理',
           },
           component: SubView,
           redirect: '/device/chargingpile/list',
           children:[
             {
               path: 'list',
               meta:{
                 title: '充电桩列表',
               },
               component: chargingpileList,
             },
             {
               path: 'noputit',
               meta:{
                 title: '新建充电桩',
                 backshow:true,isshow:true
               },
               component: noputitList,
             },
           ]
         },
          {
           path: 'relevancesite',
           meta:{
             title: '助力车关联站点',
           },
           component: SubView,
           redirect: '/device/relevancesite/list',
           children:[
             {
               path: 'list',
               meta:{
                 title: '关联站点列表',
               },
               component: relevancesiteList,
             },
           ]
         },
          {
          path: 'dockSite',
          meta:{
            title: '站点管理',
          },
          component: SubView,
          redirect: '/admin/device/dockSite/list',
          children:[
            {
              path: 'list',
              meta:{
                title: '站点列表',
              },
              component: dockSiteList,
            },
            {
              path: 'add',
              meta:{
                 title: '新增站点',
                 backshow:true,
                 isshow:true,
                 titleshow:true,
              },
              component: addDockSiteView,
            },
            {
              path: 'docksiteputin',
              meta:{
                 title: '投放充电桩',
                 backshow:true,isshow:true
              },
              component: docksiteputinView,
            },
            {
              path: 'dockSiteEdit',
              meta:{
                 title: '编辑站点',
                 backshow:true,isshow:true,
                 titleshow:true,
              },
              component: dockSiteEditView,
            },
            {
              path: 'dockSiteView',
              meta:{
                 title: '站点详情',
                 backshow:true,isshow:true,
                 titleshow:true,
              },
              component: dockSiteView,
            },
            {
              path: 'dockSitecar',
              meta:{
                 title: '地图上的站点',
                 backshow:true,isshow:true,
                 backurl:"/admin/device/dockSite/list",
                 titleshow:true,
              },
              component: dockSitecar,
            },
          ]
        },
          {
             path: 'maintenancer',
             meta:{
                title: '站点维护人员',
             },
             component: SubView,
             redirect: '/admin/device/maintenancer/list',
             children:[
               {
                 path: 'list',
                 meta:{
                    title: '维护人员列表',
                 },
                 component: maintenancerList,
               },
             ]
           },
          {
              path: 'areaManager',
              meta:{
                 title: '片区管理',
              },
              component: SubView,
              redirect: '/admin/device/areaManager/list',
              children:[
                {
                  path: 'list',
                  meta:{
                     title: '片区列表',
                  },
                  component: areaManagerList,
                },
                {
                  path: 'add',
                  meta:{
                     title: '新增片区',
                  },
                  component: addareaView,
                },
                {
                  path: 'edit',
                  meta:{
                     title: '编辑',
                  },
                  component: editareaView,
                },
              ]
            },
            {
              path: 'areaManagermap',
              meta:{
                 title: '片区地图展示',
              },
              component: SubView,
              redirect: '/admin/device/areaManagermap/list',
              children:[
                {
                  path: 'list',
                  name:"areaManagermapList",
                  meta:{
                     title: '片区列表',
                     keepAlive:true //需要被缓存的组件
                  },
                  component: areaManagerMapList,
                },
              ]
            },
        ]
       },
        {
          path: 'total',
          meta:{
             title: '统计分析',
          },
          component: SubView,
          children: [
            {
              path: 'bikeNum',
              meta:{
                 title: '站点借还次数统计',
              },
              component: bikeNumList,
            },
            {
              path: 'unablereturnbike',
              meta:{
                 title: '无法还车统计',
              },
              component: unablereturnbikeList,
            },
            {
              path: 'unablereturnbikeView',
              meta:{
                 title: '无法还车统计明细',
                 backshow:true,
                 isshow:true,
                 backurl:"/admin/total/unablereturnbike",
              },
              component: unablereturnbikeView,
            },
            {
              path: 'unablercar',
              meta:{
                 title: '无法还车车辆统计',
              },
              component: unablercarList,
            },
            {
              path: 'unablercarview',
              meta:{
                 title: '无法还车车辆明细',
                 backshow:true,
                 isshow:true,
                 backurl:"/admin/total/unablercar",
              },
              component: unablercarView,
            },
            {
              path: 'ensuring',
              meta:{
                 title: '报障人员统计',
              },
              component: ensuringList,
            },
            {
              path: 'bicycleTotal',
              meta:{
                 title: '车辆统计',
              },
              component: bicycleTotal,
            },
            {
              path: 'bikeusertotal',
              meta:{
                 title: '会员借还次数统计',
              },
              component: bikeusertotalList,
            },
            {
              path: 'zuche',
              meta:{
                 title: '租车记录',
                 backshow:true,
                 isshow:true,
                 backurl:"/admin/total/bikeusertotal",
                 titleshow:true,
              },
              component: bikezucheList,
            },
            {
              path: 'bikenumday',
              meta:{
                 title: '站点日借还次数统计',
              },
              component: bikenumdayList,
            },
            {
              path: 'bicyclerentday',
              meta:{
                 title: '日借还次数统计',
              },
              component: bicyclerentdayList,
            },
            {
              path: 'rentallday',
              meta:{
                 title: '车辆运营统计',
              },
              component: bicyclerentalldayList,
            },

            {
              path: 'timemap',
              meta:{
                 title: '日借车量时段分析',
              },
              component: timeMapList,
            },
            {
              path: 'mianlock',
              meta:{
                 title: '维护人员开锁统计',
              },
              component: mianlockList,
            },
          ]
        },
        {
          path: 'monitor',
          meta:{
             title: '运营监控',
          },
          component: SubView,
          children: [
          {
            path: 'site',
            meta:{
               title: '站点监控',
            },
            component: SubView,
            redirect: '/admin/monitor/site/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '站点监控列表',
                },
                component: siteMonitor,
              },
            ]
          },
          {
            path: 'unhiredcar',
            meta:{
               title: '长期未租用车辆',
            },
            component: SubView,
            redirect: '/admin/monitor/unhiredcar/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '长期未租用车辆列表',
                },
                component: unhiredcarList,
              },
              {
                path: 'view',
                meta:{
                   title: '最后租车用户',
                   backshow:true,
                   isshow:true,
                   backurl:"/admin/monitor/unhiredcar/list",
                },
                component: unhiredcarView,
              },
            ]
          },
          {
            path: 'offlinebike',
            meta:{
               title: '离线车辆管理',
            },
            component: SubView,
            redirect: '/admin/monitor/offlinebike/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '离线车辆列表',
                },
                component: offlinebikeList,
              },
            ]
          },
          {
            path: 'siteBatteryWarn',
            meta:{
               title: '预警低电站点',
            },
            component: SubView,
            redirect: '/admin/monitor/siteBatteryWarn/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '预警低电站点列表',
                },
                component: siteBatteryWarnList,
              },
            ]
          },
          {
            path: 'setSiteBatteryWarnValue',
            meta:{
               title: '设置电瓶预警值',
            },
            component: SubView,
            redirect: '/admin/monitor/setSiteBatteryWarnValue/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '设置电瓶预警值列表',
                },
                component: setSiteBatteryWarnValueList,
              },
            ]
          },
          {
            path: 'faultmonitor',
            meta:{
               title: '急修还车监控',
            },
            component: SubView,
            redirect: '/admin/monitor/faultmonitor/list',
            children: [
              {
                path: 'list',
                meta:{
                   title: '急修还车监控列表',
                },
                component: faultmonitorList,
              },
              {
                path: 'view',
                meta:{
                   title: '急修还车监控详情',
                   backshow:true,
                   isshow:true,
                   backurl:"/admin/monitor/faultmonitor/list",
                },
                component: faultmonitorView,
              },
              {
                path: 'map',
                meta:{
                   title: '急修还车监控地图',
                   backshow:true,
                   isshow:true,
                   backurl:"/admin/monitor/faultmonitor/list",
                },
                component: faultmonitorMap,
              },
            ]
          },
          {
            path: 'anomalous',
            meta:{
              title: '异常出场车辆',
            },
            component: anomalousList,
          },
          {
            path: 'sharedbikewarning',
            meta:{
              title: '共享单车警报',
            },
            component: sharedBikeWarningList,
          },
          {
            path: 'yuqi',
            meta:{
                title: '逾期未还',
            },
            component: yuqiList,
          },
          {
            meta:{
              title: '短租监控',
            },
            path: 'shorttime',
            component: shorttimeList,
          },
          {
            path: 'locknowarn',
            meta:{
              title: '电量预警车辆',
            },
            component: locknowarnList,
          },
          {
            path: 'faulttype',
            meta:{
              title: '故障类型',
            },
            component: faulttypeList,
          },
          {
            path: 'gpsreboot',
            meta:{
              title: '车辆定位信息',
            },
            component: gpsRebootList,
          }
        ]
        },
        {
          path: 'financeManage',
          component: SubView,
          meta:{
            title:"财务管理"
          },
          children: [
            {
              path: 'foregiftstatistic',
              meta:{
                title:"押金充值退款统计"
              },
              component: foregiftstatisticList,
              redirect: '/admin/financeManage/foregiftstatistic/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"列表"
                  },
                  component: foregiftstatisticList,
                },
              ]
            },
            {
              path: 'balancestatistic',
              meta:{
                title:"余额充值退款统计"
              },
              component: balancestatisticList,
              redirect: '/admin/financeManage/balancestatistic/list',
              children: [
                {
                  path: 'list',
                  meta:{
                    title:"列表"
                  },
                  component: balancestatisticList,
                },
              ]
            },
          ]
        },
        {
          path: 'shared',
          meta:{
            title:"共享管理"
          },
         component: SubView,
         children: [
           {
             path: 'bikerent',
             meta:{
               title:"共享单车租车记录"
             },
             component: SubView,
             redirect: '/admin/shared/bikerent/list',
             children: [
               {
                 path: 'list',
                 meta:{
                   title:"列表"
                 },
                 component: sharedbikerentList,
               },
             ]
           },
           {
             path: 'silenceBicycle',
             meta:{
               title:"共享单车沉默车"
             },
             component: SubView,
             redirect: '/admin/shared/silenceBicycle/list',
             children: [
               {
                 path: 'list',
                 meta:{
                   title:"列表"
                 },
                 component: silenceBicycleList,
               },
               {
                 path: 'allbikemap',
                 meta:{
                   title:"查看分布",
                   backshow:true,
                   isshow:true,
                   viewshow:true
                 },
                 component: allbikemap,
               },
             ]
           },
           {
             path: 'peripheryBicycle',
             meta:{
               title:"共享外围车辆"
             },
             component: SubView,
             redirect: '/admin/shared/peripheryBicycle/list',
             children: [
               {
                 path: 'list',
                 meta:{
                   title:"列表"
                 },
                 component: peripheryBicycleList,
               },
             ]
           },
         ]
        },
      ]
    },
  ]
})
