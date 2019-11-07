'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing202"',
  API_ROOT:'"http://192.168.1.201:9071"',
  API_PUBLIC_ROOT:'"http://192.168.1.201:9071"',

  API_WEBSOCKET_OPERATOR:'"ws://192.168.1.201:9071"',
  API_WEBSOCKET_APP:'"ws://192.168.1.201:9077"'
})
