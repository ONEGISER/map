import "leaflet/dist/leaflet.css"
import { useEffect } from 'react';
import L from "leaflet"
export const SimpleMap = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"]
        const key = Keys.tdt
        const attribution = '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a> 提供地图'

        const imgLayer = L.tileLayer("http://t{s}.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution
        })
        const imgLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 1,
            subdomains
        })
        const vecLayer = L.tileLayer("http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution
        })
        const vecLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 1,
            subdomains
        })


        const defaultLayers = L.layerGroup([vecLayer, vecLabelLayer])

        const map = L.map('map', {
            crs: L.CRS.EPSG4326,
            zoom: 17,
            attributionControl: true,
            layers: [defaultLayers] as any
        }).setView([36.06, 103.742546], 11);

        const baseLayers = {
            "矢量": defaultLayers,
            "影像": L.layerGroup([imgLayer, imgLabelLayer])
        };
        const layerControl = L.control.layers(baseLayers);
        map.addControl(layerControl);

        require("./map.css")
    },[])

    return <div className="lmap" id="map">

    </div>
};