import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ArcgisDynamicData } from "./application/arcgisDynamicData";
const DownloadPoi = React.lazy(() => import("./application/downloadpoi"))

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<DownloadPoi />}>
            </Route>
            <Route path="/arcgis" element={<ArcgisDynamicData />}>
            </Route>
        </Routes>
    </Router>
}