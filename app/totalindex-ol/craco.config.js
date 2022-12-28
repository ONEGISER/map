const CracoLessPlugin = require('craco-less');
module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/index/": { target: '', secure: false, changeOrigin: true, }
        }
        console.log(devServerConfig.proxy);
        return devServerConfig;
    },
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: {
                        // '@primary-color': '#73ffff'
                        '@font-size-base': '16px'
                    },
                    javascriptEnabled: true,
                },
            },
        },
    }],
}