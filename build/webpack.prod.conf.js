'use strict'

const fs                      = require('fs')
const path                    = require('path')
const utils                   = require('./utils')
const webpack                 = require('webpack')
const config                  = require('../config')
const merge                   = require('webpack-merge')
const baseWebpackConfig       = require('./webpack.base.conf')
const copyWebpackPlugin       = require('copy-webpack-plugin')
const htmlWebpackPlugin       = require('html-webpack-plugin')
const extractTextPlugin       = require('extract-text-webpack-plugin')
const optimizeCSSPlugin       = require('optimize-css-assets-webpack-plugin')
const swPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const loadMinified            = require('./load-minified')

const environment   = config.build.env
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: (config.build.productionSourceMap) ? ('#source-map') : (false),
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': environment }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourceMap: true
        }),
        new extractTextPlugin({ filename: utils.assetsPath('css/[name].[contenthash].css') }),
        new optimizeCSSPlugin({ cssProcessorOptions: { safe: true } }),
        new htmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',
            serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname, './service-worker-prod.js'))}</script>`
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        new copyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new swPrecacheWebpackPlugin({
            cacheId: 'To-Do',
            filename: 'service-worker.js',
            staticFileGlobs: ['dist/**/*.{js,html,css}'],
            minify: true,
            stripPrefix: 'dist/'
        })
    ]
})

if (config.build.productionGzip) {
    const compressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(new compressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
    }))
}

if (config.build.bundleAnalyzerReport) {
    const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

    webpackConfig.plugins.push(new bundleAnalyzerPlugin())
}

module.exports = webpackConfig