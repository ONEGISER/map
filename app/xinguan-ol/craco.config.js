module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/index/": { target: '', secure: false, changeOrigin: true, }
        }
        console.log(devServerConfig.proxy);
        return devServerConfig;
    },
}