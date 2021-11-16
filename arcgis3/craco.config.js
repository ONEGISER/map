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
            "/mapbox/": {
                target: ' https://api.mapbox.com', secure: false, changeOrigin: true,
                pathRewrite: function (path, req) {
                    path = path.replace("/mapbox/", "/")
                    if (path.indexOf("?") > -1) {
                        path = `${path}&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`
                    } else {
                        path = `${path}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`
                    }
                    console.log(path);
                    return path
                }
            },
            "/index/": { target: 'https://xgs.gsjlxkgc.com', secure: false, changeOrigin: true, },
            "/njmap/": {
                target: 'http://mapservices.njghzy.com.cn:84', secure: false, changeOrigin: true,
                pathRewrite: function (path, req) {
                    if (path.indexOf("?") > -1) {
                        path = `${path}&njtoken=ebec67d6795afcbaaf8e17645061d1bb`
                    } else {
                        path = `${path}?njtoken=ebec67d6795afcbaaf8e17645061d1bb`
                    }
                    return path
                }
            },
        }
        return devServerConfig;
    },
}