import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import Image from "ol/layer/Image.js";
import TileWMS from "ol/source/TileWMS.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat } from "ol/proj.js";
import { addCoordinateTransforms, addProjection, transform } from "ol/proj.js";
import ImageWMS from "ol/source/ImageWMS.js";
import * as turf from "@turf/turf";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Style, Circle, Stroke, Fill } from "ol/style.js";
import LineString from "ol/geom/LineString.js";

const map = new Map({
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
          'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      }),
    }),
  ],
  target: "map",
  view: new View({
    center: transform([103, 36], "EPSG:4326", "EPSG:3857"),
    zoom: 8,
  }),
});

const layer = new Image({
  // extent: [-13884991, 2870341, -7455066, 6338219],
  // source: new TileWMS({
  //   url: "http://xx.71.70.150:8191/geoserver/mapping/wms", // 请求地址
  //   CRS: "EPSG:4326",
  //   params: {
  //     // 请求的参数设置，其余参数可以不设置，使用默认的参数
  //     LAYERS: "mapping:location_heatmap", // 请求的图层名
  //     VERSION: "1.3.0",
  //     // cql_fiter:
  //     //   "id in ('1738891079809134594','1738891023559323649','1738890851890655233','1738891039929692161','1738891890295468034','1738891877343457282','1738891859966455810','1738891847802974210','1738891818325405697','1738891808523317249','1738891834637053954','1738891756539113473','1738891735857000449','1738891792404606977','1738891779704254465','1738891717821493249','1738891709386747905','1738891676889280513','1738891650465165314','1738891635789295617','1738891608643760129','1738890898673922050','1738891589941358594','1738891571553529857','1738891498593611777','1738891550305185793','1738891533079179266','1738891447997722625','1738891429077217281','1738891471192223745','1738891390988742658','1738891409162661890','1738891372080820225','1738891355190358018','1738891316812476417','1738891338413142018','1738891296096808962','1738891284289843201','1738891266556325889','1738890881422749698','1738891236227313665','1738891148780269570','1738891247631626241','1738891166656393218','1738891135299776513','1738891117947940866','1738891208372940801','1738891183341334530','1738891096976420865','1738891007709048834','1738890948032491521','1738890910568968194')",
  //   },
  // }),
  source: new ImageWMS({
    url: "http://xx.71.70.150:8191/geoserver/mapping/wms",
    params: {
      VERSION: "1.1.1",
      STYLES: "",
      LAYERS: "mapping:location_heatmap",
      exceptions: "application/vnd.ogc.se_inimage",
      cql_fiter:
        "id in ('1738891079809134594','1738891023559323649','1738890851890655233','1738891039929692161','1738891890295468034','1738891877343457282','1738891859966455810','1738891847802974210','1738891818325405697','1738891808523317249','1738891834637053954','1738891756539113473','1738891735857000449','1738891792404606977','1738891779704254465','1738891717821493249','1738891709386747905','1738891676889280513','1738891650465165314','1738891635789295617','1738891608643760129','1738890898673922050','1738891589941358594','1738891571553529857','1738891498593611777','1738891550305185793','1738891533079179266','1738891447997722625','1738891429077217281','1738891471192223745','1738891390988742658','1738891409162661890','1738891372080820225','1738891355190358018','1738891316812476417','1738891338413142018','1738891296096808962','1738891284289843201','1738891266556325889','1738890881422749698','1738891236227313665','1738891148780269570','1738891247631626241','1738891166656393218','1738891135299776513','1738891117947940866','1738891208372940801','1738891183341334530','1738891096976420865','1738891007709048834','1738890948032491521','1738890910568968194')",
    },
  }),
});

map.addLayer(layer);

const p1 = new Point(
  transform([119.0330992609, 34.1710130652], "EPSG:4326", "EPSG:3857")
);
const p2 = new Point(
  transform([119.3247386817, 34.65488726], "EPSG:4326", "EPSG:3857")
);
const p = new Point(
  transform([119.14986369253056, 34.349999252739885], "EPSG:4326", "EPSG:3857")
);
const p1F = new Feature(p1);
const p2F = new Feature(p2);
const pF = new Feature(p);
const temp = [
  transform([119.0330992609, 34.1710130652], "EPSG:4326", "EPSG:3857"),
  transform([119.3247386817, 34.65488726], "EPSG:4326", "EPSG:3857"),
];
console.log(temp);
const line2 = new LineString(temp);
const lineF = new Feature({ geometry: line2 });

const layer2 = new VectorLayer({
  source: new VectorSource({ features: [p1F, p2F, pF, lineF] }),
  style: new Style({
    image: new Circle({
      radius: 5, //半径
      fill: new Fill({
        //填充样式
        color: "#ff6688",
      }),
      stroke: new Stroke({
        //边界样式
        color: "#555555",
        width: 1,
      }),
    }),
  }),
});

const layer3 = new VectorLayer({
  source: new VectorSource({ features: [lineF] }),
  style: new Style({
    stroke: new Stroke({
      //边界样式
      color: "red",
      width: 1,
    }),
  }),
});
map.addLayer(layer2);
map.addLayer(layer3);

var line = turf.lineString([
  [119.0330992609, 34.1710130652],
  [119.3247386817, 34.65488726],
]);
var pt = turf.point([119.14986369253056, 34.349999252739885]);

var snapped = turf.nearestPointOnLine(line, pt, { units: "miles" });

const temp2 = snapped.geometry.coordinates;
const temp2p = new Point(transform(temp2, "EPSG:4326", "EPSG:3857"));
const temp2pF = new Feature(temp2p);
console.log(snapped);

const layer4 = new VectorLayer({
  source: new VectorSource({ features: [temp2pF] }),
  style: new Style({
    image: new Circle({
      radius: 5, //半径
      fill: new Fill({
        //填充样式
        color: "green",
      }),
      stroke: new Stroke({
        //边界样式
        color: "#555555",
        width: 1,
      }),
    }),
  }),
});

map.addLayer(layer4);

