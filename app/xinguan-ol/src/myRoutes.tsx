import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./components/map"
const tk = "0549bec0881a6e3ba4a593b97172bc00"

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map tk={tk} speed={2000} mapOption={{ lng: 112.40, lat: 31.2, zoom: 8 }} provinceUrl={"/datas/湖北省.json"} xinguanUrl={"/datas/hubeixinguan.geojson"} />}>
            </Route>
            <Route path="/china" element={<Map tk={tk} />}>
            </Route>
        </Routes>
    </Router>
}