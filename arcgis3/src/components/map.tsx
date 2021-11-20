import "./map.css"
import { useEffect } from "react";
import { loadModules } from 'esri-loader';
export const Map = () => {
    useEffect(() => {
        loadModules(['esri/map', "esri/layers/VectorTileLayer", "esri/geometry/Extent", "esri/request"],)
            .then(([Map, VectorTileLayer, Extent, esriRequest]) => {
                const map = new Map('map', {
                    center: [118.795367, 31.921581],
                    zoom: 14,
                });
                const url = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/styles/root.json"
                const vectorTileLayer = new VectorTileLayer(url);
                map.addLayer(vectorTileLayer)
            })
            .catch(err => {
                console.error(err);
            });
    })
    
    return <div className="lmap" id="map">

    </div>
};