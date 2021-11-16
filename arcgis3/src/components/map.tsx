import "./map.css"
import { useEffect } from "react";
import { loadModules } from 'esri-loader';
import axios from "axios";
export const Map = () => {
    useEffect(() => {
        loadModules(['esri/map', "esri/layers/VectorTileLayer","esri/geometry/Extent"])
            .then(([Map, VectorTileLayer,Extent]) => {
                const map = new Map('map', {
                    center: [103, 36],
                    zoom:3,
                    // basemap: 'dark-gray'
                });
                // const url = "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/styles/root.json"
                // const vectorTileLayer = new VectorTileLayer(url);
                // map.addLayer(vectorTileLayer)

                const token = "?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
                axios.get("/mapbox/styles/v1/mapbox/streets-v11").then((response) => {
                    if (response.data) {
                        const res = response.data
                        res.sources.composite = {
                            type: "vector",
                            tiles: ["/mapbox/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/{z}/{y}/{x}.vector.pbf"],
                        }
                        res.sprite = "/mapbox/styles/v1/mapbox/streets-v11/sprite"
                        res.glyphs = "/mapbox/fonts/v1/mapbox/{fontstack}/{range}.pbf"
                        const vectorTileLayer = new VectorTileLayer(res);
                        map.addLayer(vectorTileLayer)
                    }

                })

                // const url="/njmap/rest/services/Hosted/NJVTS_TDT_DT/VectorTileServer"
                // const url = "/mapbox/styles/v1/mapbox/streets-v11"
                // const vectorTileLayer = new VectorTileLayer(url);
                // map.addLayer(vectorTileLayer)
            })
            .catch(err => {
                console.error(err);
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