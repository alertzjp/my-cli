'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing202"',
  API_ROOT:'"http://124.160.63.242:9071"',

  API_WEBSOCKET_OPERATOR:'"ws://124.160.63.242:9071"',
  API_WEBSOCKET_APP:'"ws://124.160.63.242:19077"'
})
