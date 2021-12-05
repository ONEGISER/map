import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DownloadPoi } from "./application/downloadpoi";
import { Map } from "./map"

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