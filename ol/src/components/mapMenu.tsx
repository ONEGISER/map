import "./map.css";
import "ol/ol.css";
import "./style/mapMenu.css";
import { useEffect } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import XYZ from "ol/source/XYZ";
import ImageStatic from "ol/source/ImageStatic";
import { transformExtent, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { HomeSub2 } from "./homeSub2";
import { HomeSub1 } from "./homeSub1";
import url from "./1.png";
import Vector from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Layer from "ol/layer/Layer";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";
import { asArray } from "ol/color";
import { packColor } from "ol/renderer/webgl/shaders";
import { Overlay } from "ol";
export const GradeColors: { [key: string]: string } = {
  优: "#33cc33",
  良: "#60fae7",
  中: "#dfed73",
  次: "#ffc691",
  差: "#f95302",
  无: "#fde981",
};
let ref: any;
export const MapMenu = () => {
  useEffect(() => {
    const map = new OlMap({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: transform(
          [119.363083141000047, 29.103464222000067],
          "EPSG:4326",
          "EPSG:3857"
        ),
        zoom: 10,
      }),
    });

    addLayer(map);
  }, []);

  async function addLayer(map: OlMap) {
    map.getViewport().addEventListener("contextmenu", function (event) {
      event.preventDefault();
      const coordinate = map.getEventCoordinate(event);
      const el = ref;
      if (el?.style) el.style.display = "block";
      const menu_overlay = new Overlay({
        element: el as any,
        positioning: "top-left",
      });
      menu_overlay.setMap(map);
      menu_overlay.setPosition(coordinate);
    });
  }

  return (
    <div>
      <div className="lmap" id="map"></div>
      <div ref={(_ref) => (ref = _ref)} className="contextmenu">
        <ul>
          <li>
            <a href="#">设置中心</a>
          </li>
          <li>
            <a href="#">加入地标</a>
          </li>
          <li>
            <a href="#">距离丈量</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
