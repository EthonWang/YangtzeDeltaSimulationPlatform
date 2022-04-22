const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
let cesiumSource = './node_modules/cesium/Source'

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    /** 区分打包环境与开发环境
     * process.env.NODE_ENV==='production'  (打包环境)
     * process.env.NODE_ENV==='development' (开发环境)
     * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
     */
    // 基本路径
    // baseUrl: "/",
    // 输出文件目录
    // outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    // lintOnSave: false,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: (config) => {
        // 配置路径别名
        config.resolve.alias
            .set("@", resolve("./src"))
            .set("components", resolve("./src/components"))
            .set("views", resolve("./src/views"))
            .set("assets", resolve("./src/assets"))
            .set("common", resolve("./src/common"))
            .set("cesium", resolve(cesiumSource))
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.join(cesiumSource, 'Workers'), to: 'Workers' },
                    { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                    { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
                    { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' },
                ],
            }),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Workers'), to: 'Workers'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers'}]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./')
            })
        ],
    },
    //如果想要引入babel-polyfill可以这样写
    // configureWebpack: (config) => {
    //   config.entry = ["babel-polyfill", "./src/main.js"]
    // },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    // productionSourceMap: true,
    // css相关配置
    // css: {
    //     // 是否使用css分离插件 ExtractTextPlugin
    //     extract: true,
    //     // 开启 CSS source maps?
    //     sourceMap: false,
    //     // css预设器配置项
    //     loaderOptions: {},
    //     // 启用 CSS modules for all css / pre-processor files.
    //     requireModuleExtension: false,
    // },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    // parallel: require("os").cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    // pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: true,
        host: "127.0.0.1",
        port: 3030,
        https: false,
        hotOnly: false,
        proxy: {
            // 配置跨域
            '/back': {
                target: "http://172.21.213.183:8999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    '^/back':'',
                },
            },
            "/back_backup": {
                target: "http://172.21.213.222:9999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    "/back_backup": "",
                },
            },
            "/back_data": {
                target: "http://172.21.213.222:8999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    "/back_data": "",
                },
            },
        }, // 设置代理
        // before: (app) => { },
    },
    // 第三方插件配置
    // pluginOptions: {
    //     // ...
    // },

};
