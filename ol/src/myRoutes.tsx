import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./components/map";
import { Map2 } from "./components/map2";


export function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />}></Route>
        <Route path="/map" element={<Map2 />}></Route>
      </Routes>
    </Router>
  );
}
