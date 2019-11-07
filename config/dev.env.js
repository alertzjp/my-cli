'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  /**
   * 生产环境 1
   */
  API_ROOT:'"http://192.168.1.203:9071"',
  API_PUBLIC_ROOT:'"http://192.168.1.203:9071"',
  // API_ROOT:'"http://api.operator.rightsidetech.com"',
  // API_PUBLIC_ROOT:'"http://api.operator.rightsidetech.com"',

  API_WEBSOCKET_OPERATOR:'"ws://192.168.1.203:9071"',
  API_WEBSOCKET_APP:'"ws://192.168.1.203:9077"'
  // API_WEBSOCKET_OPERATOR:'"ws://api.ws.rightsidetech.com"',
  // API_WEBSOCKET_APP:'"ws://app2.ws.rightsidetech.com"'

  /**
   * 生产环境 2
   */
  // API_ROOT:'"http://124.160.63.242:9071"',
  // API_PUBLIC_ROOT:'"http://124.160.63.242:9071"',
  // API_WEBSOCKET_APP:'"ws://124.160.63.242:19077"'

  // API_ROOT:'"http://api.operator.rightsidetech.com"',
  // API_PUBLIC_ROOT:'"http://api.operator.rightsidetech.com"'

})
