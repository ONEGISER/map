import "./map.css"
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import { useEffect } from "react";
import esriConfig from "@arcgis/core/config"
import esriRequest from "@arcgis/core/request";
export const Map = () => {
    useEffect(() => {
        esriConfig.apiKey = 'AAPKbe175e40b15e49058dfe57b996e86af16d-YTr6r1PEO-Bee2LIXdl4I18UosHFG-QpjVeefCk5g_xld_VynBEGSUwLAj4PC'
        esriRequest("/mapbox/styles/v1/mapbox/streets-v11").then((response) => {
            if (response.data) {
                const res = response.data
                res.sources.composite = {
                    type: "vector",
                    tiles: ["/mapbox/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/{z}/{x}/{y}.vector.pbf"],
                }
                res.sprite = "/mapbox/styles/v1/mapbox/streets-v11/sprite"
                res.glyphs = "/mapbox/fonts/v1/mapbox/{fontstack}/{range}.pbf"
                const vectorTileLayer = new VectorTileLayer({ style: res });
                const map = new EsriMap();
                new MapView({
                    map: map,
                    center: [103.742546, 36.06], 
                    zoom: 11,
                    container: "map" 
                });
                map.add(vectorTileLayer)
            }
        })
    })
    return <div className="lmap" id="map">

    </div>
};