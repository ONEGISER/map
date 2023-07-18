const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const plugins = [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'node_modules/cesium/Build/Cesium', to: 'Cesium' },
        ],
    }),
    new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./Cesium/')
    })
]
module.exports = {
    webpack: {
        plugins,
        configure: (config) => {
            const rule = {
                test: /\.js$/,
                use: {
                    loader: '@open-wc/webpack-import-meta-loader',
                },
            }
            config.module.rules[1].oneOf.unshift(rule)
            //移除cesium警告
            config.module.unknownContextCritical = false
            config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
            config.externals = [{
                'cesium': 'Cesium',
            },]
            return config
        },
    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/index/": { target: 'https://xgs.gsjlxkgc.com', secure: false, changeOrigin: true, }
        }
        console.log(devServerConfig.proxy);
        return devServerConfig;
    },
}