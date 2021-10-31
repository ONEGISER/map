import "./map.css"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { useEffect } from 'react';
import axios from "axios";
import { BillboardGraphics, Cartesian3, CesiumTerrainProvider, defined, GeographicTilingScheme, HeightReference, ProviderViewModel, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer, WebMapTileServiceImageryProvider } from "cesium";
import { Popup } from "./popup"
export const Map = () => {
    useEffect(() => {
        const key = "2c2bd4a5e1b2ca388e427c01d9b289d6"
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
            selectionIndicator: false
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
                    const { latitude, longitude, name, address, type, occur_time } = _data
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
                    const e = viewer.entities.add(entity)

                    const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`

                    // html2canvas(markerContainer).then((value) => {
                    //     console.log(value);

                    // });
                    // const popup = new mapboxgl.Popup({ className: 'my-class' })
                    //     .setLngLat(lnglat)
                    //     .setHTML(html)
                    //     .setMaxWidth("300px")
                    //     .addTo(map);
                    // new mapboxgl.Marker(markerContainer, { rotation: 45 }).setLngLat(lnglat).setPopup(popup)
                    //     .addTo(map);

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