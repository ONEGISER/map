module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/mapbox/": {
                target: 'https://api.mapbox.com', secure: false, changeOrigin: true,
                pathRewrite: function (path, req) {
                    path = path.replace("/mapbox/", "/")
                    const access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
                    if (path.indexOf("?") > -1) {
                        path = `${path}&access_token=${access_token}`
                    } else {
                        path = `${path}?access_token=${access_token}`
                    }
                    return path
                }
            },
            "/index/": { target: 'https://xgs.gsjlxkgc.com', secure: false, changeOrigin: true, },
        }
        console.log(devServerConfig.proxy);
        return devServerConfig;
    },
}