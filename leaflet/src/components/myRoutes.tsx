import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./map"

export function MyRoutes() {
    return <Router>
        <Routes>
            <Route path="/" element={<Map />}>
            </Route>
        </Routes>
    </Router>
}