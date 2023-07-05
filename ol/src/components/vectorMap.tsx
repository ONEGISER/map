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

const mapURL = {
  "aMap-img-d":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&scale=1&x={x}&y={y}&z={z}",
  "aMap-img":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&scale=2&x={x}&y={y}&z={z}",
  "aMap-vec-d":
    "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=1&style=8&x={x}&y={y}&z={z}",
  "aMap-vec":
    "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=2&style=8&x={x}&y={y}&z={z}",
  "aMap-roadLabel":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
};


export const VectorMap = () => {
  useEffect(() => {
    const map = new OlMap({
      target: "map",
      layers: [
        // new TileLayer({
        //   source: new XYZ({
        //     url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        //   }),
        // }),
        new TileLayer({
          source: new XYZ({
            url: mapURL["aMap-vec-d"],
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

    let format = "application/vnd.mapbox-vector-tile";
    // let format = 'application/json;type=geojson';
    // let resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
    let resolutions = [
      156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125,
      9783.939619140625, 4891.9698095703125, 2445.9849047851562,
      1222.9924523925781, 611.4962261962891, 305.74811309814453,
      152.87405654907226, 76.43702827453613, 38.218514137268066,
      19.109257068634033, 9.554628534317017, 4.777314267158508,
      2.388657133579254, 1.194328566789627, 0.5971642833948135,
      0.29858214169740677, 0.14929107084870338, 0.07464553542435169,
      0.037322767712175846, 0.018661383856087923, 0.009330691928043961,
      0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952,
      5.831682455027476e-4, 2.915841227513738e-4, 1.457920613756869e-4,
    ];

    let projection = new Projection({
      code: "EPSG:3857",
      units: "m",
      axisOrientation: "neu",
    });
    let gridNames = [
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
      "EPSG:4326:19",
      "EPSG:4326:20",
      "EPSG:4326:21",
    ];

    // const layer = "surv_evalu:WATA";
    const layer = "surv_evalu:DANAD";
    let gridsetName = "3857";
    let style = "";
    let vectorTileParams: any = {
      REQUEST: "GetTile",
      SERVICE: "WMTS",
      VERSION: "1.0.0",
      LAYER: layer,
      STYLE: style,
      TILEMATRIX: gridsetName + ":{z}",
      TILEMATRIXSET: gridsetName,
      FORMAT: format,
      TILECOL: "{x}",
      TILEROW: "{y}",
    };

    let baseUrl =
      "http://60.13.54.71:30119/shanhong-geoserver/" + "/gwc/service/wmts";
    let url = baseUrl + "?";

    for (let param in vectorTileParams) {
      url = url + param + "=" + vectorTileParams[param] + "&";
    }

    const vectorLayer = new VectorTileLayer({
      style: (feature: any) => {
        const style = new Style({
          stroke: new Stroke({
            color: "rgb(21,21,20)",
            width: 1,
          }),
          fill: new Fill({
            color: "rgb(225,77,46)",
          }),
        });

        // const style = new Style({
        //   image: new Circle({
        //     radius: 2,
        //     fill: new Fill({
        //       color: "red",
        //     }),
        //   }),
        // });

        // const style=new Style({
        //   image: new Icon({
        //     anchor: [0.5, 0.5],
        //     src: svg,
        //     scale: [0.8, 0.8],
        //   }),
        // })
        // const properties = feature.getProperties();
        // if (properties) {
        //   if (properties?.ADCD?.indexOf("6229") > -1) {
        //     return style;
        //   }
        // }
        return style
          ? style
          : new Style({
              fill: new Fill({
                color: "rgba(225,77,46,0)",
              }),
            });
      },
      opacity: 1,
      zIndex: 11,
      projection: projection,
      // maxResolution: 350,
      source: new VectorTileSource({
        projection: projection,
        tileGrid: new WMTSTileGrid({
          tileSize: [256, 256],
          origin: [-2.003750834e7, 2.003750834e7],
          resolutions: resolutions,
          matrixIds: gridNames,
        }),
        format: new MVT(),
        url: url,
        wrapX: true,
        tilePixelRatio: 1,
      } as any),
    } as any);

    map.addLayer(vectorLayer);
  }

  return <div className="lmap" id="map"></div>;
};
