const path = require("path");
module.exports = {
  webpack: {
    configure: (config) => {
      const rule = {
        test: /\.js$/,
        include: path.resolve(
          __dirname,
          "node_modules/ol/renderer/webgl/PointsLayer.js"
        ),
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      };
      config.module.rules[1].oneOf.unshift(rule);
      return config;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.proxy = {
      "/index/": {
        target: "https://xgs.gsjlxkgc.com",
        secure: false,
        changeOrigin: true,
      },
    };
    console.log(devServerConfig.proxy);
    return devServerConfig;
  },
};
