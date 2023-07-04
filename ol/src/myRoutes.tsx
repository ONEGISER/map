import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./components/map";
import { Map2 } from "./components/map2";
import { VectorMap } from "./components/vectorMap";
import { WebglPolygon } from "./components/webglPolygon";
import { WebglPoint } from "./components/webglPoint";


import { MapMenu } from "./components/mapMenu";
import Drag from "./components/drag";
export function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />}></Route>
        <Route path="/map" element={<Map2 />}></Route>
        <Route path="/vmap" element={<VectorMap />}></Route>
        <Route path="/test" element={<MapMenu />}></Route>
        <Route path="/drag" element={<Drag />}></Route>
        <Route path="/webglPolygon" element={<WebglPolygon />}></Route>
        <Route path="/webglPoint" element={<WebglPoint />}></Route>
      </Routes>
    </Router>
  );
}
