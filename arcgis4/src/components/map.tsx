import "./map.css"
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import { useEffect } from "react";
import esriConfig from "@arcgis/core/config"
import axios from "axios";
export const Map = () => {
    useEffect(() => {
        esriConfig.apiKey = 'AAPKbe175e40b15e49058dfe57b996e86af16d-YTr6r1PEO-Bee2LIXdl4I18UosHFG-QpjVeefCk5g_xld_VynBEGSUwLAj4PC'
        // const map = new EsriMap({
        //     basemap: "arcgis-topographic" // Basemap layer service
        // });
        // const viewer = new MapView({
        //     map: map,
        //     center: [103.742546, 36.06], // Longitude, latitude
        //     zoom: 13, // Zoom level
        //     container: "map" // Div element
        // });
        axios.get("/mapbox/styles/v1/mapbox/streets-v11").then((response) => {
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
                    center: [103.742546, 36.06], // Longitude, latitude
                    zoom: 11, // Zoom level
                    container: "map" // Div element
                });
                map.add(vectorTileLayer)
            }
        })
    })

    function getDatas(viewer: any) {
        // axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
        //     if (response.data?.data) {
        //         const { data } = response.data
        //         for (let i in data) {
        //             const _data = data[i]
        //             const { latitude, longitude, name, type } = _data
        //             const isTrue = type === 1
        //             const entity = {
        //                 name,
        //                 position: Cartesian3.fromDegrees(Number(longitude), Number(latitude)),
        //                 billboard: new BillboardGraphics({
        //                     image: isTrue ? "/img/marker1.png" : "/img/marker2.png",
        //                     heightReference: HeightReference.CLAMP_TO_GROUND,
        //                     width: 25,
        //                     height: 25,
        //                     eyeOffset: new Cartesian3(0, 0, -100)
        //                 }),
        //                 properties: _data
        //             }
        //             viewer.entities.add(entity)
        //         }
        //     }
        // })

        // const popup = new Popup(viewer)
        // const mouseClickHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        // mouseClickHandler.setInputAction((e) => {
        //     const { position } = e
        //     const pick = viewer.scene.pick(position);
        //     if (defined(pick) && pick.id) {
        //         const { properties } = pick.id
        //         if (properties) {
        //             const { name, address, occur_time } = properties
        //             const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`
        //             popup.showInfo(position, html)
        //         }
        //     }
        // }, ScreenSpaceEventType.LEFT_CLICK)
    }
    return <div className="lmap" id="map">

    </div>
};