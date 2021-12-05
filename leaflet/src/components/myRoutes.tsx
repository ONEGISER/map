import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./map"
const DownloadPoi = React.lazy(() => import("./application/downloadpoi"))

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map />}>
            </Route>
            <Route path="/poi" element={<DownloadPoi />}>
            </Route>
        </Routes>
    </Router>
}