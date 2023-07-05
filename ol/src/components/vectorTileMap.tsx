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
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import { Fill, Style, Stroke, Icon } from "ol/style";
import Projection from "ol/proj/Projection";
import svg from "../icon.svg";
import png from "../起点.png";

import {
  ImageArcGISRest,
  WMTS,
  ImageWMS,
  VectorTile as VectorTileSource,
} from "ol/source";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import VectorTile from "ol/layer/VectorTile.js";
import WebGLVectorTileLayerRenderer from "ol/renderer/webgl/VectorTileLayer.js";
import { packColor, parseLiteralStyle } from "ol/webgl/styleparser.js";
const result = parseLiteralStyle({
  "fill-color": ["get", "fillColor"],
  "stroke-color": ["get", "strokeColor"],
  "stroke-width": ["get", "strokeWidth"],
  symbol: {
    symbolType: "circle",
    size: 10,
    color: "#e83916",
    // symbolType: 'image',
    //   src: 'imgs/icon.png',
    //   size: [18, 28],
    //   color: 'lightyellow',
    //   rotateWithView: false,
    //   offset: [0, 9],
  },
} as any);
class WebGLVectorTileLayer extends VectorTile {
  createRenderer(): any {
    return new WebGLVectorTileLayerRenderer(this, {
      style: {
        fill: {
          fragment: result.builder.getFillFragmentShader(),
          vertex: result.builder.getFillVertexShader(),
        },
        stroke: {
          fragment: result.builder.getStrokeFragmentShader(),
          vertex: result.builder.getStrokeVertexShader(),
        },
        symbol: {
          fragment: result.builder.getSymbolFragmentShader(),
          vertex: result.builder.getSymbolVertexShader(),
        },
        attributes: {
          fillColor: {
            size: 3,
            callback: (feature: any) => {
              const self: any = this;
              const style = self.getStyle()(feature, 1)[0];

              const color = asArray(style?.getFill()?.getColor() || "#5cb85c");
              return packColor(color);
            },
          },
          strokeColor: {
            size: 2,
            callback: (feature: any) => {
              const self: any = this;
              const style = self.getStyle()(feature, 1)[0];
              // const color = asArray(style?.getStroke()?.getColor() || "#eee");
              const color = asArray("#e83916");
              return packColor(color);
            },
          },
          strokeWidth: {
            size: 1,
            callback: (feature: any) => {
              const self: any = this;
              const style = self.getStyle()(feature, 1)[0];
              return style?.getStroke()?.getWidth() || 0;
            },
          },
        },
      } as any,
    });
  }
}

export const VectorTileMap = () => {
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
    const layer = "surv_evalu:VILLAGE";
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

    const vectorLayer = new WebGLVectorTileLayer({
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

    map.on('pointermove', function (ev) {
      map.forEachFeatureAtPixel(ev.pixel, function (feature) {
        console.log(feature);
        
      });
    });
  }

  return <div className="lmap" id="map"></div>;
};
