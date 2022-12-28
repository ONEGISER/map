import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { colors, Map } from "./components/map"
const tk = "0549bec0881a6e3ba4a593b97172bc00"

function getColor(value: number) {
    let color: any
    if (value > 50000) {
        color = { r: 255, g: 0, b: 0 }
    } else if (value > 25600) {
        color = { r: 255, g: 51, b: 0 }
    } else if (value > 12800) {
        color = { r: 255, g: 102, b: 0 }
    } else if (value > 6400) {
        color = { r: 255, g: 153, b: 0 }
    } else if (value > 3200) {
        color = { r: 255, g: 204, b: 0 }
    } else if (value > 1600) {
        color = { r: 255, g: 255, b: 0 }
    } else if (value > 400) {
        color = { r: 204, g: 255, b: 0 }
    } else if (value > 100) {
        color = { r: 153, g: 255, b: 0 }
    } else if (value > 50) {
        color = { r: 102, g: 255, b: 0 }
    } else {
        color = { r: 51, g: 255, b: 0 }
    }
    return color
}
export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map getColor={getColor} tk={tk} speed={2000} mapOption={{ lng: 112.40, lat: 31.2, zoom: 8 }} provinceUrl={"/datas/湖北省.json"} xinguanUrl={"/datas/hubeixinguan.geojson"} />}>
            </Route>
            <Route path="/china" element={<Map tk={tk} />}>
            </Route>
        </Routes>
    </Router>
}