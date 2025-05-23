import "./map.css";
import "ol/ol.css";
import { useEffect, useState } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { Contextmenu } from "./utils/contextmenu";
import { Draw } from "./utils/draw";
import Feature from "ol/Feature";
import { fromEPSGCode } from "ol/proj/proj4";
let ref: any;
let menu: any;
export const MapMenu = () => {
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    const result = fromEPSGCode("ESPG:4490");
    console.log(result);
    
    const map = new OlMap({
      target: "map",
      layers: [
        new TileLayer({
          // title: "天地图矢量图层",
          source: new XYZ({
            url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=4267820f43926eaf808d61dc07269beb",
            wrapX: false,
          }),
        }),
        new TileLayer({
          // title: "天地图矢量图层注记",
          source: new XYZ({
            url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=4267820f43926eaf808d61dc07269beb",
            wrapX: false,
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

    addMenu(map);
  }, []);

  async function addMenu(map: OlMap) {
    const draw = new Draw(map, {
      onChange: (feature, features, type) => {
        const datas: any[] = [];
        features.map((feature) => {
          datas.push(feature.getProperties());
        });
        setFeatures(datas);
      },
    });
    menu = new Contextmenu(map, ref, {
      onClick: (e: any, coord) => {
        const result = transform(coord, "EPSG:4326", "EPSG:3857");
        if (e.target.innerText === "起点") {
          draw.addStartP(result);
        } else if (e.target.innerText === "终点") {
          draw.addEndP(result);
        } else if (e.target.innerText === "途径点") {
          draw.addMiddleP(result);
        }
      },
    });
  }

  const getUi = () => {
    console.log(features, "oooo");

    if (features.length === 0) {
      return (
        <li>
          <a href="#">起点</a>
        </li>
      );
    } else if (features.length === 1) {
      return (
        <li>
          <a href="#">终点</a>
        </li>
      );
    } else {
      return (
        <li>
          <a href="#">途径点</a>
        </li>
      );
    }
  };

  return (
    <div>
      <div className="lmap" id="map"></div>
      <div ref={(_ref) => (ref = _ref)} className="contextmenu">
        <ul>{getUi()}</ul>
      </div>
    </div>
  );
};
