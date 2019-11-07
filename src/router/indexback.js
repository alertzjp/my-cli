import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home');
const SubView = r => require.ensure([], () => r(require('@/components/subview')), 'subview');
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login');
const HomeIndex = r => require.ensure([], () => r(require('@/components/homeindex')), 'HomeIndex');
const mopedCar = r => require.ensure([], () => r(require('@/components/carManage/mopedCar/list')), 'mopedCar');
const mopedCarMap = r => require.ensure([], () => r(require('@/components/carManage/mopedCar/map')), 'mopedCarMap');
const bycleMap = r => require.ensure([], () => r(require('@/components/carManage/mopedCar/carmap')), 'bycleMap');
const mopedCarStay = r => require.ensure([], () => r(require('@/components/carManage/mopedCar/staylist')), 'mopedCarStay');
const stayPut = r => require.ensure([], () => r(require('@/components/carManage/stayPut/list')), 'stayPut');
const Enterlist = r => require.ensure([], () => r(require('@/components/carManage/enterlist/list')), 'Enterlist');
const BicyclerfidList = r => require.ensure([], () => r(require('@/components/carManage/bicyclerfid/list')), 'BicyclerfidList');
const BicyclerfidCar = r => require.ensure([], () => r(require('@/components/carManage/bicyclerfid/car')), 'BicyclerfidCar');
const sectionList = r => require.ensure([], () => r(require('@/components/carManage/stayPut/section')), 'sectionList');
const bicyclelock = r => require.ensure([], () => r(require('@/components/carManage/bicyclelock/list')), 'bicyclelock');
const moped = r => require.ensure([], () => r(require('@/components/repair/moped/list')), 'moped');
const unlocking = r => require.ensure([], () => r(require('@/components/repair/unlocking/list')), 'unlocking');
const repairmap = r => require.ensure([], () => r(require('@/components/repair/unlocking/repairmap')), 'repairmap');
const chargingPileList = r => require.ensure([], () => r(require('@/components/repair/chargingPile/list')), 'chargingPileList');
const supportList = r => require.ensure([], () => r(require('@/components/repair/support/list')), 'supportList');
const pileSupportList = r => require.ensure([], () => r(require('@/components/repair/pileSupport/list')), 'pileSupportList');


//系统设置
const cardList = r => require.ensure([], () => r(require('@/components/system/card/list')), 'cardList');
const role = r => require.ensure([], () => r(require('@/components/system/role/list')), 'role');
const permission = r => require.ensure([], () => r(require('@/components/system/role/permission')), 'permission');
const memberList = r => require.ensure([], () => r(require('@/components/system/member/list')), 'memberList');
const operatorInfo = r => require.ensure([], () => r(require('@/components/system/operatore/info')), 'operatorInfo');
const maintainerList = r => require.ensure([], () => r(require('@/components/system/maintainer/list')), 'maintainerList');
const deviceRebootList = r => require.ensure([], () => r(require('@/components/system/deviceReboot/list')), 'deviceRebootList');
const setdockingList = r => require.ensure([], () => r(require('@/components/system/setdocking/list')), 'setdockingList');
const GPSList = r => require.ensure([], () => r(require('@/components/system/GPS/list')), 'GPSList');
const sitecampanyList = r => require.ensure([], () => r(require('@/components/system/sitecompany/list')), 'sitecampanyList');
const equipmentList = r => require.ensure([], () => r(require('@/components/system/equipment/list')), 'equipmentList');

//调度管理
const dispatchList = r => require.ensure([], () => r(require('@/components/dispatch/dispatch/list')), 'dispatchList');
const sitemonitorList = r => require.ensure([], () => r(require('@/components/dispatch/sitemonitor/list')), 'sitemonitorList');
const transferList = r => require.ensure([], () => r(require('@/components/dispatch/transfer/list')), 'transferList');
const allocateList = r => require.ensure([], () => r(require('@/components/dispatch/allocate/list')), 'allocateList');

//下发指令管理
const operationList = r => require.ensure([], () => r(require('@/components/bicycledown/operation/list')), 'operationList');
const APPList = r => require.ensure([], () => r(require('@/components/bicycledown/app/list')), 'APPList');


const rechargeList = r => require.ensure([], () => r(require('@/components/userManage/recharge/list')), 'rechargeList');
const rechargeView = r => require.ensure([], () => r(require('@/components/userManage/recharge/view')), 'rechargeView');

const usermemberList = r => require.ensure([], () => r(require('@/components/userManage/usermember/list')), 'usermemberList');
const usermemberAdd = r => require.ensure([], () => r(require('@/components/userManage/usermember/addcard')), 'usermemberAdd');
const usermemberEdit = r => require.ensure([], () => r(require('@/components/userManage/usermember/editcard')), 'usermemberEdit');
const balanceList = r => require.ensure([], () => r(require('@/components/userManage/usermember/balance')), 'balanceList');
const rentbikeList = r => require.ensure([], () => r(require('@/components/userManage/usermember/rentbike')), 'rentbikeList');
const cardmemberList = r => require.ensure([], () => r(require('@/components/userManage/cardmember/list')), 'cardmemberList');

const userfeedbackList = r => require.ensure([], () => r(require('@/components/customerManage/userfeedback/list')), 'userfeedbackList');
const comingcallList = r => require.ensure([], () => r(require('@/components/customerManage/comingcall/list')), 'comingcallList');
const peopletotalList = r => require.ensure([], () => r(require('@/components/customerManage/peopletotal/list')), 'peopletotalList');
const informBycleList = r => require.ensure([], () => r(require('@/components/customerManage/informBycle/list')), 'informBycleList');

const urgencybikeList = r => require.ensure([], () => r(require('@/components/customerManage/urgencybike/list')), 'urgencybikeList');
const urgencybikeView = r => require.ensure([], () => r(require('@/components/customerManage/urgencybike/view')), 'urgencybikeView');
const carfaultList = r => require.ensure([], () => r(require('@/components/operatemonitoring/carfault/list')), 'carfaultList');
const positionView = r => require.ensure([], () => r(require('@/components/operatemonitoring/carfault/position')), 'positionView');
const cardynamictList = r => require.ensure([], () => r(require('@/components/operatemonitoring/cardynamic/list')), 'cardynamictList');
const cardynamictMap = r => require.ensure([], () => r(require('@/components/operatemonitoring/cardynamic/map')), 'cardynamictMap');
const cardynamictView= r => require.ensure([], () => r(require('@/components/operatemonitoring/cardynamic/view')), 'cardynamictView');
const rentcarList = r => require.ensure([], () => r(require('@/components/operatemonitoring/rentcar/list')), 'rentcarList');
const rentcardetailView = r => require.ensure([], () => r(require('@/components/operatemonitoring/rentcar/detail')), 'rentcardetailView');
const tempcarrentalList = r => require.ensure([], () => r(require('@/components/operatemonitoring/tempcarrental/list')), 'tempcarrentalList');


// const cardList = r => require.ensure([], () => r(require('@/components/system/card/list')), 'cardList');
const fenceList = r => require.ensure([], () => r(require('@/components/device/fence/list')), 'fenceList');
const fenceEdit = r => require.ensure([], () => r(require('@/components/device/fence/edit')), 'fenceEdit');
const addfenceView = r => require.ensure([], () => r(require('@/components/device/fence/addfence')), 'addfenceView');
const chargingpileList = r => require.ensure([], () => r(require('@/components/device/chargingpile/list')), 'chargingpileList');
const noputitList = r => require.ensure([], () => r(require('@/components/device/chargingpile/noputit')), 'noputitList');
const relevancesiteList = r => require.ensure([], () => r(require('@/components/device/relevancesite/list')), 'relevancesiteList');
const dockSiteList = r => require.ensure([], () => r(require('@/components/device/dockSite/list')), 'dockSiteList');
const addDockSiteView = r => require.ensure([], () => r(require('@/components/device/dockSite/add')), 'addDockSiteView');
const docksiteputinView = r => require.ensure([], () => r(require('@/components/device/dockSite/docksiteputin')), 'docksiteputinView');
const dockSiteEditView = r => require.ensure([], () => r(require('@/components/device/dockSite/dockSiteEdit')), 'dockSiteEditView');
const dockSiteView = r => require.ensure([], () => r(require('@/components/device/dockSite/dockSiteview')), 'dockSiteView');
const dockSitecar = r => require.ensure([], () => r(require('@/components/device/dockSite/dockSitecar')), 'dockSitecar');

const maintenancerList = r => require.ensure([], () => r(require('@/components/device/maintenancer/list')), 'maintenancerList');
const areaManagerList = r => require.ensure([], () => r(require('@/components/device/areaManager/list')), 'areaManagerList');
const addareaView = r => require.ensure([], () => r(require('@/components/device/areaManager/add')), 'addareaView');
const editareaView = r => require.ensure([], () => r(require('@/components/device/areaManager/edit')), 'editareaView');


//统计
const totalchargepile = r => require.ensure([], () => r(require('@/components/total/chargepile/list')), 'totalchargepile');
const totalBike = r => require.ensure([], () => r(require('@/components/total/bike/list')), 'totalBike');
const totalRent = r => require.ensure([], () => r(require('@/components/total/rent/list')), 'totalRent');
const bikeNumList = r => require.ensure([], () => r(require('@/components/total/bikeNum/list')), 'bikeNumList');
const bikeusertotalList = r => require.ensure([], () => r(require('@/components/total/bikeusertotal/list')), 'bikeusertotalList');
const bikenumdayList = r => require.ensure([], () => r(require('@/components/total/bikenumday/list')), 'bikenumdayList');
const bicyclerentdayList = r => require.ensure([], () => r(require('@/components/total/bicyclerentday/list')), 'bicyclerentdayList');
const mianlockList = r => require.ensure([], () => r(require('@/components/total/mianlock/list')), 'mianlockList');
const bicyclerentalldayList = r => require.ensure([], () => r(require('@/components/total/bicyclerentallday/list')), 'bicyclerentalldayList');
const timeMapList = r => require.ensure([], () => r(require('@/components/total/timetotalmap/list')), 'timeMapList');
const bicycleTotal = r => require.ensure([], () => r(require('@/components/total/bicycleTotal/list')), 'bicycleTotal');

const chargeruleList = r => require.ensure([], () => r(require('@/components/device/chargerule/list')), 'chargeruleList');
const maintainStation = r => require.ensure([], () => r(require('@/components/repair/maintainstation/list')), 'maintainStation');
const maintainStationAdd = r => require.ensure([], () => r(require('@/components/repair/maintainstation/add')), 'maintainStationAdd');
const maintainStationEdit = r => require.ensure([], () => r(require('@/components/repair/maintainstation/edit')), 'maintainStationEdit');



const allMalfunctionList = r => require.ensure([], () => r(require('@/components/repair/allMalfunction/list')), 'allMalfunctionList');
const foregiftList = r => require.ensure([], () => r(require('@/components/userManage/foregift/list')), 'foregiftList');
const retrunforegiftList = r => require.ensure([], () => r(require('@/components/userManage/foregift/retrunforegift')), 'retrunforegiftList');
const refundofflineList = r => require.ensure([], () => r(require('@/components/userManage/foregift/refundoffline')), 'refundofflineList');
const refundList = r => require.ensure([], () => r(require('@/components/userManage/refund/list')), 'refundList');
const refundoverdueList = r => require.ensure([], () => r(require('@/components/userManage/refund/refundoverdue')), 'refundoverdueList');
const consumeList = r => require.ensure([], () => r(require('@/components/userManage/consume/list')), 'consumeList');
const logList = r => require.ensure([], () => r(require('@/components/userManage/log/list')), 'logList');

const mapView = r => require.ensure([], () => r(require('@/components/pub/xpmap')), 'mapView');


//车辆监控
const siteMonitor = r => require.ensure([], () => r(require('@/components/monitor/site/list')), 'siteMonitor');
const yuqiList = r => require.ensure([], () => r(require('@/components/monitor/yuqi/list')), 'yuqiList');
const shorttimeList = r => require.ensure([], () => r(require('@/components/monitor/shorttime/list')), 'shorttimeList');
const locknowarnList = r => require.ensure([], () => r(require('@/components/monitor/locknowarn/list')), 'locknowarnList');
const faulttypeList = r => require.ensure([], () => r(require('@/components/monitor/faulttype/list')), 'faulttypeList');
const gpsRebootList = r => require.ensure([], () => r(require('@/components/monitor/gpsreboot/list')), 'gpsRebootList');
const Error = r => require.ensure([], () => r(require('@/components/error/404')), 'Error');
const anomalousList = r => require.ensure([], () => r(require('@/components/monitor/anomalous/list')), 'anomalousList');
const sharedBikeWarningList = r => require.ensure([], () => r(require('@/components/monitor/sharedBikeWarning/list')), 'sharedBikeWarningList');

//更新日志
const updateList = r => require.ensure([], () => r(require('@/components/update/list')), 'updateList');



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
            backshow:true
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
                }
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
                    title:"维修车辆位置"
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
                     backshow:true
                  },
                  component: permission,
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
                    title:"详情"
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
                title:"公共自行车站点共享入驻"
              },
              component: SubView,
              redirect: '/admin/system/sitecompany/list',
              children:[
                {
                  path: 'list',
                  meta:{
                    title:"公共自行车站点共享入驻"
                  },
                  component: sitecampanyList,
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
                    title: '新增',
                    backshow:true
                  },
                  component: usermemberAdd,
                },
                {
                  path: 'edit',
                  meta:{
                    title: '编辑',
                    backshow:true
                  },
                  component: usermemberEdit,
                },
                {
                  path: 'balance',
                  meta:{
                    title: '余额列表',
                    // backshow:true
                  },
                  component: balanceList,
                },
                {
                  path: 'rentbike',
                  meta:{
                    title: '用户租车记录',
                    // backshow:true
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
                    backshow:true
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
                    backshow:true
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
                  backshow:true
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
                   backshow:true
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
                   backshow:true
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
                 backshow:true
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
                 backshow:true
              },
              component: addDockSiteView,
            },
            {
              path: 'docksiteputin',
              meta:{
                 title: '投放充电桩',
                 backshow:true
              },
              component: docksiteputinView,
            },
            {
              path: 'dockSiteEdit',
              meta:{
                 title: '编辑站点',
                 backshow:true
              },
              component: dockSiteEditView,
            },
            {
              path: 'dockSiteView',
              meta:{
                 title: '详情',
                 backshow:true
              },
              component: dockSiteView,
            },
            {
              path: 'dockSitecar',
              meta:{
                 title: '地图上的站点',
                 backshow:true,
                 backurl:"/admin/device/dockSite/list"
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
      ]
    },
  ]
})
