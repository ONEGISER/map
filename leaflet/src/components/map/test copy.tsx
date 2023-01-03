import "leaflet/dist/leaflet.css"
import { useEffect } from 'react';
import L from "leaflet"
import { DynamicMapLayer } from "esri-leaflet"
export const Test = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"]
        const attribution = '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a> 提供地图'

        const imgLayer = L.tileLayer("http://101.43.20.51:8021/mapserver/vmap/1564547560840740866_农林牧渔生产总值/getMAP?x={x}&y={y}&l={z}&styleId=_default__&tilesize=256&ratio=1", {
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution
        })


        const defaultLayers = L.layerGroup([imgLayer])


        const map:any = L.map('map', {
            crs: L.CRS.EPSG4326,
            zoom: 17,
            attributionControl: true,
            layers: [defaultLayers] as any
        }).setView([36.06, 103.742546], 11);

        new DynamicMapLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
            opacity: 0.7
        }).addTo(map);

        require("./map.css")
    }, [])

    return <div className="lmap" id="map">

    </div>
};