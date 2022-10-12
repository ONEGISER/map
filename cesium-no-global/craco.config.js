const CracoLessPlugin = require('craco-less');
module.exports = {
    plugins: [
        {
            plugin: require("craco-cesium")()
        },
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#1DA57A' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ]
};