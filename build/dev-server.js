'use strict'

require('./check-versions')()

const config          = require('../config')
const opn             = require('opn')
const path            = require('path')
const express         = require('express')
const webpack         = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig   = require('./webpack.dev.conf')

const port            = process.env.PORT || config.dev.port
const uri             = 'http://localhost:' + port
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const proxyTable      = config.dev.proxyTable

const app      = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false
})

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, callback) {
        hotMiddleware.publish({ action: 'reload' })
        callback()
    })
})

app.use(hotMiddleware)

Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context]

    if (typeof options === 'string') {
        options = { target: options }
    }

    app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())
app.use(devMiddleware)

const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

let _resolve
const readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')

devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')

    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }

    _resolve()
})

const server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => { server.close() }
}