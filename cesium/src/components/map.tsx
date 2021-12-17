import "./map.css"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { useEffect } from 'react';
import axios from "axios";
import { BillboardGraphics, Cartesian3, CesiumTerrainProvider, defined, GeographicTilingScheme, HeightReference, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer, WebMapTileServiceImageryProvider } from "cesium";
import { Popup } from "./popup"
export const Map = () => {
    useEffect(() => {
        const key = Keys.tdt
        const attribution = '&copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'
        const dom = document.createElement("div")
        dom.innerHTML = attribution
        const viewer = new Viewer('map', {
            imageryProvider: new WebMapTileServiceImageryProvider({
                url: "http://t{s}.tianditu.com/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + key,
                subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                tilingScheme: new GeographicTilingScheme(),
                tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
                layer: "img",
                style: "default",
                tileMatrixSetID: "c"
            }),
            terrainProvider: new CesiumTerrainProvider({
                url: 'https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path',
            }),
            infoBox: false,
            selectionIndicator: false,
            animation: false,
            timeline: false,
            creditContainer: dom,
            baseLayerPicker: false
        })
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(103.742546, 36.06, 30000),
        })
        getDatas(viewer)
    })

    function getDatas(viewer: Viewer) {
        axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
            if (response.data?.data) {
                const { data } = response.data
                for (let i in data) {
                    const _data = data[i]
                    const { latitude, longitude, name, type } = _data
                    const isTrue = type === 1
                    const entity = {
                        name,
                        position: Cartesian3.fromDegrees(Number(longitude), Number(latitude)),
                        billboard: new BillboardGraphics({
                            image: isTrue ? "/img/marker1.png" : "/img/marker2.png",
                            heightReference: HeightReference.CLAMP_TO_GROUND,
                            width: 25,
                            height: 25,
                            eyeOffset: new Cartesian3(0, 0, -100)
                        }),
                        properties: _data
                    }
                    viewer.entities.add(entity)
                }
            }
        })

        const popup = new Popup(viewer)
        const mouseClickHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        mouseClickHandler.setInputAction((e) => {
            const { position } = e
            const pick = viewer.scene.pick(position);
            if (defined(pick) && pick.id) {
                const { properties } = pick.id
                if (properties) {
                    const { name, address, occur_time } = properties
                    const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`
                    popup.showInfo(position, html)
                }
            }
        }, ScreenSpaceEventType.LEFT_CLICK)
    }
    return <div className="lmap" id="map">

    </div>
};