import "./map.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect } from "react";
import axios from "axios";
import {
  BillboardGraphics,
  Cartesian3,
  CesiumTerrainProvider,
  defined,
  GeographicTilingScheme,
  HeightReference,
  Rectangle,
  Resource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  WebMapTileServiceImageryProvider,
} from "cesium";
import { Popup } from "./popup";
let inter: any, entity: any, start: any, stop: any, viewer: any;
export const Map = () => {
  const init = async () => {
    const key = "4267820f43926eaf808d61dc07269beb";
    // const attribution = '&copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'
    // const dom = document.createElement("div")
    // dom.innerHTML = attribution
    let wmts = new Cesium.ArcGisMapServerImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    });

    viewer = new Viewer("map", {
      imageryProvider: wmts,
      infoBox: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      // creditContainer: dom,
      baseLayerPicker: false,
    });
    getViewerCamera();
    // viewer.camera.flyTo({
    //   destination: Cartesian3.fromDegrees(102.68587, 37.94787, 30000),
    // });

    // const tileset = viewer.scene.primitives.add(
    //   new Cesium.Cesium3DTileset({
    //     url: "http://192.168.6.35:8091/shaoxing/tileset.json",
    //     //url: Cesium.IonResource.fromAssetId(96188),
    //   })
    // );

    // viewer.scene.primitives.add(tileset);

    // viewer.zoomTo(tileset)

    const result = viewer.dataSources.add(
      Cesium.GeoJsonDataSource.load("/B3router.json")
    );
    viewer.zoomTo(result);

    const flyDatas = await (await fetch("/B3router.json")).json();
    viewer.scene.debugShowFramesPerSecond = true;

    const createPosition = (featuresData: any, time: any, height?: any) => {
      let totalDistance = 0; //总的距离
      const distances: any[] = [];
      const positions: any[] = [];
      const times: any[] = [];
      const property = new Cesium.SampledPositionProperty();
      if (featuresData?.features) {
        featuresData?.features.map((datas: any) => {
          if (datas) {
            for (let i in datas.geometry.coordinates) {
              const coordinates = datas.geometry.coordinates[i];
              const position = Cesium.Cartesian3.fromDegrees(
                coordinates[0],
                coordinates[1],
                height ? height : coordinates[2]
              );
              positions.push(position);
              if (Number(i) === 0) {
              } else {
                const lastPosition = positions[Number(i) - 1];
                const geoPositions = [
                  Cesium.Ellipsoid.WGS84.cartesianToCartographic(lastPosition),
                  Cesium.Ellipsoid.WGS84.cartesianToCartographic(position),
                ];
                const ellipsoidGeodesic = new Cesium.EllipsoidGeodesic(
                  geoPositions[0],
                  geoPositions[1]
                );
                const distance = ellipsoidGeodesic.surfaceDistance; //表面距离
                distances.push(distance);
                totalDistance += distance;
              }
            }
            const speed = totalDistance / time;
            let start, stop;
            for (let i in positions) {
              const position = positions[i];
              if (Number(i) === 0) {
                start = Cesium.JulianDate.now();
                // stop = Cesium.JulianDate.addSeconds(start, time, new Cesium.JulianDate())
                property.addSample(start, position);
                times.push(start.clone());
              } else {
                const _time = distances[Number(i) - 1] / speed; //根据速度计算本线段的时间
                const tempTime: any = Cesium.JulianDate.addSeconds(
                  times[Number(i) - 1],
                  _time,
                  new Cesium.JulianDate()
                );
                times.push(tempTime);
                property.addSample(tempTime, position);
              }
            }
          }
        });
      }
      return { property, times, totalDistance };
    };

    const viewFly = (viewer: any, datas: any) => {
      const id = "router-fly-line";
      const time = 240;
      const { property, times, totalDistance } = createPosition(
        datas,
        time,
        10
      );
      if (times && times.length > 1) {
        start = times[0];
        stop = times[times.length - 1];
        const availability = new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start,
            stop,
          }),
        ]);
        const entityOption: any = {
          id,
          name: id,
          availability,
          position: property,
          orientation: new Cesium.VelocityOrientationProperty(property),
          path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.1,
              color: Cesium.Color.RED,
            }),
            width: 1,
            show: true,
          },
        };
        const model = {
          show: true,
          uri: "/feiji.glb",
          scale: 0.005,
          heightReference: Cesium.HeightReference.NONE,
        };
        entityOption.model = model;

        entity = viewer.entities.add(entityOption);

        viewer.clock.startTime = start.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
        viewer.clock.shouldAnimate = false;
      }
    };

    function setClockCurrentTime(time: any) {
      viewer.clock.currentTime = Cesium.JulianDate.addSeconds(
        start,
        time,
        new Cesium.JulianDate()
      );
    }

    viewFly(viewer, flyDatas);
  };
  useEffect(() => {
    init();
  }, []);

  let t = 0;
  function interFun() {
    inter = setInterval(() => {
      t++;
      console.log(t);
      if (t === 1) {
        console.log(viewer.camera);
      }
      if (t === 30) {
        console.log(viewer.camera);
      }
    }, 1000);
  }

  function setViewer() {
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        112.66861917153443,
        30.59891221215852,
        62.68867930101866
      ), // 点的坐标
      orientation: {
        heading: Cesium.Math.toRadians(308.0999888103417),
        pitch: Cesium.Math.toRadians(-34.69146538911038),
        roll: Cesium.Math.toRadians(0.0002179604478401762),
      },
    });
  }

  const onFly = () => {
    viewer.trackedEntity = entity;
    setTimeout(() => {
      setViewer();
    }, 100);

    viewer.clock.shouldAnimate = true;
    interFun();
  };

  const onStop = () => {
    viewer.clock.shouldAnimate = false;
  };

  const getViewerCamera = () => {
    const { scene } = viewer;
    const eventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    eventHandler.setInputAction((movement: any) => {
      const position = movement.position;
      const car3 = cartesian2ToCartesian3(position);
      const lnglat = cartesian3ToLngLat(car3);
      console.log("鼠标经纬度：", lnglat);
      const heading = Cesium.Math.toDegrees(viewer.camera.heading);
      const pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
      const roll = Cesium.Math.toDegrees(viewer.camera.roll);
      const cartographic = viewer.camera.positionCartographic;
      const { height, longitude, latitude } = cartographic;

      const result = {
        height,
        longitude: Cesium.Math.toDegrees(longitude),
        latitude: Cesium.Math.toDegrees(latitude),
        heading,
        pitch,
        roll,
      };
      console.log(
        `"heading": ${result.heading},
        "pitch": ${result.pitch}, 
         "roll": ${result.roll},
        "lon":${result.longitude},         
         "lat":${result.latitude},
         "height":${result.height}`
      );
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
  };
  const cartesian2ToCartesian3 = (position: any) => {
    let cartesian3 = null;
    if (viewer && position) {
      const picks = viewer.scene.drillPick(position);
      let isOn3dtiles = false;
      for (let i in picks) {
        //为了防止别人用了Array.prototype扩展后出现bug
        if (!isNaN(Number(i))) {
          const pick = picks[i];
          isOn3dtiles =
            (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
            (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
            (pick && pick.primitive instanceof Cesium.Model);
          if (isOn3dtiles) {
            viewer.scene.pick(position);
            cartesian3 = viewer.scene.pickPosition(position);
            if (cartesian3) {
              const cartographic =
                Cesium.Cartographic.fromCartesian(cartesian3);
              if (cartographic.height < 0) cartographic.height = 0;
              const lon = Cesium.Math.toDegrees(cartographic.longitude),
                lat = Cesium.Math.toDegrees(cartographic.latitude),
                height = cartographic.height;
              cartesian3 = lnglatToCartesian3(lon, lat, height);
              return cartesian3;
            }
          }
        }
      }

      //不在模型上
      if (!isOn3dtiles) {
        const isTerrain =
          viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider; //是否存在地形
        if (!isTerrain) {
          //无地形
          const ray = viewer.scene.camera.getPickRay(position);
          if (!ray) return null;
          cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
          return cartesian3;
        } else {
          cartesian3 = viewer.scene.camera.pickEllipsoid(
            position,
            viewer.scene.globe.ellipsoid
          );
          if (cartesian3) {
            const position = cartesian3ToLngLat(cartesian3);
            if (position && position.height < 0) {
              cartesian3 = lnglatToCartesian3(
                position.longitude,
                position.latitude,
                0.1
              );
            }
            return cartesian3;
          }
        }
      }
    }
    return cartesian3;
  };

  /**
   * 经纬度转笛卡尔坐标
   * @param lng
   * @param lat
   * @param alt
   * @returns
   */
  const lnglatToCartesian3 = (lng: any, lat: any, alt: any) => {
    const cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
    return cartesian3;
  };

  /**
   * 笛卡尔坐标转经纬度
   * @param cartesian3
   * @returns
   */
  const cartesian3ToLngLat = (cartesian3: any) => {
    if (cartesian3) {
      const radians =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
      const latitude = Cesium.Math.toDegrees(radians.latitude); //弧度转度
      const longitude = Cesium.Math.toDegrees(radians.longitude);
      const height = radians.height;
      return { longitude, latitude, height };
    }
  };

  return (
    <div className="lmap" id="map">
      <div style={{ top: 10, left: 10, position: "absolute", zIndex: 2000 }}>
        <div
          style={{ background: "#fff", padding: 10 }}
          onClick={onFly}
          id="play"
        >
          飞行
        </div>
        <div style={{ background: "#fff", padding: 10 }} id="pause">
          暂停
        </div>
        <div style={{ background: "#fff", padding: 10 }} id="time">
          设置当前时间
        </div>
      </div>
    </div>
  );
};
