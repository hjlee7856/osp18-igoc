'use strict'

const fs                   = require('fs')
const path                 = require('path')
const utils                = require('./utils')
const webpack              = require('webpack')
const config               = require('../config')
const merge                = require('webpack-merge')
const baseWebpackConfig    = require('./webpack.base.conf')
const htmlWebpackPlugin    = require('html-webpack-plugin')
const friendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({ 'process.env': config.dev.env }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname, './service-worker-dev.js'), 'utf-8')}</script>`
        }),
        new friendlyErrorsPlugin()
    ]
})