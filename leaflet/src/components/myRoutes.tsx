import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./map"
import { SimpleMap } from "./map/simpleMap";
import { Test } from "./map/test";

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map />}>
            </Route>
            <Route path="/simpleMap" element={<SimpleMap />}>
            </Route>
            <Route path="/test" element={<Test />}>
            </Route>
        </Routes>
    </Router>
}