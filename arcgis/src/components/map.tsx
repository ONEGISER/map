import "./map.css"
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { useEffect } from "react";
import esriConfig from "@arcgis/core/config"
export const Map = () => {
    useEffect(() => {
        esriConfig.apiKey='AAPKbe175e40b15e49058dfe57b996e86af16d-YTr6r1PEO-Bee2LIXdl4I18UosHFG-QpjVeefCk5g_xld_VynBEGSUwLAj4PC'
        const map = new EsriMap({
            basemap: "arcgis-topographic" // Basemap layer service
        });
        new MapView({
            map: map,
            center: [-118.805, 34.027], // Longitude, latitude
            zoom: 13, // Zoom level
            container: "map" // Div element
        });
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