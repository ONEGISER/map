import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cesium from "vite-plugin-cesium"; // 引入插件
import { resolve } from 'path';

// https://vitejs.dev/config/
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
export default defineConfig({
  plugins: [vue(), cesium()],
  resolve: {
    alias: [
      // /@/xxxx => src/xxxx
      {
        find: /\/@\//,
        replacement: pathResolve("src") + "/",
      },
      // /#/xxxx => types/xxxx
      {
        find: /\/#\//,
        replacement: pathResolve("types") + "/",
      },
    ],
  },
});
