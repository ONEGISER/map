/*
 * @Author: pczheng 1305780485@qq.com
 * @Date: 2022-08-30 18:48:44
 * @LastEditors: pczheng
 * @LastEditTime: 2023-03-20 20:25:11
 * @Description: file content
 */
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ArcgisDynamicData } from "./application/arcgisDynamicData";
const DownloadPoi = React.lazy(() => import("./application/downloadpoi"));
const BaiduPOIToWGS84 = React.lazy(
  () => import("./application/baiduPOIToWGS84")
);

export function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DownloadPoi />}></Route>
        <Route path="/arcgis" element={<ArcgisDynamicData />}></Route>
        <Route path="/baidu" element={<BaiduPOIToWGS84 />}></Route>
      </Routes>
    </Router>
  );
}
