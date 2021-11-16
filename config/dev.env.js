'use strict'

const merge           = require('webpack-merge')
const prodEnvironment = require('./prod.env')

module.exports = merge(prodEnvironment, {
    NODE_ENV: '"development"'
})