import "./map.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect } from "react";
import axios from "axios";
import {
  BillboardGraphics,
  Cartesian3,
  CesiumTerrainProvider,
  ClassificationType,
  Color,
  ColorGeometryInstanceAttribute,
  defined,
  EllipsoidSurfaceAppearance,
  GeographicTilingScheme,
  GeometryInstance,
  GroundPrimitive,
  HeightReference,
  Material,
  PolygonGeometry,
  PolygonHierarchy,
  Primitive,
  Rectangle,
  Resource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  WebMapTileServiceImageryProvider,
} from "cesium";
import { Popup } from "./popup";
import { log } from "console";
import { Delaunator } from "./delaunay";
export const Map = () => {
  useEffect(() => {
    const key = "4267820f43926eaf808d61dc07269beb";
    // const attribution = '&copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'
    // const dom = document.createElement("div")
    // dom.innerHTML = attribution
    let wmts = new Cesium.ArcGisMapServerImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    });

    const viewer = new Viewer("map", {
      imageryProvider: wmts,
      infoBox: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      // creditContainer: dom,
      baseLayerPicker: false,
      terrainProvider: new CesiumTerrainProvider({
        url: "http://www.freexgis.com/web-data/terrain",
      }),
    });

    getDatas(viewer);
    viewer.scene.debugShowFramesPerSecond = true;
  });

  function getDatas(viewer: Viewer) {
    const heightField = "NewField_2";
    const limit = 300;

    console.time("get-data");
    axios.get("/point.geojson").then((response) => {
      const getKey = (temp: any) => {
        return `${temp[0]},${temp[1]}`;
      };
      console.timeEnd("get-data");
      if (response.data) {
        const { data } = response;
        console.log(data);
        let datas: any[] = [];
        const points: any[] = [];
        const obj: any = {};
        console.time("hanlder-data");
        data.features.forEach((el: any) => {
          const temp = el.geometry.coordinates;
          if (temp) {
            datas.push(temp[0]);
            datas.push(temp[1]);
            points.push([temp[0], temp[1]]);
            obj[getKey(temp)] = el.properties;
          }
        });
        console.timeEnd("hanlder-data");
        console.time("tri-data");
        const delaunator = new Delaunator(datas);
        console.timeEnd("tri-data");
        const geometryInstances: any[] = [];

        if (delaunator.coords) {
          const triangles: any = delaunator.triangles;
          for (let i = 0; i < triangles.length; i += 3) {
            const coord1 = points[triangles[i]];
            const x1 = coord1[0];
            const y1 = coord1[1];
            const key = getKey([x1, y1]);
            const z1 = obj[key];
            const positions: any[] = [];
            const height1 = z1 ? z1[heightField] : 0;
            positions.push(Cartesian3.fromDegrees(x1, y1, height1));

            const coord2 = points[triangles[i + 1]];
            const x2 = coord2[0];
            const y2 = coord2[1];
            const key2 = getKey([x2, y2]);
            const z2 = obj[key2];
            const height2 = z2 ? z2[heightField] : 0;
            positions.push(Cartesian3.fromDegrees(x2, y2, height2));

            const coord3 = points[triangles[i + 2]];
            const x3 = coord3[0];
            const y3 = coord3[1];
            const key3 = getKey([x3, y3]);
            const z3 = obj[key3];
            const height3 = z3 ? z3[heightField] : 0;
            positions.push(Cartesian3.fromDegrees(x3, y3, height3));

            const d1 = Cartesian3.distance(positions[0], positions[1]);
            const d2 = Cartesian3.distance(positions[1], positions[2]);
            const d3 = Cartesian3.distance(positions[0], positions[2]);

            if (d1 > limit || d2 > limit || d3 > limit) {
              continue;
            }

            const result = (height1 + height2 + height3) / 3;
            let color;

            if (result <= 5) {
              color = "#00ffff";
            } else if (result <= 20) {
              color = "#00ffbf";
            } else if (result <= 25) {
              color = "#80ff00";
            } else if (result <= 30) {
              color = "#ffff00";
            } else if (result <= 35) {
              color = "#ffbf00";
            } else if (result <= 40) {
              color = "#ff8000";
            } else if (result <= 45) {
              color = "#ff4000";
            } else {
              color = "#ff0000";
            }

            const g = new GeometryInstance({
              geometry: new PolygonGeometry({
                perPositionHeight: true,
                polygonHierarchy: {
                  positions,
                  holes: [],
                },
              }),
              attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(
                  Color.fromCssColorString(color)
                ),
              },
            });
            geometryInstances.push(g);
          }

          const pri = new Primitive({
            geometryInstances,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: true,
            }),
            show: true,
          });

          viewer.scene.primitives.add(pri);

          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              112.68874573880133,
              30.599235009391204,
              50000
            ),
          });
        }
      }
    });
  }
  return <div className="lmap" id="map"></div>;
};
