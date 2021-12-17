import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const DownloadPoi = React.lazy(() => import("./application/downloadpoi"))

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<DownloadPoi />}>
            </Route>
        </Routes>
    </Router>
}