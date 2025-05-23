import "./map.css";
import "ol/ol.css";
import { useEffect } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import XYZ from "ol/source/XYZ";
import ImageStatic from "ol/source/ImageStatic";
import { transformExtent, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import url from "./1.png";
import Vector from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Layer from "ol/layer/Layer";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";
import { asArray } from "ol/color";
import { packColor, parseLiteralStyle } from "ol/webgl/styleparser.js";

import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import { Fill, Style, Stroke, Icon  } from "ol/style";
import Projection from "ol/proj/Projection";
import svg from "../icon.svg"
import {
  ImageArcGISRest,
  WMTS,
  ImageWMS,
  VectorTile as VectorTileSource,
} from "ol/source";
import WMTSTileGrid from "ol/tilegrid/WMTS";

export const GradeColors: { [key: string]: string } = {
  优: "#33cc33",
  良: "#60fae7",
  中: "#dfed73",
  次: "#ffc691",
  差: "#f95302",
  无: "#fde981",
};
export class WebGLLayer extends Layer {
  createRenderer(): any {
    let self: any = this;
    return new WebGLVectorLayerRenderer(this, {
      fill: {
        attributes: {
          color: function (feature: any) {
            const color = asArray(feature.get("COLOR") || "#eee");
            color[3] = 0.85;
            return packColor(color);
          },
          opacity: function () {
            return 0.6;
          },
        },
      },
      stroke: {
        attributes: {
          color: function (feature: any) {
            const _index = self.values_?._index;
            const properties = feature?.values_;
            const grade = properties[`${_index}Grade`];
            const _color = GradeColors[grade]
              ? GradeColors[grade]
              : GradeColors.无;
            const color = asArray(_color);
            color[3] = 1;
            return packColor(color);
          },
          width: function () {
            return 3;
          },
          opacity: function () {
            return 1;
          },
        },
      },
    } as any) as any;
  }
}

export const Map = () => {
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
        center: transform([103, 36], "EPSG:4326", "EPSG:3857"),
        zoom: 7,
      }),
    });

    addLayer(map);
  }, []);

  async function addLayer(map: OlMap) {
    // const data = await (await fetch('/river_lanxi.geojson', { method: "GET" })).json()
    // const features = (new GeoJSON({ featureProjection: 'EPSG:3857' })).readFeatures(data)
    // const vectorSource = new VectorSource({
    //   features,
    // })
    // const vectorSource = new VectorSource({
    //   url: "https://openlayers.org/data/vector/ecoregions.json",
    //   format: new GeoJSON(),
    // });
    // const vectorLayer = new WebGLLayer({
    //   source: vectorSource,
    // });
   
    // map.addLayer(vectorLayer);
  }

  return <div className="lmap" id="map"></div>;
};
