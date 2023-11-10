import "./map.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect } from "react";
import { Viewer } from "cesium";
let viewer: any;
export const Map = () => {
  const init = async () => {
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

    const params = {
      heading: 0,
      height: 0,
      id: 202,
      lat: 37.952904,
      lon: 102.313738,
      modelId: 14,
      name: "xx",
      pitch: 0,
      remark: "xx",
      roll: 0,
      rotation: "",
      rotationX: -90,
      rotationY: 0.24,
      rotationZ: -90,
      type: "1",
      url: "http://xx.glb",
    };

    const position = Cesium.Cartesian3.fromDegrees(
      params.lon,
      params.lat,
      params.height
    );
    const mx = Cesium.Matrix3.fromRotationX(
      Cesium.Math.toRadians(params.rotationX)
    );
    const my = Cesium.Matrix3.fromRotationY(
      Cesium.Math.toRadians(params.rotationY)
    );
    const mz = Cesium.Matrix3.fromRotationZ(
      Cesium.Math.toRadians(params.rotationZ)
    );
    const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    // 平移
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    // 旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    const result = await Cesium.Model.fromGltf({
      url: params.url, //"./glb/南营水库排沙泄洪闸.glb" 如果为bgltf则为.bgltf static\ceshi\滑坡原始位置(1)\滑坡原始位置\ys.gltf
      show: true, // default
      modelMatrix: m,
    });
    const model = viewer.scene.primitives.add(result);
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(params.lon, params.lat, 5000),
    });
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="lmap" id="map">
      <div
        style={{ top: 10, left: 10, position: "absolute", zIndex: 2000 }}
      ></div>
    </div>
  );
};
