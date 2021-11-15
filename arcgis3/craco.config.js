module.exports = {
    webpack: {
        configure: (config) => {
            //移除cesium警告
            config.externals = [
                function (context, request, callback) {
                    if (/^(esri|dojo|dijit|plot|geowit)\//.test(request)) {
                        return callback(null, "dojo.require('" + request + "')");
                    }
                    callback();
                }
            ]
            return config
        },

    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/index/": { target: 'https://xgs.gsjlxkgc.com', secure: false, changeOrigin: true, },
            "/mapbox": { target: 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2.json?access_token=pk.eyJ1IjoicGN6aGVuZyIsImEiOiJjanVjamJ3b28wNGdtNDRyMTBsdGUwZmd0In0.Md_NflCXHCTzzp6wGWZJxg', secure: false, changeOrigin: true, }
        }
        console.log(devServerConfig.proxy);
        return devServerConfig;
    },
}