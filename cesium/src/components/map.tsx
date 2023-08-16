import "./map.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect } from "react";
import axios from "axios";
import {
  BillboardGraphics,
  Cartesian3,
  CesiumTerrainProvider,
  defined,
  GeographicTilingScheme,
  HeightReference,
  Rectangle,
  Resource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  WebMapTileServiceImageryProvider,
} from "cesium";
import { Popup } from "./popup";
export const Map = () => {
  useEffect(() => {
    const key = "4267820f43926eaf808d61dc07269beb";
    // const attribution = '&copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'
    // const dom = document.createElement("div")
    // dom.innerHTML = attribution
    let wmts = new Cesium.ArcGisMapServerImageryProvider({
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer",
    });

    const viewer = new Viewer("map", {
      imageryProvider: wmts,
      infoBox: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      // creditContainer: dom,
      baseLayerPicker: false,
    });

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(102.68587, 37.94787, 30000),
    });
    // getDatas(viewer)
  });

  function getDatas(viewer: Viewer) {
    axios.get("/index/index/get_data.html").then((response) => {
      //https://xgs.gsjlxkgc.com
      if (response.data?.data) {
        const { data } = response.data;
        for (let i in data) {
          const _data = data[i];
          const { latitude, longitude, name, type } = _data;
          const isTrue = type === 1;
          const entity = {
            name,
            position: Cartesian3.fromDegrees(
              Number(longitude),
              Number(latitude)
            ),
            billboard: new BillboardGraphics({
              image: isTrue ? "/img/marker1.png" : "/img/marker2.png",
              heightReference: HeightReference.CLAMP_TO_GROUND,
              width: 25,
              height: 25,
              eyeOffset: new Cartesian3(0, 0, -100),
            }),
            properties: _data,
          };
          viewer.entities.add(entity);
        }
      }
    });

    const popup = new Popup(viewer);
    const mouseClickHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    mouseClickHandler.setInputAction((e: any) => {
      const { position } = e;
      const pick = viewer.scene.pick(position);
      if (defined(pick) && pick.id) {
        const { properties } = pick.id;
        if (properties) {
          const { name, address, occur_time } = properties;
          const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`;
          popup.showInfo(position, html);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  }
  return <div className="lmap" id="map"></div>;
};
