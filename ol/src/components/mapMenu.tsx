import "./map.css";
import "ol/ol.css";
import { useEffect } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { Contextmenu } from "./utils/contextmenu";
import { Draw } from "./utils/draw";

let ref: any;
let menu: any;
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

    addMenu(map);
  }, []);

  async function addMenu(map: OlMap) {
    menu = new Contextmenu(map, ref, {
      onClick: (e: any, coord) => {
        console.log(e, coord);

        const draw = new Draw(map);
        const result = transform(coord, "EPSG:4326", "EPSG:3857");
        draw.addStartP(result);
      },
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
