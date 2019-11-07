'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"http://192.168.1.114:9071"',
  API_PUBLIC_ROOT:'"http://192.168.1.114:9071"',

  API_WEBSOCKET_OPERATOR:'"ws://192.168.1.114:9071"',
  API_WEBSOCKET_APP:'"ws://192.168.1.114:9077"'
})
