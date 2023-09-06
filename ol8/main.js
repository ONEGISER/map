import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import View from "ol/View.js";
import WMTS from "ol/source/WMTS.js";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import { get as getProjection } from "ol/proj.js";
import { getTopLeft, getWidth } from "ol/extent.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { Projection, transformExtent } from "ol/proj";
import { TileArcGISRest } from "ol/source.js";
import { Image as ImageLayer, Tile as TileLayer } from "ol/layer.js";
import { ImageArcGISRest } from "ol/source.js";
import TileGrid from "ol/tilegrid/TileGrid";
import XYZ from "ol/source/XYZ.js";
proj4.defs([
  [
    "EPSG:102025",
    "+proj=aea +lat_0=30 +lon_0=95 +lat_1=15 +lat_2=65 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  ["EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs +type=crs"],
]);

const projection = new Projection({
  code: "EPSG:4490",
  units: "degrees",
  axisOrientation: "neu",
});
projection.setExtent([-180, -90, 180, 90]);
projection.setWorldExtent([-180, -90, 180, 90]);

const lods = [
  { level: 0, resolution: 1.4078260157100582, scale: 5.91657527591555e8 },
  { level: 1, resolution: 0.7031250000000002, scale: 2.9549759305875003e8 },
  { level: 2, resolution: 0.3515625000000001, scale: 1.4774879652937502e8 },
  { level: 3, resolution: 0.17578125000000006, scale: 7.387439826468751e7 },
  { level: 4, resolution: 0.08789062500000003, scale: 3.6937199132343754e7 },
  { level: 5, resolution: 0.043945312500000014, scale: 1.8468599566171877e7 },
  { level: 6, resolution: 0.021972656250000007, scale: 9234299.783085939 },
  { level: 7, resolution: 0.010986328125000003, scale: 4617149.891542969 },
  { level: 8, resolution: 0.005493164062500002, scale: 2308574.9457714846 },
  { level: 9, resolution: 0.002746582031250001, scale: 1154287.4728857423 },
  { level: 10, resolution: 0.0013732910156250004, scale: 577143.7364428712 },
  { level: 11, resolution: 6.866455078125002e-4, scale: 288571.8682214356 },
  { level: 12, resolution: 3.433227539062501e-4, scale: 144285.9341107178 },
  { level: 13, resolution: 1.7166137695312505e-4, scale: 72142.9670553589 },
  { level: 14, resolution: 8.583068847656253e-5, scale: 36071.48352767945 },
  { level: 15, resolution: 4.2915344238281264e-5, scale: 18035.741763839724 },
  { level: 16, resolution: 2.1457672119140632e-5, scale: 9017.870881919862 },
  { level: 17, resolution: 1.0728836059570316e-5, scale: 4508.935440959931 },
  { level: 18, resolution: 5.364418029785158e-6, scale: 2254.4677204799655 },
  { level: 19, resolution: 2.682209014892579e-6, scale: 1127.2338602399827 },
  { level: 20, resolution: 1.3411045074462895e-6, scale: 563.6169301199914 },
];

register(proj4);

const resolutions = new Array(21);
const matrixIds = new Array(21);
for (let z = 0; z <= 20; ++z) {
  resolutions[z] = lods[z].resolution;
  matrixIds[z] = z;
}

const ip = "xx.xxx.xxx.xx";

const map = new Map({
  layers: [
    //切片服务
    // new TileLayer({
    //   source: new XYZ({
    //     projection,
    //     tileGrid: new TileGrid({
    //       tileSize: 256,
    //       origin: [-180, 90],
    //       resolutions: resolutions,
    //       extent: [
    //         97.85055840544861, 39.649233118920684, 98.52143382307176,
    //         40.001873962915795,
    //       ],
    //     }),
    //     url: `http://${ip}:6080/arcgis/rest/services/OneMap2/jygsddltb2021/MapServer/tile/{z}/{y}/{x}`,
    //   }),
    // }),

    //动态服务
    // new ImageLayer({
    //   source: new ImageArcGISRest({
    //     ratio: 1,
    //     params: {},
    //     url: `http://${ip}:6080/arcgis/rest/services/OneMap2/jygsddltb2021/MapServer`,
    //   }),
    // }),

    //wmts
    new TileLayer({
      source: new WMTS({
        url: `http://${ip}:6080/arcgis/rest/services/OneMap2/jygsddltb2021/MapServer/WMTS`,
        layer: "OneMap2_jygsddltb2021",
        matrixSet: "nativeTileMatrixSet",
        format: "image/png",
        projection: projection,
        tileGrid: new WMTSTileGrid({
          extent: [
            97.85055840544861,
            39.649233118920684,
            98.52143382307176,
            40.001873962915795,
          ],
          origin: [-180, 90],
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: "default",
        wrapX: true,
      }),
    }),
  ],
  target: "map",
  view: new View({
    projection,
    center: [98.24589, 39.79503],
    zoom: 10,
  }),
});
