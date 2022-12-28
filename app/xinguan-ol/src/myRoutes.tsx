import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getColors, Map } from "./components/map"
const tk = "0549bec0881a6e3ba4a593b97172bc00"
export const colors = getColors({ r: 182, g: 215, b: 0 }, { r: 255, g: 153, b: 153 }, 10)

function getColor(value: number) {
    let color: any
    if (value > 50000) {
        color = { r: 255, g: 0, b: 0 }
    } else if (value > 45000) {
        color = { r: 255, g: 51, b: 51 }
    } else if (value > 10000) {
        color = { r: 255, g: 102, b: 51 }
    } else if (value > 3000) {
        color = { r: 255, g: 153, b: 153 }
    } else {
        const index = parseInt((value / 300).toString())
        color = colors[index]
    }
    return color
}

const dates = ["1.25-2.7", "2.8-2.21", "2.22-3.6", "3.7-3.20", "3.21-4.3", "4.4-4.25"]


export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map getColor={getColor} dates={dates} tk={tk} speed={2000} mapOption={{ lng: 112.40, lat: 31.2, zoom: 8 }} provinceUrl={"/datas/湖北省.json"} xinguanUrl={"/datas/hubeixinguan.geojson"} />}>
            </Route>
            <Route path="/china" element={<Map tk={tk} />}>
            </Route>
        </Routes>
    </Router>
}