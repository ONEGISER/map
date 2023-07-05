import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Map } from "./components/map";
import { MapExt } from "./components/mapViewer";
import { FeatureLayerTest } from "./components/featureLayer";


export function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />}></Route>
        <Route path="/map" element={<MapExt />}></Route>
        <Route path="/featurelayer" element={<FeatureLayerTest />}></Route>

      </Routes>
    </Router>
  );
}
