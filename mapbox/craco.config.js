module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.proxy = {
            "/index/": { target: 'https://xgs.gsjlxkgc.com', secure: false, changeOrigin: true, },
        }
        return devServerConfig;
    },
}