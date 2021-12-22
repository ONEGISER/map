import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./map"
import { SimpleMap } from "./map/simpleMap";

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map />}>
            </Route>
            <Route path="/simpleMap" element={<SimpleMap />}>
            </Route>
        </Routes>
    </Router>
}