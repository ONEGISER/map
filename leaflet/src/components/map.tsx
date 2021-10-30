import "leaflet/dist/leaflet.css"
import { useEffect } from 'react';
import L from "leaflet"
import axios from "axios";
export const Map = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"]
        const key = "2c2bd4a5e1b2ca388e427c01d9b289d6"
        const attribution = '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a> 提供地图 &copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'

        const imgLayer = L.tileLayer("http://t{s}.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution
        })
        const imgLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains
        })

        const vecLayer = L.tileLayer("http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution
        })
        const vecLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains
        })


        const defaultLayers = L.layerGroup([vecLayer, vecLabelLayer])



        require("./map.css")
        getDatas((trueMarkers: L.Marker[], goMarkers: L.Marker[]) => {
            const trueMarkersG = L.layerGroup(trueMarkers)
            const goMarkersG = L.layerGroup(goMarkers)
            const baseLayers = {
                "矢量": defaultLayers,
                "影像": L.layerGroup([imgLayer, imgLabelLayer])
            };
            const map = L.map('map', {
                crs: L.CRS.EPSG4326,
                zoom: 17,
                attributionControl: true,
                layers: [defaultLayers, trueMarkersG, goMarkersG] as any
            }).setView([36.06, 103.742546], 11);

            const overLayers = {
                "确诊": trueMarkersG,
                "轨迹": goMarkersG
            };
            const layerControl = L.control.layers(baseLayers, overLayers);
            map.addControl(layerControl);
        })
    })

    function getDatas(success: (trueMarkers: L.Marker[], goMarkers: L.Marker[]) => void) {
        axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
            console.log(response);
            if (response.data?.data) {
                const { data } = response.data
                const trueMarkers = []
                const goMarkers = []
                for (let i in data) {
                    const _data = data[i]
                    const { latitude, longitude, name, address, type, occur_time } = _data
                    const isTrue = type === 1
                    const customColor = isTrue ? '#ff3333' : "#FF8C00"
                    const cutomBorderColor = isTrue ? "#ff0000" : "#FFA54F"
                    const markerHtmlStyles = `
                        background-color: ${customColor};
                        width: 1rem;
                        height: 1rem;
                        display: block;
                        position: relative;
                        border-radius: 3rem 3rem 0;
                        transform: rotate(45deg);
                        border: 2px solid ${cutomBorderColor}`

                    const icon = L.divIcon({
                        className: "my-custom-pin",
                        html: `<span style="${markerHtmlStyles}" />`
                    })
                    const marker = L.marker([latitude, longitude], { icon }).bindPopup(`<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`)
                    if (isTrue) {
                        trueMarkers.push(marker)
                    } else {
                        goMarkers.push(marker)
                    }
                }
                success(trueMarkers, goMarkers)
            }
        })
    }
    return <div className="lmap" id="map">

    </div>
};