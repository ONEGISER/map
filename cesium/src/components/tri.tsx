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
    });

    getDatas(viewer);
    viewer.scene.debugShowFramesPerSecond = true;
  });

  function getDatas(viewer: Viewer) {
    console.time("get-data");
    axios.get("/point.geojson").then((response) => {
      const getKey = (temp: any) => {
        return `${temp[0]},${temp[1]}`;
      };
      console.timeEnd("get-data");
      const heightField = "NewField_2";
      const getData = () => {};
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
        console.log(delaunator);
        const geometryInstances: any[] = [
          // new GeometryInstance({
          //   geometry: new PolygonGeometry({
          //     polygonHierarchy: {
          //       positions: [
          //         Cartesian3.fromDegrees(112.845, 30.50581, 33),
          //         Cartesian3.fromDegrees(112.65869, 30.59447, 33),
          //         Cartesian3.fromDegrees(112.83835, 30.68593, 33),
          //       ],
          //       holes: [],
          //     },
          //   }),
          // }),
        ];
        const maskColor = new Color(255 / 255.0, 0 / 255.0, 0 / 255.0, 1);
        if (delaunator.coords) {
          const triangles: any = delaunator.triangles;
          for (let i = 0; i < triangles.length; i += 3) {
            const coord1 = points[triangles[i]];
            const x1 = coord1[0];
            const y1 = coord1[1];
            const key = getKey([x1, y1]);
            const z1 = obj[key];
            const positions: any[] = [];
            positions.push(
              Cartesian3.fromDegrees(x1, y1, z1 ? z1[heightField] : 0)
            );

            const coord2 = points[triangles[i + 1]];
            const x2 = coord2[0];
            const y2 = coord2[1];
            const key2 = getKey([x2, y2]);
            const z2 = obj[key2];
            positions.push(
              Cartesian3.fromDegrees(x2, y2, z2 ? z2[heightField] : 0)
            );

            const coord3 = points[triangles[i + 2]];
            const x3 = coord3[0];
            const y3 = coord3[1];
            const key3 = getKey([x3, y3]);
            const z3 = obj[key3];
            positions.push(
              Cartesian3.fromDegrees(x3, y3, z3 ? z3[heightField] : 0)
            );
            const g = new GeometryInstance({
              geometry: new PolygonGeometry({
                polygonHierarchy: {
                  positions,
                  holes: [],
                },
              }),
              attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(maskColor),
              },
            });
            if (i === 0) {
              viewer.entities.add({
                //点的位置
                position: Cesium.Cartesian3.fromDegrees(x1, y1),
                //点
                point: {
                  pixelSize: 10, //点的大小
                  color: Cesium.Color.RED, //点的颜色
                },
              });
            }
            // viewer.entities.add({
            //   //点的位置
            //   position: Cesium.Cartesian3.fromDegrees(x2, y2),
            //   //点
            //   point: {
            //     pixelSize: 10, //点的大小
            //     color: Cesium.Color.RED, //点的颜色
            //   },
            // });
            // viewer.entities.add({
            //   //点的位置
            //   position: Cesium.Cartesian3.fromDegrees(x3, y3),
            //   //点
            //   point: {
            //     pixelSize: 10, //点的大小
            //     color: Cesium.Color.RED, //点的颜色
            //   },
            // });
            geometryInstances.push(g);
          }

          const pri = new Primitive({
            geometryInstances,
            appearance: new EllipsoidSurfaceAppearance({
              aboveGround: true,
              material: new Material({
                fabric: {
                  type: "Color",
                  uniforms: {
                    color: maskColor,
                  },
                },
              }),
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
