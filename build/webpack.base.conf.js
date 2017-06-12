var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')


function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        index: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'vue-router$': 'vue-router/dist/vue-router.common.js',
            'jquery': 'jquery',
        }
    },
  
    module: {
        rules: [
            // {
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   enforce: 'pre',
            //   include: [resolve('src'), resolve('test')],
            //   options: {
            //     formatter: require('eslint-friendly-formatter')
            //   }
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            // 解析.css 文件
            {
                test: '/\.css$/',
                loader: 'css-loader',
            },
            // 解析 .scss 文件, 对于用import 或require 引入的sass文件进行加载,以及<style lang="sass">...</style>声明的内部样式进行加载
            {
                test: '/\.scss$/',
                loader: 'sass-loader' // 这样用了样式分离出来的插件,如果不想的分离出来,可以直接这样写 loader:style!css!sass
            },
            // 将jQuery 变量暴露到全局
            {
                test: resolve('../node_modules/jquery/dist/jquery.min.js'),
                loader: 'expose?jQuery'
            },
        ]
    },

    // vue: {
    //     loader: {
    //         js: 'babel-loader',
    //         css: ExtractTextPlugin.extract('css'),
    //         sass: ExtractTextPlugin.extract('css!sass')
    //     }
    // },
    // plugins: [
    //     new ExtractTextPlugin('style.css')
    // ]
}
