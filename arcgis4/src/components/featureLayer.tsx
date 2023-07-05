import "./map.css";
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import { useEffect } from "react";
import esriConfig from "@arcgis/core/config";
import esriRequest from "@arcgis/core/request";
import Circle from "@arcgis/core/geometry/Circle";
import Graphic from "@arcgis/core/Graphic";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import Map from "@arcgis/core/Map.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
export const FeatureLayerTest = () => {
  useEffect(() => {
    

    const myMap = new Map({
      basemap: "streets-vector",
    });
    // Create a MapView instance (for 2D viewing) and reference the map instance
    const view = new MapView({
      map: myMap,
      container: "map",
    });

    const layer = new FeatureLayer({
      // URL to the service
      url: "http://xx.xx.xx.xx:xx/arcgis/rest/services/GSshanhong/%E9%98%B2%E6%B2%BB%E5%8C%BA%E5%9F%BA%E6%9C%AC%E6%83%85%E5%86%B5_%E8%B0%83%E6%9F%A5%E8%AF%84%E4%BB%B7/MapServer/0"
    });
   

    myMap.add(layer);
  });
  return <div className="lmap" id="map"></div>;
};
