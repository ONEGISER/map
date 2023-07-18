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
    let wmts = new Cesium.WebMapTileServiceImageryProvider({
      url: "http://60.13.54.71:31607/cim-platform/api/sharelink/getwmts?service=wmts&format=image/png&layer=cim_platform_20230602164907452514009128632320&key=76cceb49752ca62e80bc767e5485a1f9&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol=-{TileCol}",
      layer: "cim_platform_20230602164907452514009128632320", 
      style: "",
      format: "image/png",
      tileMatrixSetID: "EPSG:4326", //坐标系
      tilingScheme: new GeographicTilingScheme(),
      tileMatrixLabels: [
        "EPSG:4326:0",
        "EPSG:4326:1",
        "EPSG:4326:2",
        "EPSG:4326:3",
        "EPSG:4326:4",
        "EPSG:4326:5",
        "EPSG:4326:6",
        "EPSG:4326:7",
        "EPSG:4326:8",
        "EPSG:4326:9",
        "EPSG:4326:10",
        "EPSG:4326:11",
        "EPSG:4326:12",
        "EPSG:4326:13",
        "EPSG:4326:14",
        "EPSG:4326:15",
        "EPSG:4326:16",
        "EPSG:4326:17",
        "EPSG:4326:18",
      ], //查看geoserver，看切了几层
      maximumLevel: 19, //设置最高显示层级
      //    rectangle: new Cesium.Rectangle.fromDegrees(
      //       73.499,
      //       3.837,
      //       135.087,
      //       53.561
      //     ),
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
