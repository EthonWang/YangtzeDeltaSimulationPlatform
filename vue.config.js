const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
let cesiumSource = './node_modules/cesium/Source'

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {

    chainWebpack: (config) => {
        const oneOfsMap = config.module.rule("less").oneOfs.store;
        oneOfsMap.forEach(item => {
          item
            .use("style-resources-loader")
            .loader("style-resources-loader")
            .options({
              // or an array : ["./path/to/vars.less", "./path/to/mixins.less"] 这里的路径不能使用@，否则会报错
              patterns: "./src/assets/css/common.less"
            })
            .end()
        })
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
        module: {
            unknownContextCritical : false,
            rules: [],
        },
    },
    css:{
        loaderOptions:{
            less:{
                javascriptEnabled:true,//允许链式调用的换行
            }
       }
    },
    devServer: {
        open: true,
        host: "http://172.21.213.222/",
        port: 3030,
        https: false,
        hotOnly: false,
        proxy: {
            // 配置跨域
            '/back': {
                target: "http://172.21.213.44:8999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    '^/back':'',
                },
            },
            "/back_backup": {
                target: "http://172.21.213.248:9999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    "/back_backup": "",
                },
            },
            "/back_data": {
                target: "http://172.21.213.248:8999",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    "/back_data": "",
                },
            },
            "/echarts": {
                target: "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples",
                ws: true,
                timeout: 3600000,
                changOrigin: true,
                pathRewrite: {
                    "/echarts": "",
                },
            },
        }, // 设置代理
        // before: (app) => { },
    },
    
pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
              patterns: []
    }
  }
    

};
